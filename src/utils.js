
export const OPERATION = Symbol.for('algebraic-effects/operation');

export const VALUE_HANDLER = (_, end) => x => end(x);

// isOperation :: Operation? -> Boolean
export const isOperation = x => x && x.$$type === OPERATION;

// type Operation = ...a -> { name :: String, payload :: a }
export const Operation = name => (...payload) => ({ name, payload, $$type: OPERATION });


// compose :: (...Function) -> Function
// export const compose = (...fns) =>
//   fns.reduce((a, b) => (...args) => a(b(...args)));
