const OPERATION = Symbol.for('algebraic-effects/operation');
const isOperation = x => x && x.$$type === OPERATION;

const VALUE_HANDLER = (_, end) => x => end(x);

// type Operation = ...a -> { name :: String, payload :: a }
const Operation = name => (...payload) => ({ name, payload, $$type: OPERATION });

export const sleep = Operation('sleep');
const globalHandlers = {
  sleep: resume => duration => {
    setTimeout(resume, duration);
  },
};

export const createEffect = (name, operations) => {
  const effectful = {
    name,
    fn: x => x,
    handler: handlers => {
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
    },
  };

  Object.keys(operations).forEach(name => {
    effectful[name] = Operation(name, operations[name]);
  });

  return effectful;
};
