
export type SymbolObject = Symbol | { name: string };

const symbolObjectPool: { [key: string]: SymbolObject } = {};

export const createSymbolObject = (name: string): SymbolObject => {
  symbolObjectPool[name] = symbolObjectPool[name] || { name };
  return symbolObjectPool[name];
};

export const createSymbol = (key: string): SymbolObject => typeof Symbol === 'function'
  // @ts-ignore
  ? Symbol.for(key)
  : createSymbolObject(key);

// @ts-ignore
export const isGenerator = (p: Function) => p && p.constructor && (p.constructor.name + '').indexOf('GeneratorFunction') !== -1;

type FunctionPropertyNames<T> = { [K in keyof T]: T[K] extends Function ? K : never };

// TODO: Fix type issues with this
export const pointfree = <Type, Method extends (keyof FunctionPropertyNames<Type>)>(methodName: Method) =>
  // @ts-ignore
  (...args: Parameters<Type[Method]>) =>
    // @ts-ignore
    (x: Type): ReturnType<Type[Method]> => x[methodName].apply(x, args);

export const compose = <T = any, R = any>(...args: ((x: any) => any)[]): ((x: T) => R) =>
  args.reduce((a: (x: T) => any, b: (y: any) => any) => (x: any) => a(b(x)));

export const compose2 = <T = any, X = any, R = any>(a: (t: X) => R, b: (a: T) => X): ((t: T) => R) =>
  compose(a, b);

export const isArray = Array.isArray || (a => ({}).toString.call(a)=='[object Array]');

export const flatten = (arr: any[]) => arr.reduce((list, item) => list.concat(isArray(item) ? item : [item]), []);

export const identity = <T = any>(x: T): T => x;

export const constant = <T = any>(x: T) => (): T => x;

export const ifElse = <T = any, R = any>(
  predicate: (x: T) => boolean,
  onTrue: (x: T) => R,
  onFalse: (x: T) => R,
) => (x: T) =>
  predicate(x) ? onTrue(x) : onFalse(x);

export const noop = constant(undefined);

export interface Maybe<T = any> {
  map: <R = any>(fn: (x: T) => R) => Maybe<R>;
  fold: <R = any>(n: () => R, j: (x: T) => R) => R;
};

export const maybe = {
  just: <T>(x: T): Maybe<T> => ({
    map: fn => maybe.just(fn(x)),
    fold: (_, m) => m(x),
  }),
  nothing: (): Maybe => ({
    map: _ => maybe.nothing(),
    fold: (j, _) => j(),
  }), 
};
