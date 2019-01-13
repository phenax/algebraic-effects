
import { Operation, isOperation, VALUE_HANDLER } from './utils';
import globalHandlers from './operations';

// type Runner = (GeneratorFunction, ...a) -> Promise

// createRunner :: (Object Function) -> Runner
const createRunner = (handlers = {}) => {
  // TODO: Validate if all handlers are specified
  const runner = (generator, ...args) => new Promise((resolve, reject) => {
    const g = generator(...args);

    const throwError = x => {
      g.return(x);
      reject(x);
    };
    const end = x => {
      g.return(x);
      resolve(x);
    };
    const resume = (...data) => {
      const { value, done } = g.next(...data);

      const call = (...a) => runner(...a).then(resume).catch(throwError);
      const flowOperators = { resume, end, throwError, call };

      const valueHandler = (() => {
        const runValueOp = handlers._ || VALUE_HANDLER;
        return runValueOp(flowOperators);
      })();

      if (done) return valueHandler(value);

      if (isOperation(value)) {
        const runOp = handlers[value.name] || globalHandlers[value.name];
        if (!runOp) throw new Error(`Invalid operation executed. The operation "${value.name}", was not defined in the effect`);
        runOp(flowOperators)(...value.payload);
      } else {
        valueHandler(value);
      }
    };

    return resume();
  });

  runner.concat = run1 => createRunner({ ...handlers, ...run1.handlers });
  runner.handlers = handlers;
  runner.run = runner;
  return runner;
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
  const name = `Effect(${effects.map(({ name }) => name).join(', ')})`;
  const operations = effects.reduce((acc, eff) => ({ ...acc, ...eff.operations }), {});
  return createEffect(name, operations);
};

// composeHandlers :: ...Runner -> Runner
export const composeHandlers = (...runners) => runners.reduce((acc, r) => acc.concat(r));

// run :: Runner
export const run = createRunner();
