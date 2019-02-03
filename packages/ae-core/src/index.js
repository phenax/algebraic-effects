import Task from '@algebraic-effects/task';
import { Operation, isOperation, VALUE_HANDLER, func } from './utils';
import globalHandlers from './operations';

// type Program = GeneratorFunction
// type Runner = (Program ...a b, ...a) -> Task e b

// isGenerator :: Generator? -> Boolean
const isGenerator = p => p.constructor === (function*(){}()).constructor;

// runProgram :: (Program, ...a) -> Iterator
const runProgram = (program, ...args) => {
  const p = program.constructor.name === 'GeneratorFunction' ? program(...args) : program;
  if (!isGenerator(p))
    throw new Error('Not a valid program. You need to pass either a generator function or a generator instance');
  return p;
};

// operationName :: (String, String) -> String
const operationName = (effect, op) => `${effect}[${op}]`;

// createRunner :: (Object Function, { effect :: String }) -> Runner
const createRunner = (_handlers = {}, { effect, isComposed = false } = {}) => {
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
        const promise = promise => promise.then(resume).catch(throwError);
        const flowOperators = { resume, end, throwError, call, promise };

        const { value, done } = nextValue(program, x);
        if (done) return valueHandler(flowOperators)(value);
  
        if (isOperation(value)) {
          const runOp = handlers[value.name] || globalHandlers[value.name];

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

  effectRunner.effectName = effect || 'GlobalEffect';
  effectRunner.handlers = handlers;

  // concat, with :: Runner -> Runner
  effectRunner.concat = run1 => createRunner(
    { ...handlers, ...run1.handlers },
    { effect: `${effectRunner.effectName}.${run1.effectName}`, isComposed: true },
  );
  effectRunner.with = effectRunner.concat;

  // run :: Runner
  effectRunner.run = effectRunner;

  return effectRunner;
};

// createEffect :: (String, Object *) -> Effect
export const createEffect = (name, operations) => ({
  name,
  operations,
  handler: handlers => createRunner(handlers, { effect: name }),
  ...Object.keys(operations).reduce((acc, opName) => ({
    ...acc,
    [opName]: Operation(operationName(name, opName), operations[opName]),
  }), {}),
  extend: (newName, newOperations) =>
    createEffect(newName, { ...operations, ...newOperations }),
});

// composeHandlers :: ...Runner -> Runner
export const composeHandlers = (...runners) => runners.reduce((a, b) => a.concat(b));

// run :: Runner
export const run = createRunner();

export { func };
