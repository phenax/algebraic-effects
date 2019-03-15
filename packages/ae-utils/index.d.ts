
export type SymbolObject = { name : string };

declare function createSymbolObject(name: string): SymbolObject;

declare function createSymbol(key: string): Symbol | SymbolObject;

declare function isGenerator(p: any): boolean;

type PointfreeFunction = (...args: any) => (x: any) => any;

declare function pointfree(methodName: string): PointfreeFunction;

declare function compose(...args: Array<Function>): Function;

declare function identity<T>(a: T): T

declare function constant<T>(a: T): () => T
