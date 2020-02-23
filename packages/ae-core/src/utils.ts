import { createSymbol } from '@algebraic-effects/utils';
import { OperationOptions, OperationSignature, Operation } from './types';

export const OPERATION = createSymbol('algebraic-effects/operation');
export const HANDLER = createSymbol('algebraic-effects/handler');

// VALUE_HANDLER :: Operation
export const VALUE_HANDLER = <T = any>(o: any) => (x: T) => o.end(x);

// isOperation :: Operation? -> Boolean
export const isOperation = (x: any) => x && x.$$type === OPERATION;

// validateArguments :: ([String], [*]) -> Boolean
const validateArguments = (args: Array<string> | undefined, values: Array<any>) => {
  if(!args) return true;

  const dynamicArgs = args.filter(a => /^(\.{3}|\?)/.test(a));

  if(dynamicArgs.length)
    return args.length - dynamicArgs.length <= values.length;

  return args.length === values.length;
};

export const createOperation = <Args extends Array<any> = Array<any>, Ret = any>(
  name: string,
  [ args, returnType, { isMulti = false } = {} ]: OperationSignature,
): Operation<Args, Ret> => {
  function op() {
    const payload = [].slice.call(arguments);
    if (!validateArguments(args, payload))
      throw new Error(`ArgumentError. The operation ${name} expected ${args ? args.length : 'any number'} arguments, but got ${payload.length} arguments`);
    return { name, payload, isMulti, $$type: OPERATION, toString };
  }

  op.toString = () => `func ${name}(${args ? args.join(', ') : '...*'}) -> ${returnType}`;
  return op;
};

export const func = (args?: string[], ret?: string, options?: OperationOptions): OperationSignature =>
  [args, ret, options];
