
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

export const pointfree = <Type, Method extends (keyof Type)>(methodName: Method): Type[Method] => function() {
  const args = arguments;
  // @ts-ignore
  return (x: Type) => x[methodName].apply(x, args);
} as unknown as Type[Method];

export const compose = <T = any, R = any>(...args: ((x: any) => any)[]): ((x: T) => R) =>
  args.reduce((a: (x: T) => any, b: (y: any) => any) => (x: any) => a(b(x)));

export const compose2 = <T = any, X = any, R = any>(a: (t: X) => R, b: (a: T) => X): ((t: T) => R) =>
  compose(a, b);

export const isArray = Array.isArray || (a => ({}).toString.call(a)=='[object Array]');

export const flatten = (arr: any[]) => arr.reduce((list, item) => list.concat(isArray(item) ? item : [item]), []);

export const identity = <T = any>(x: T): T => x;

export const constant = <T = any>(x: T) => (): T => x;

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
