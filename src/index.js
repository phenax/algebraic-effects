
import { Operation, isOperation, VALUE_HANDLER } from './utils';
import globalHandlers from './operations';

// type Runner = (GeneratorFunction, ...a) -> Promise

// createRunner :: (Object Function) -> Runner
const createRunner = (handlers = {}) => {
  // TODO: Validate if all handlers are specified

  const valueHandler = handlers._ || VALUE_HANDLER;

  const effectRunner = (generator, ...args) => new Promise((resolve, reject) => {
    const g = generator(...args);

    // throwError :: * -> ()
    const throwError = x => {
      g.return(x);
      reject(x);
    };

    // end  :: * -> ()
    const end = x => {
      g.return(x);
      resolve(x);
    };

    // resume :: * -> ()
    const resume = x => {
      const { value, done } = g.next(x);

      const call = (...a) => effectRunner(...a).then(resume).catch(throwError);
      const flowOperators = { resume, end, throwError, call };

      if (done) return valueHandler(flowOperators)(value);

      if (isOperation(value)) {
        const runOp = handlers[value.name] || globalHandlers[value.name];

        if (!runOp) {
          throwError(new Error(`Invalid operation executed. The operation "${value.name}", was not defined in the effect`));
          return;
        }

        runOp(flowOperators)(...value.payload);
      } else {
        valueHandler(flowOperators)(value);
      }
    };

    return resume();
  });

  effectRunner.concat = run1 => createRunner({ ...handlers, ...run1.handlers });
  effectRunner.handlers = handlers;
  effectRunner.run = effectRunner;
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

// composeHandlers :: ...Runner -> Runner
export const composeHandlers = (...runners) => runners.reduce((acc, r) => acc.concat(r));

// run :: Runner
export const run = createRunner();
