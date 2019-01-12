const OPERATION = Symbol.for('algebraic-effects/operation');
const isOperation = x => x && x.$$type === OPERATION;

const VALUE_HANDLER = (_, end) => x => end(x);

const Operation = name => (...payload) => ({ name, payload, $$type: OPERATION });

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
        const resume = (...args) => {
          const { value, done } = g.next(...args);
          console.log('>> x', value, done);
          if (done) return end(value);
          return value;
        };
  
        const value = resume();
  
        if (isOperation(value)) {
          const effectHandler = handlers[value.name] || globalHandlers[value.name];
          console.log(value.name, effectHandler);
          effectHandler(resume, end, throwError)(...value.payload);
        } else {
          const effectHandler = handlers._ || VALUE_HANDLER;
          effectHandler(resume, end, throwError)(value);
        }
      });
    },
  };

  Object.keys(operations).forEach(name => {
    effectful[name] = Operation(name, operations[name]);
  });

  return effectful;
};
