import { pointfree, compose, compose2, identity, createSymbolObject } from '../src';

describe('pointfree', () => {
  interface ObjType {
    c(): any;
    b: string;
  }

  const pointfreeC = pointfree<ObjType, 'c'>('c');

  it('should return a point-free version of a given method name', () => {
    const obj: ObjType = { b: 'hello', c() { return this.b + ' world!'; }, };

    expect(pointfreeC()(obj)).toBe('hello world!');
  });

  it('should throw error is object doesnt have method', () => {
    const obj = { b: 'hello' };
    // Typescript wont allow you to do it. JS will give you a warning
    // @ts-ignore
    expect(() => pointfreeC()(obj)).toThrowError();
  });
});

describe('compose', () => {
  it('should compose multiple fns', () => {
    const fn1 = (a: number) => a + 1;
    const fn2 = (b: number) => b * 2;
    const fn3 = (c: number) => `n=${c}`;

    expect(compose(fn3, fn2, fn1)(5)).toBe('n=12');
  });
});

describe('compose2', () => {
  it('should compose 2 fns', () => {
    const fn1 = (a: number) => [a + 2, 5];
    const fn2 = ([b, c]: number[]) => `n=${c + b}`;

    expect(compose2(fn2, fn1)(5)).toBe('n=12');
  });
});

describe('identity', () => {
  it('should return passed value', () => {
    expect(identity(5)).toBe(5);
  });
});

describe('createSymbolObject', () => {
  const s1 = createSymbolObject('hello-world');
  const s2 = createSymbolObject('hello-world');
  const s3 = createSymbolObject('hello-world-1');

  it('should return from pool if symbol already exists', () => {
    expect(s1 === s2).toBe(true);
  });

  it('should create new symbol otherwise', () => {
    expect(s1 === s3).toBe(false);
  });
});

