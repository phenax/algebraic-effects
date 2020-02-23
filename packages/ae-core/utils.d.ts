import { OperationOptions, OperationSignature, Operation } from './types';
export declare const OPERATION: import("@algebraic-effects/utils").SymbolObject;
export declare const HANDLER: import("@algebraic-effects/utils").SymbolObject;
export declare const VALUE_HANDLER: <T = any>(o: any) => (x: T) => any;
export declare const isOperation: (x: any) => boolean;
export declare const createOperation: <Args extends any[] = any[], Ret = any>(name: string, [args, returnType, { isMulti }]: OperationSignature) => Operation<Args, Ret>;
export declare const func: (args?: string[], ret?: string, options?: OperationOptions) => OperationSignature;
