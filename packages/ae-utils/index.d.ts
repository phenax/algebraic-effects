export declare type SymbolObject = Symbol | {
    name: string;
};
export declare const createSymbolObject: (name: string) => SymbolObject;
export declare const createSymbol: (key: string) => SymbolObject;
export declare const isGenerator: (p: Function) => boolean;
export declare const pointfree: <Type, Method extends keyof Type>(methodName: Method) => (...args: Parameters<Type[Method]>) => (x: Type) => ReturnType<Type[Method]>;
export declare const compose: <T = any, R = any>(...args: ((x: any) => any)[]) => (x: T) => R;
export declare const compose2: <T = any, X = any, R = any>(a: (t: X) => R, b: (a: T) => X) => (t: T) => R;
export declare const isArray: (a: any) => boolean;
export declare const flatten: (arr: any[]) => any;
export declare const identity: <T = any>(x: T) => T;
export declare const constant: <T = any>(x: T) => () => T;
export interface Maybe<T = any> {
    map: <R = any>(fn: (x: T) => R) => Maybe<R>;
    fold: <R = any>(n: () => R, j: (x: T) => R) => R;
}
export declare const maybe: {
    just: <T>(x: T) => Maybe<T>;
    nothing: () => Maybe<any>;
};
