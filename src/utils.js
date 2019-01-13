
export const OPERATION = Symbol.for('algebraic-effects/operation');

// VALUE_HANDLER :: Operation
export const VALUE_HANDLER = ({ end }) => x => end(x);

// isOperation :: Operation? -> Boolean
export const isOperation = x => x && x.$$type === OPERATION;

// type Operation = ...a -> { name :: String, payload :: a }
export const Operation = name => (...payload) => ({ name, payload, $$type: OPERATION });
