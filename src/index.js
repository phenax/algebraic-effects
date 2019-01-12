const EFFECT = Symbol.for('algebraic-effects/effect');
const isEffect = x => x && x.$$type === EFFECT;

const VALUE_HANDLER = (resume, _) => x => resume(x);

export const Effect = (effects) => {
  const effectful = {};
  effectful.handler = generator => ({
    handle: (handlers) => {
      // TODO: Validate if all handlers are specified

      return (...args) => new Promise((end, _) => {
        const g = generator(...args);

        const resume = (...args) => {
          const { value, done } = g.next(...args);
          if (done) return end(value);
          return value;
        };

        const value = resume();

        if (isEffect(value)) {
          const effectHandler = handlers[value.name];
          effectHandler(resume, end)(...value.payload);
        } else {
          const effectHandler = handlers._ || VALUE_HANDLER;
          effectHandler(resume, end)(value);
        }
      });
    },
  });

  Object.keys(effects).forEach(name => {
    effectful[name] = (...args) => ({ name, payload: args, $$type: EFFECT });
  });

  return effectful;
};

Effect.fn = () => {};

export const runEffect = () => (fn, ...args) => fn(...args);
