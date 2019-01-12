
import { Operation, isOperation, VALUE_HANDLER } from './utils';
import globalHandlers from './operations';

const createRunner = (handlers = {}) => {
  // TODO: Validate if all handlers are specified
  return (generator, ...args) => new Promise((resolve, reject) => {
    const g = generator(...args);

    const throwError = reject;
    const end = resolve;
    const resume = data => {
      const { value, done } = g.next(data);

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
};

export const createEffect = (name, operations) => {
  const effectful = {
    name,
    fn: x => x,
    handler: createRunner,
  };

  Object.keys(operations).forEach(name => {
    effectful[name] = Operation(name, operations[name]);
  });

  return effectful;
};

export const run = createRunner();
