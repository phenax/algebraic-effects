import Task from '@algebraic-effects/task';
import { Operation, isOperation, VALUE_HANDLER, func } from './utils';
import globalHandlers from './operations';

// type Program = GeneratorFunction
// type Runner = (Program, ...a) -> Promise

const isIterator = p => !!p[Symbol.iterator];

// runProgram :: (Program, ...a) -> Iterator
const runProgram = (program, ...args) => {
  const p = program.constructor.name === 'GeneratorFunction' ? program(...args) : program;
  if (!isIterator(p))
    throw new Error('Cant run program. Invalid generator');
  return p;
};

// createRunner :: (Object Function, { effect :: String }) -> Runner
const createRunner = (handlers = {}, { effect } = {}) => {
  const valueHandler = handlers._ || VALUE_HANDLER;

  const effectRunner = (p, ...args) => {
    const resultPromise = Task((reject, resolve) => {
      const program = runProgram(p, ...args);
  
      // throwError :: * -> ()
      const throwError = x => {
        program.return(x);
        !resultPromise.isCancelled && reject(x);
      };
  
      // end  :: * -> ()
      const end = x => {
        program.return(x);
        !resultPromise.isCancelled && resolve(x);
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
        if(resultPromise.isCancelled) return program.return(null);

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

      return () => (resultPromise.isCancelled = true);
    });

    resultPromise.isCancelled = false;
    return resultPromise;
  };

  effectRunner.effectName = effect || 'GlobalEffect';
  effectRunner.handlers = handlers;

  // concat, with :: Runner -> Runner
  effectRunner.concat = run1 => createRunner(
    { ...handlers, ...run1.handlers },
    { effect: `${effectRunner.effectName}.${run1.effectName}` },
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
  ...Object.keys(operations).reduce((acc, name) => ({
    ...acc,
    [name]: Operation(name, operations[name]),
  }), {})
});

// composeEffects :: ...Effect -> Effect
export const composeEffects = (...effects) => {
  const name = effects.map(({ name }) => `${name}`).join('.');
  const operations = effects.reduce((acc, eff) => ({ ...acc, ...eff.operations }), {});
  return createEffect(name, operations);
};

// composeHandlers :: ...Runner -> Runner
export const composeHandlers = (...runners) => runners.reduce((a, b) => a.concat(b));

// run :: Runner
export const run = createRunner();

export { func };
