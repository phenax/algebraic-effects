import Task from '@algebraic-effects/task';
import { series } from '@algebraic-effects/task/fns';
import { isGenerator, flatten } from '@algebraic-effects/utils';
import { Operation, isOperation, VALUE_HANDLER, HANDLER, func } from './utils';
import genericHandlers, { createGenericEffect } from './generic';

// type Program = GeneratorFunction
// type Runner = (Program ...a b, ...a) -> Task e b

// runProgram :: (Program, ...a) -> Iterator
const runProgram = (program, ...args) => {
  const p = program.constructor.name === 'GeneratorFunction' ? program(...args) : program;
  if (!isGenerator(p))
    throw new Error('Not a valid program. You need to pass either a generator function or a generator instance');
  return p;
};

// operationName :: (String, String) -> String
const operationName = (effect, op) => effect ? `${effect}[${op}]` : op;

// createRunner :: (Object Function, { effect :: String }) -> Runner
const createRunner = (_handlers = {}, { effect = 'GenericEffect', isComposed = false } = {}) => {
  const valueHandler = _handlers._ || VALUE_HANDLER;

  const handlers = isComposed ? _handlers : Object.keys(_handlers).reduce((acc, key) => ({
    ...acc,
    [operationName(effect, key)]: _handlers[key],
  }), {});

  const effectRunner = (p, ...args) => {
    const task = Task((reject, resolve) => {
      const program = runProgram(p, ...args);
  
      // throwError :: * -> ()
      const throwError = x => {
        program.return(x);
        !task.isCancelled && reject(x);
      };
  
      // end  :: * -> ()
      const end = x => {
        program.return(x);
        !task.isCancelled && resolve(x);
      };

      // nextValue :: (Program, *) -> { value :: *, done :: Boolean }
      const nextValue = (program, returnVal) => {
        try {
          return program.next(returnVal);
        } catch(e) {
          throwError(e);
          return { done: true };
        }
      };
  
      // resume :: * -> ()
      const resume = x => {
        if(task.isCancelled) return program.return(null);

        const call = (p, ...a) => effectRunner(p, ...a);
        let isResumed = false;
        const resumeOperation = (...args) => {
          !isResumed && resume(...args);
          isResumed = true;
        };
        const promise = promise => promise.then(resumeOperation).catch(throwError);
        const flowOperators = { resume: resumeOperation, end, throwError, call, promise };

        const { value, done } = nextValue(program, x);
        if (done) return valueHandler(flowOperators)(value);
  
        if (isOperation(value)) {
          const runOp = handlers[value.name] || genericHandlers[value.name];

          if (!runOp) {
            throwError(new Error(`Invalid operation executed. The handler for operation "${value.name}", was not provided`));
            return;
          }

          runOp(flowOperators)(...value.payload);
        } else {
          valueHandler(flowOperators)(value);
        }
      };

      setTimeout(resume, 0);

      return () => (task.isCancelled = true);
    });

    task.isCancelled = false;
    return task;
  };

  effectRunner.$$type = HANDLER;
  effectRunner.effectName = effect;
  effectRunner.handlers = handlers;

  // concat :: Runner -> Runner
  effectRunner.concat = run1 => createRunner(
    { ...handlers, ...run1.handlers },
    { effect: `${effectRunner.effectName}.${run1.effectName}`, isComposed: true },
  );

  // with :: (Runner | Object OpBehavior) -> Runner
  effectRunner.with = runner => effectRunner.concat(
    runner.$$type === HANDLER
      ? runner
      : createRunner(runner, { effect: '' })
  );

  // run :: Runner
  effectRunner.run = effectRunner;

  effectRunner.runMulti = (p, ...args) => {
    const runInstance = (value = null, stateCache = []) => {
      const task = Task((reject, resolve) => {
        const program = runProgram(p, ...args);
        let results = [];

        // Fast forward
        stateCache.forEach(x => program.next(x));
    
        // throwError :: * -> ()
        const throwError = x => {
          program.return(x);
          !task.isCancelled && reject(x);
        };

        // end  :: * -> ()
        const end = (...x) => {
          program.return(x);
          !task.isCancelled && resolve([...results, ...x]);
        };
  
        // nextValue :: (Program, *) -> { value :: *, done :: Boolean }
        const nextValue = (program, returnVal) => {
          try {
            return program.next(returnVal);
          } catch(e) {
            throwError(e);
            return { done: true };
          }
        };
    
        // resume :: * -> ()
        const resume = x => {
          if(task.isCancelled) return program.return(null);

          stateCache.push(x);

          const { value, done } = nextValue(program, x);
  
          const call = (p, ...a) => effectRunner(p, ...a);
          let isResumed = false; // Identifier for multiple resume calls from one op
          const pendingTasks = [];

          const resumeOperation = v => {
            if(isOperation(value) && value.isMulti) {
              if(isResumed) {
                pendingTasks.push(v);
              } else {
                isResumed = true;
                runInstance(v, [...stateCache]).fork(
                  throwError,
                  result => {
                    results = [...results, ...result];
                    const tasks = pendingTasks.map(val => runInstance(val, [...stateCache]));
                    series(tasks).fork(
                      throwError,
                      r => {
                        end(...flatten(r));
                      },
                    );
                  },
                );
              }
            } else if(!isResumed) {
              isResumed = true;
              resume(v);
            }
          };
          const promise = promise => promise.then(resumeOperation).catch(throwError);
          const flowOperators = { resume: resumeOperation, end, throwError, call, promise };

          // Return
          if (done) return valueHandler(flowOperators)(value);
      
          if (isOperation(value)) {
            const runOp = handlers[value.name] || genericHandlers[value.name];
  
            if (!runOp) {
              throwError(new Error(`Invalid operation executed. The handler for operation "${value.name}", was not provided`));
              return;
            }
  
            runOp(flowOperators)(...value.payload);
          } else {
            valueHandler(flowOperators)(value);
          }
        };
  
        setTimeout(resume, 0, value);
  
        return () => (task.isCancelled = true);
      });
  
      task.isCancelled = false;
      return task;
    };

    return runInstance();
  };

  return effectRunner;
};

// createEffect :: (String, Object *) -> Effect
export const createEffect = (name, operations) => ({
  name,
  operations,
  handler: handlers => createRunner(handlers, { effect: name }),
  extendAs: (newName, newOps) => createEffect(newName, { ...operations, ...newOps }),

  ...Object.keys(operations).reduce((acc, opName) => ({
    ...acc,
    [opName]: Operation(operationName(name, opName), operations[opName]),
  }), {}),
});

// composeHandlers :: ...Runner -> Runner
export const composeHandlers = (...runners) => runners.reduce((a, b) => a.concat(b));

// run :: Runner
export const run = createRunner();

export { func, createGenericEffect, Operation };
