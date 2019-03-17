import { pointfree, compose, identity, createSymbolObject } from '../src';

describe('pointfree', () => {

  it('should return a point-free version of a given method name', () => {
    const pointfreeC = pointfree('c');

    const obj = { b: 'hello', c() { return this.b + ' world!'; }, };
    expect(pointfreeC()(obj)).toBe('hello world!');
  });

  it('should throw error is object doesnt have method', () => {
    const pointfreeC = pointfree('c');
    const obj = { b: 'hello' };
    expect(() => pointfreeC()(obj)).toThrowError();
  });
});

describe('compose', () => {
  it('should compose multiple fns', () => {
    const fn1 = a => a + 1;
    const fn2 = b => b * 2;
    const fn3 = c => `n=${c}`;

    expect(compose(fn3, fn2, fn1)(5)).toBe('n=12');
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

