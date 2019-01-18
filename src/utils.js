
export const OPERATION = Symbol.for('algebraic-effects/operation');

// VALUE_HANDLER :: Operation
export const VALUE_HANDLER = ({ end }) => x => end(x);

// isOperation :: Operation? -> Boolean
export const isOperation = x => x && x.$$type === OPERATION;

// validateArguments :: ([String], [*]) -> Boolean
const validateArguments = (args, values) => {
  if(!args) return true;

  const dynamicArgs = args.filter(a => /^(\.{3}|\?)/.test(a));

  if(dynamicArgs.length)
    return args.length - dynamicArgs.length <= values.length;

  return args.length === values.length;
};

// type Operation = ...a -> { name :: String, payload :: a }

export const Operation = (name, [ args ] = []) => (...payload) => {
  if (!validateArguments(args, payload))
    throw new Error(`The operation ${name} expected ${args.length} arguments, but got ${payload.length} arguments`);

  return { name, payload, $$type: OPERATION };
};

export const func = (args, ret) => [args, ret];
