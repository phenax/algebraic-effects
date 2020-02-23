import { OperationSignature, OperationBehavior } from './types';
declare const genericOpHandlers: Record<string, OperationBehavior>;
export declare const sleep: {
    (): {
        name: string;
        payload: any;
        isMulti: boolean;
        $$type: import("@algebraic-effects/utils").SymbolObject;
        toString: typeof toString;
    };
    toString(): string;
};
export declare const resolve: {
    (): {
        name: string;
        payload: any;
        isMulti: boolean;
        $$type: import("@algebraic-effects/utils").SymbolObject;
        toString: typeof toString;
    };
    toString(): string;
};
export declare const cancel: {
    (): {
        name: string;
        payload: any;
        isMulti: boolean;
        $$type: import("@algebraic-effects/utils").SymbolObject;
        toString: typeof toString;
    };
    toString(): string;
};
export declare const awaitPromise: {
    (): {
        name: string;
        payload: any;
        isMulti: boolean;
        $$type: import("@algebraic-effects/utils").SymbolObject;
        toString: typeof toString;
    };
    toString(): string;
};
export declare const runTask: {
    (): {
        name: string;
        payload: any;
        isMulti: boolean;
        $$type: import("@algebraic-effects/utils").SymbolObject;
        toString: typeof toString;
    };
    toString(): string;
};
export declare const call: {
    (): {
        name: string;
        payload: any;
        isMulti: boolean;
        $$type: import("@algebraic-effects/utils").SymbolObject;
        toString: typeof toString;
    };
    toString(): string;
};
export declare const callMulti: {
    (): {
        name: string;
        payload: any;
        isMulti: boolean;
        $$type: import("@algebraic-effects/utils").SymbolObject;
        toString: typeof toString;
    };
    toString(): string;
};
export declare const race: {
    (): {
        name: string;
        payload: any;
        isMulti: boolean;
        $$type: import("@algebraic-effects/utils").SymbolObject;
        toString: typeof toString;
    };
    toString(): string;
};
export declare const parallel: {
    (): {
        name: string;
        payload: any;
        isMulti: boolean;
        $$type: import("@algebraic-effects/utils").SymbolObject;
        toString: typeof toString;
    };
    toString(): string;
};
export declare const background: {
    (): {
        name: string;
        payload: any;
        isMulti: boolean;
        $$type: import("@algebraic-effects/utils").SymbolObject;
        toString: typeof toString;
    };
    toString(): string;
};
export declare const createGenericEffect: (name: string, signature: OperationSignature, handler: OperationBehavior<any[]>) => {
    (): {
        name: string;
        payload: any;
        isMulti: boolean;
        $$type: import("@algebraic-effects/utils").SymbolObject;
        toString: typeof toString;
    };
    toString(): string;
};
export default genericOpHandlers;
