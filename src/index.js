
import { Operation, isOperation, VALUE_HANDLER, func } from './utils';
import globalHandlers from './operations';

// type Program = GeneratorFunction
// type Runner = (Program, ...a) -> Promise

// createRunner :: (Object Function) -> Runner
const createRunner = (handlers = {}) => {
  // TODO: Validate if all handlers are specified

  const valueHandler = handlers._ || VALUE_HANDLER;

  const effectRunner = (program, ...args) => new Promise((resolve, reject) => {
    const g = program(...args);
    effectRunner.isCancelled = false;

    // throwError :: * -> ()
    const throwError = x => {
      g.return(x);
      !effectRunner.isCancelled && reject(x);
    };

    // end  :: * -> ()
    const end = x => {
      g.return(x);
      !effectRunner.isCancelled && resolve(x);
    };

    // resume :: * -> ()
    const resume = x => {
      if(effectRunner.isCancelled) return;

      const { value, done } = g.next(x);

      const call = (...a) => effectRunner(...a).then(resume).catch(throwError);
      const flowOperators = { resume, end, throwError, call };

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

    return resume();
  });

  effectRunner.isCancelled = false;
  effectRunner.handlers = handlers;

  // concat, with :: Runner -> Runner
  effectRunner.concat = run1 => createRunner({ ...handlers, ...run1.handlers });
  effectRunner.with = effectRunner.concat;

  // run :: Runner
  effectRunner.run = effectRunner;

  // cancel :: () -> ()
  effectRunner.cancel = () => (effectRunner.isCancelled = true);

  return effectRunner;
};

// createEffect :: (String, Object *) -> Effect
export const createEffect = (name, operations) => {
  const effectful = {
    name,
    operations,
    handler: createRunner,
  };

  Object.keys(operations).forEach(name => {
    effectful[name] = Operation(name, operations[name]);
  });

  return effectful;
};

// composeEffects :: ...Effect -> Effect
export const composeEffects = (...effects) => {
  const name = effects.map(({ name }) => `${name}`.replace('.', '_')).join('.');
  const operations = effects.reduce((acc, eff) => ({ ...acc, ...eff.operations }), {});
  return createEffect(name, operations);
};

// concat :: (Runner, Runner) -> Runner
export const concat = (a, b) => a.concat(b);

// composeHandlers :: ...Runner -> Runner
export const composeHandlers = (...runners) => runners.reduce(concat);

// run :: Runner
export const run = createRunner();

export { func };
