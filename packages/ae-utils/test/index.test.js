import { pointfreeMethod, compose, identity } from '../src';

describe('pointfreeMethod', () => {

  it('should return a point-free version of a given method name', () => {
    const pointfreeC = pointfreeMethod('c');

    const obj = { b: 'hello', c() { return this.b + ' world!'; }, };
    expect(pointfreeC()(obj)).toBe('hello world!');
  });

  it('should throw error is object doesnt have method', () => {
    const pointfreeC = pointfreeMethod('c');
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
