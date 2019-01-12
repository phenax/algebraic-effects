
import { Operation, isOperation, VALUE_HANDLER } from './utils';
import globalHandlers from './operations';

// type Runner = (GeneratorFunction, ...a) -> Promise

// createRunner :: (Object Function) -> Runner
const createRunner = (handlers = {}) => {
  // TODO: Validate if all handlers are specified
  const run = (generator, ...args) => new Promise((resolve, reject) => {
    const g = generator(...args);

    const throwError = reject;
    const end = resolve;
    const resume = (...data) => {
      const { value, done } = g.next(...data);

      if (done) return end(value);

      if (isOperation(value)) {
        const effectHandler = handlers[value.name] || globalHandlers[value.name];
        effectHandler(resume, end, throwError)(...value.payload);
      } else {
        const effectHandler = handlers._ || VALUE_HANDLER;
        effectHandler(resume, end, throwError)(value);
      }
    };

    return resume();
  });

  run.handlers = handlers;
  return run;
};

// createEffect :: (String, Object *) -> Effect
export const createEffect = (name, operations) => {
  const effectful = {
    name,
    operations,
    fn: x => x,
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
export const composeHandlers = (...runners) => {
  const handlers = runners.map(r => r.handlers).reduce((acc, o) => ({ ...acc, ...o }), {});
  return createRunner(handlers);
};

// run :: Runner
export const run = createRunner();
