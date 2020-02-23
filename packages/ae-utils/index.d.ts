declare type SymbolObject = Symbol | {
    name: string;
};
export declare const createSymbolObject: (name: string) => SymbolObject;
export declare const createSymbol: (key: string) => SymbolObject;
export declare const isGenerator: (p: Function) => boolean;
export declare const pointfree: <Type, Method extends keyof Type>(methodName: Method) => Type[Method];
declare type ComposeFn = (...args: any[]) => any;
export declare const compose: ComposeFn;
export declare const compose2: <T = any, R = any>(a: (t: T) => any, b: (a: any) => R) => (t: T) => R;
export declare const isArray: (a: any) => boolean;
export declare const flatten: (arr: any[]) => any;
export declare const identity: <T = any>(x: T) => T;
export declare const constant: <T = any>(x: T) => () => T;
interface Maybe<T = any> {
    map: <R = any>(fn: (x: T) => R) => Maybe<R>;
    fold: <R = any>(n: () => R, j: (x: T) => R) => R;
}
export declare const maybe: {
    just: <T>(x: T) => Maybe<T>;
    nothing: () => Maybe<any>;
};
export {};
