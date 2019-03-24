import Task from '@algebraic-effects/task';
import { series } from '@algebraic-effects/task/fns';
import { isGenerator, flatten, identity, compose } from '@algebraic-effects/utils';
import { Operation, isOperation, VALUE_HANDLER, HANDLER, func } from './utils';
import genericHandlers, { createGenericEffect } from './generic';

// type Program = GeneratorFunction
// type Handler = (Program ...a b, ...a) -> Task e b

// runProgram :: (Program, ...a) -> Iterator
function runProgram(program) {
  const args = [].slice.call(arguments, 1);
  const p = program.constructor.name === 'GeneratorFunction' ? program.apply(null, args) : program;
  if (!isGenerator(p))
    throw new Error('Not a valid program. You need to pass either a generator function or a generator instance');
  return p;
}

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
const createHandler = (_handlers, options) => {
  _handlers = _handlers || {};
  const { effect = 'GenericEffect', isComposed = false } = options || {};

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

  const getTerminationOps = ({ program, task, resolve, mapResult = identity, cancelTask }) => {

    // throwError :: * -> ()
    const throwError = e => program.throw(e);

    // end  :: * -> ()
    const end = (...args) => {
      const value = mapResult(...args);
      program.return(value);
      !task.isCancelled && resolve(value);
    };

    const cancel = x => {
      program.return(x);
      cancelTask(x);
    };

    return { throwError, end, cancel };
  };

  const FlowOps = o => {
    const call = effectHandlerInstance.run;
    const callMulti = effectHandlerInstance.runMulti;
    const promise = promise => promise.then(o.resume).catch(o.throwError);

    return { resume: o.resume, end: o.end, throwError: o.throwError, cancel: o.cancel, call, callMulti, promise };
  };

  function effectHandlerInstance() {
    const args = arguments;
    const task = Task((reject, resolve, cancelTask) => {
      const program = runProgram.apply(null, args);
  
      const termination = getTerminationOps({ program, task, reject, resolve, cancelTask });
  
      // resume :: * -> ()
      const resume = x => {
        if(task.isCancelled) return program.return(null);

        let isResumed = false;
        const resumeOperation = x => {
          if(task.isCancelled) return program.return(null);
          !isResumed && resume(x);
          isResumed = true;
        };

        const onError = e => tryNextValue(() => termination.throwError(e));
        const flowOperators = FlowOps({
          resume: resumeOperation,
          throwError: onError,
          end: termination.end,
          cancel: termination.cancel,
        });

        const tryNextValue = getValue => {
          try {
            const value = getValue();
            value && evaluateYieldedValue(value, flowOperators);
          } catch(e) {
            !task.isCancelled && reject(e);
          }
        };

        tryNextValue(() => getNextValue(program, x));
      };

      setTimeout(resume, 0);

      return () => (task.isCancelled = true);
    });

    task.isCancelled = false;
    return task;
  }

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
  effectHandlerInstance.runMulti = function() {
    const args = arguments;
    const runInstance = (value, stateCache) => {
      stateCache = stateCache || [];
      const task = Task((reject, resolve) => {
        const program = runProgram.apply(null, args);
        let cleanup = () => {};
        let results = [];

        // Fast forward
        stateCache.forEach(x => program.next(x));
    
        function mapResult() { return [...results, ...arguments]; }
        const { end, throwError } =
          getTerminationOps({ program, task, reject, resolve, mapResult });

        // resume :: * -> ()
        const resume = x => {
          if(task.isCancelled) return program.return(null);

          stateCache = [...stateCache, x];

          let flowOperators = {};
          let iterationValue = {};
  
          let isResumed = false; // Identifier for multiple resume calls from one op
          const pendingTasks = [];

          const resumeOperation = v => {
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
                        flowOperators.end(...flatten(r));
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

          function onError() {
            const args = arguments;
            tryNextValue(() => throwError.apply(null, args));
          }
          flowOperators = FlowOps({ resume: resumeOperation, end, throwError: onError });

          const tryNextValue = getValue => {
            try {
              const value = getValue();
              value && evaluateYieldedValue(value, flowOperators);
            } catch(e) {
              !task.isCancelled && reject(e);
            }
          };
  
          tryNextValue(() => (iterationValue = getNextValue(program, x)));
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
export function composeHandlers() {
  return [].slice.call(arguments).reduce((a, b) => a.concat(b));
}

// run :: Handler
export const run = createHandler();

export { func, createGenericEffect, Operation };
