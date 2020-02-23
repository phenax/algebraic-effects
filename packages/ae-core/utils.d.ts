import { OperationOptions, OperationSignature } from './types';
export declare const OPERATION: import("@algebraic-effects/utils").SymbolObject;
export declare const HANDLER: import("@algebraic-effects/utils").SymbolObject;
export declare const VALUE_HANDLER: <T = any>(o: any) => (x: T) => any;
export declare const isOperation: (x: any) => boolean;
export declare const Operation: (name: string, [args, returnType, { isMulti }]: OperationSignature) => {
    (): {
        name: string;
        payload: any;
        isMulti: boolean;
        $$type: import("@algebraic-effects/utils").SymbolObject;
        toString: typeof toString;
    };
    toString(): string;
};
export declare const func: (args?: string[], ret?: string, options?: OperationOptions) => OperationSignature;
