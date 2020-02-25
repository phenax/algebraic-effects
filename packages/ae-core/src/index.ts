import Task from '@algebraic-effects/task';
// import { AlgebraicTask } from '@algebraic-effects/task';
import { series } from '@algebraic-effects/task/fns';
import { isGenerator, flatten, identity, compose } from '@algebraic-effects/utils';
import { createOperation, isOperation, VALUE_HANDLER, HANDLER, func } from './utils';
import genericHandlers, { createGenericEffect } from './generic';
import { Program, ProgramIterator, ProgramIteratorResult, FlowOperators, HandlerMap, TaskWithCancel, HandlerInstance, OperationMap, Effect } from './types';

export { Program, ProgramIterator, ProgramIteratorResult, FlowOperators, HandlerMap, OperationMap, Effect };

function runProgram<Args extends Array<any> = any[]>(
  program: Program<Args> | ProgramIterator,
  ...args: Args
): ProgramIterator {
  // @ts-ignore
  const p = program.constructor.name === 'GeneratorFunction' ? program(...args) : program;
  if (!isGenerator(p))
    throw new Error('Not a valid program. You need to pass either a generator function or a generator instance');
  return p;
}

const operationName = (effect: string, op: string) => effect ? `${effect}[${op}]` : op;

const getNextValue = (program: ProgramIterator, nextVal: any): ProgramIteratorResult => {
  try {
    return program.next(nextVal);
  } catch(e) {
    return { done: true, error: e };
  }
};

interface HandlerOptions {
  effect?: string;
  isComposed?: boolean;
}

const createHandler = (_handlers: HandlerMap = {}, options: HandlerOptions = {}) => {
  _handlers = _handlers || {};
  const { effect = 'GenericEffect', isComposed = false } = options || {};

  const valueHandler = _handlers._ || VALUE_HANDLER;

  const handlers = isComposed ? _handlers : Object.keys(_handlers).reduce((acc, key) => ({
    ...acc,
    [operationName(effect, key)]: _handlers[key],
  }), {});

  const evaluateYieldedValue = ({ value, done, error }: ProgramIteratorResult, flowOperators: FlowOperators) => {
    if (error) return flowOperators.throwError(error);
    if (done) return valueHandler(flowOperators)(value);

    if (isOperation(value)) {
      const runOp = handlers[value.name] || genericHandlers[value.name];

      if (!runOp) {
        flowOperators.throwError(new Error(`Invalid operation executed. The handler for operation "${value.name}", was not provided`));
        return;
      }

      runOp(flowOperators)(...value.payload);
    } else {
      valueHandler(flowOperators)(value);
    }
  };

  interface GetTermOpsOptions {
    program: ProgramIterator;
    task: TaskWithCancel;
    resolve: (v: any) => any;
    cancelTask: (x: any) => any;
    mapResult?: (...args: any[]) => any;
  }

  const getTerminationOps = ({ program, task, resolve, mapResult = identity, cancelTask }: GetTermOpsOptions) => {

    // throwError :: * -> ()
    const throwError = (e: any) => program.throw(e);

    // end  :: * -> ()
    const end = (...args: any[]) => {
      const value = mapResult.apply(null, args);
      program.return(value);
      !task.isCancelled && resolve(value);
    };

    const cancel = (x: any) => {
      program.return(x);
      cancelTask(x);
    };

    return { throwError, end, cancel };
  };

  const FlowOps = (o: Pick<FlowOperators, 'resume' | 'throwError' | 'end' | 'cancel'>) => {
    const call = effectHandlerInstance.run;
    const callMulti = effectHandlerInstance.runMulti;
    const promise = (promise: Promise<any>) => promise.then(o.resume).catch(o.throwError);

    return { resume: o.resume, end: o.end, throwError: o.throwError, cancel: o.cancel, call, callMulti, promise };
  };

  const effectHandlerInstance: HandlerInstance = <Args extends any[] = any[]>(
    programFn: Program<Args> | ProgramIterator,
    ...args: Args
  ) => {
    const task: TaskWithCancel = Task((reject, resolve, cancelTask) => {
      const program = runProgram<Args>(programFn, ...args);
  
      const termination = getTerminationOps({ program, task, resolve, cancelTask });
  
      // resume :: * -> ()
      const resume = (x: any) => {
        if(task.isCancelled) return program.return(null);

        let isResumed = false;
        const resumeOperation = (x: any) => {
          if(task.isCancelled) return program.return(null);
          !isResumed && resume(x);
          isResumed = true;
          return;
        };

        const onError = (e: any) => tryNextValue(() => termination.throwError(e));

        const flowOperators = FlowOps({
          resume: resumeOperation,
          throwError: onError,
          end: termination.end,
          cancel: termination.cancel,
        });

        const tryNextValue = (getValue: () => ProgramIteratorResult) => {
          try {
            const value = getValue();
            value && evaluateYieldedValue(value, flowOperators);
          } catch(e) {
            !task.isCancelled && reject(e);
          }
        };

        tryNextValue(() => getNextValue(program, x));

        return;
      };

      setTimeout(resume, 0);

      return () => (task.isCancelled = true);
    });

    task.isCancelled = false;
    return task;
  };

  effectHandlerInstance.$$type = HANDLER;
  effectHandlerInstance.effectName = effect;
  effectHandlerInstance.handlers = handlers;

  effectHandlerInstance.concat = run1 => createHandler(
    { ...handlers, ...run1.handlers },
    { effect: `${effectHandlerInstance.effectName}.${run1.effectName}`, isComposed: true },
  );

  effectHandlerInstance.with = runner => effectHandlerInstance.concat(
    // @ts-ignore
    runner.$$type === HANDLER ? runner : createHandler(runner, { effect: '' }),
  );

  effectHandlerInstance.run = effectHandlerInstance;

  effectHandlerInstance.runMulti = function() {
    const args = arguments;
    const runInstance = (value: any = null, stateCache: any[] = []) => {
      stateCache = stateCache || [];
      const task: TaskWithCancel = Task((reject, resolve, cancelTask) => {
        const program: ProgramIterator = runProgram.apply(null, args);
        let cleanup = (..._: any[]) => {};
        let results: any[] = [];

        // Fast forward to multi call
        stateCache.forEach(x => program.next(x));
    
        const mapResult = (...args: any[]) => [...results, ...args];
        const { end, throwError } =
          getTerminationOps({ program, task, resolve, mapResult, cancelTask });

        const resume = (x: any) => {
          if(task.isCancelled) return program.return(null);

          stateCache = [...stateCache, x];

          // @ts-ignore
          let flowOperators: FlowOperators = {};
          let iterationValue: ProgramIteratorResult = { done: false };
  
          let isResumed = false; // Identifier for multiple resume calls from one op
          const pendingTasks: any[] = [];

          const resumeOperation = (v: any) => {
            if(task.isCancelled) return program.return(null);

            if(isOperation(iterationValue.value) && iterationValue.value.isMulti) {
              if(isResumed) {
                pendingTasks.push(v);
              } else {
                isResumed = true;
                const cancelFn = runInstance(v, stateCache).fork(
                  flowOperators.throwError,
                  result => {
                    results = [...results, ...result];
                    const tasks = pendingTasks.map(val => runInstance(val, stateCache));

                    const cancelFn = series(tasks).fork(
                      flowOperators.throwError,
                      r => {
                        isResumed = false;
                        flowOperators.end.apply(null, flatten(r));
                      },
                    );

                    cleanup = compose(cleanup, cancelFn);
                  },
                );

                cleanup = compose(cleanup, cancelFn);
              }
            } else if(!isResumed) {
              isResumed = true;
              resume(v);
            }

            return null;
          };

          function onError() {
            const args = arguments;
            tryNextValue(() => throwError.apply(null, args));
          }

          flowOperators = FlowOps({ resume: resumeOperation, end, throwError: onError, cancel: cancelTask });

          const tryNextValue = (getValue: () => ProgramIteratorResult) => {
            try {
              const value = getValue();
              value && evaluateYieldedValue(value, flowOperators);
            } catch(e) {
              !task.isCancelled && reject(e);
            }
          };
  
          tryNextValue(() => (iterationValue = getNextValue(program, x)));

          return null;
        };
  
        setTimeout(resume, 0, value);
  
        return () => {
          task.isCancelled = true;
          cleanup();
        };
      });
  
      task.isCancelled = false;
      return task;
    };

    return runInstance();
  };

  return effectHandlerInstance;
};

export const createEffect = <OpMap = OperationMap>(
  name: string,
  operations: OperationMap<keyof OpMap>
): Effect<OpMap> & OpMap => {
  const effect: Effect<OpMap> = {
    name,
    operations,
    handler: (handlers: HandlerMap<keyof OpMap>) => createHandler(handlers, { effect: name }),
    extendAs: <NewOpMap = OperationMap>(
      newName: string,
      newOps?: OperationMap<keyof NewOpMap>
    ): Effect<OpMap & NewOpMap> => createEffect(newName, { ...operations, ...newOps }),
  };

  const ops: OpMap = Object.keys(operations).reduce((acc, opName) => ({
    ...acc,
    [opName]: createOperation(operationName(name, opName), operations[opName as keyof (typeof operations)]),
  }), {}) as OpMap;

  return { ...effect, ...ops };
};

export function composeHandlers() {
  return [].slice.call(arguments).reduce((a: HandlerInstance, b: HandlerInstance) => a.concat(b));
}

export const run = createHandler();

export { func, createGenericEffect, createOperation };
