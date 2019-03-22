import Task from '@algebraic-effects/task';
import { series } from '@algebraic-effects/task/fns';
import { isGenerator, flatten, identity, compose } from '@algebraic-effects/utils';
import { Operation, isOperation, VALUE_HANDLER, HANDLER, func } from './utils';
import genericHandlers, { createGenericEffect } from './generic';

// type Program = GeneratorFunction
// type Handler = (Program ...a b, ...a) -> Task e b

// runProgram :: (Program, ...a) -> Iterator
const runProgram = (program, ...args) => {
  const p = program.constructor.name === 'GeneratorFunction' ? program(...args) : program;
  if (!isGenerator(p))
    throw new Error('Not a valid program. You need to pass either a generator function or a generator instance');
  return p;
};

// operationName :: (String, String) -> String
const operationName = (effect, op) => effect ? `${effect}[${op}]` : op;

// getNextValue :: (Program, *) -> { value :: *, done :: Boolean, error :: ?Error }
const getNextValue = (program, nextVal) => {
  try {
    return program.next(nextVal);
  } catch(e) {
    return { done: true, error: e };
  }
};

// createHandler :: (Object Function, { effect :: String }) -> Handler
const createHandler = (_handlers = {}, { effect = 'GenericEffect', isComposed = false } = {}) => {
  const valueHandler = _handlers._ || VALUE_HANDLER;

  const handlers = isComposed ? _handlers : Object.keys(_handlers).reduce((acc, key) => ({
    ...acc,
    [operationName(effect, key)]: _handlers[key],
  }), {});

  const evaluateYieldedValue = ({ value, done, error }, flowOperators) => {
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

  const getTerminationOps = ({ program, task, reject, resolve, mapResult = identity }) => {

    // throwError :: * -> ()
    const throwError = x => {
      program.return(x);
      !task.isCancelled && reject(x);
    };

    // end  :: * -> ()
    const end = (...args) => {
      const value = mapResult(...args);
      program.return(value);
      !task.isCancelled && resolve(value);
    };

    return { throwError, end };
  };

  const FlowOps = ({ resume, end, throwError }) => {
    const call = (p, ...a) => effectHandlerInstance.run(p, ...a);
    const callMulti = (p, ...a) => effectHandlerInstance.runMulti(p, ...a);
    const promise = promise => promise.then(resume).catch(throwError);
    return { resume, end, throwError, call, callMulti, promise };
  };

  const effectHandlerInstance = (p, ...args) => {
    const task = Task((reject, resolve) => {
      const program = runProgram(p, ...args);
  
      const { end, throwError } = getTerminationOps({ program, task, reject, resolve });
  
      // resume :: * -> ()
      const resume = x => {
        if(task.isCancelled) return program.return(null);

        let isResumed = false;
        const resumeOperation = (...args) => {
          if(task.isCancelled) return program.return(null);
          !isResumed && resume(...args);
          isResumed = true;
        };

        const flowOperators = FlowOps({ resume: resumeOperation, end, throwError });
        evaluateYieldedValue(getNextValue(program, x), flowOperators);
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

  // concat :: Handler -> Handler
  effectHandlerInstance.concat = run1 => createHandler(
    { ...handlers, ...run1.handlers },
    { effect: `${effectHandlerInstance.effectName}.${run1.effectName}`, isComposed: true },
  );

  // with :: (Handler | Object OpBehavior) -> Handler
  effectHandlerInstance.with = runner => effectHandlerInstance.concat(
    runner.$$type === HANDLER
      ? runner
      : createHandler(runner, { effect: '' })
  );

  // run :: Handler
  effectHandlerInstance.run = effectHandlerInstance;

  // runMulti :: Handler
  effectHandlerInstance.runMulti = (p, ...args) => {
    const runInstance = (value = null, stateCache = []) => {
      const task = Task((reject, resolve) => {
        const program = runProgram(p, ...args);
        let cleanup = () => {};
        let results = [];

        // Fast forward
        stateCache.forEach(x => program.next(x));
    
        const { end, throwError } =
          getTerminationOps({ program, task, reject, resolve, mapResult: (...x) => [...results, ...x] });

        // resume :: * -> ()
        const resume = x => {
          if(task.isCancelled) return program.return(null);

          stateCache = [...stateCache, x];

          const iterationValue = getNextValue(program, x);
          const { value } = iterationValue;
  
          let isResumed = false; // Identifier for multiple resume calls from one op
          const pendingTasks = [];

          const resumeOperation = v => {
            if(task.isCancelled) return program.return(null);

            if(isOperation(value) && value.isMulti) {
              if(isResumed) {
                pendingTasks.push(v);
              } else {
                isResumed = true;
                const cancelFn = runInstance(v, stateCache).fork(
                  throwError,
                  result => {
                    results = [...results, ...result];
                    const tasks = pendingTasks.map(val => runInstance(val, stateCache));

                    const cancelFn = series(tasks).fork(
                      throwError,
                      r => {
                        isResumed = false;
                        end(...flatten(r));
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
          };

          const flowOperators = FlowOps({ resume: resumeOperation, end, throwError });
          evaluateYieldedValue(iterationValue, flowOperators);
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

// createEffect :: (String, Object *) -> Effect
export const createEffect = (name, operations) => ({
  name,
  operations,
  handler: handlers => createHandler(handlers, { effect: name }),
  extendAs: (newName, newOps) => createEffect(newName, { ...operations, ...newOps }),

  ...Object.keys(operations).reduce((acc, opName) => ({
    ...acc,
    [opName]: Operation(operationName(name, opName), operations[opName]),
  }), {}),
});

// composeHandlers :: ...Handler -> Handler
export const composeHandlers = (...runners) => runners.reduce((a, b) => a.concat(b));

// run :: Handler
export const run = createHandler();

export { func, createGenericEffect, Operation };
