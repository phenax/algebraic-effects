import { createSymbol } from '@algebraic-effects/utils';

export const OPERATION = createSymbol('algebraic-effects/operation');
export const HANDLER = createSymbol('algebraic-effects/handler');

// VALUE_HANDLER :: Operation
export const VALUE_HANDLER = o => x => o.end(x);

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

export const Operation = (name, [ args, returnType, { isMulti = false } = {} ]) => {
  function op() {
    const payload = [].slice.call(arguments);
    if (!validateArguments(args, payload))
      throw new Error(`ArgumentError. The operation ${name} expected ${args.length} arguments, but got ${payload.length} arguments`);
    return { name, payload, isMulti, $$type: OPERATION, toString };
  }

  op.toString = () => `func ${name}(${args.join(', ')}) -> ${returnType}`;
  return op;
};

export const func = (args, ret, options) => [args, ret, options];
