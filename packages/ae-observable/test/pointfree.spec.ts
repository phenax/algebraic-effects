import createObservable, { of, range, Subscription } from '../src';
import { map, filter, chain, propagateTo, subscribe, compose } from '../src/pointfree';

describe('Observable pointfree functions', () => {
  describe('map', () => {
    it('should map over the items in the stream (increment)', done => {
      const onNext = jest.fn();

      const stream$ = of(1, 3, 10);

      compose(
        subscribe({
          onError: done,
          onNext,
          onComplete: () => {
            expect(onNext).toBeCalledTimes(3);
            expect(onNext.mock.calls).toEqual([[11], [13], [20]]);
            done();
          },
        }),
        map(x => x + 10),
      )(stream$);
    });
  });

  describe('filter', () => {
    it('should filter all even numbers in the stream', done => {
      const onNext = jest.fn();

      const stream$ = range(0, 10);

      compose(
        subscribe({
          onError: done,
          onNext,
          onComplete: () => {
            expect(onNext).toBeCalledTimes(5);
            expect(onNext.mock.calls).toEqual([[0], [2], [4], [6], [8]]);
            done();
          },
        }),
        filter((x: number) => x % 2 === 0),
      )(stream$);
    });
  });

  describe('fold', () => {
    it('should fold the items in the stream (increment both error and value)', done => {
      const onNext = jest.fn();
      const stream$ = createObservable<number, number>((subscription: Subscription) => {
        subscription.next(1);
        subscription.next(3);
        subscription.throwError(10);
        subscription.throwError(5);
        subscription.complete();
      });

      compose(
        subscribe({
          onError: done,
          onNext,
          onComplete: () => {
            expect(onNext).toBeCalledTimes(4);
            expect(onNext.mock.calls).toEqual([[4], [6], [20], [15]]);
            done();
          },
        }),
        propagateTo(e => e + 10, x => x + 3),
      )(stream$);
    });
  });

  describe('chain', () => {
    it('should chain the two in the stream (increment)', done => {
      const onNext = jest.fn();

      const add10Stream = (x: number) => createObservable(sub => {
        sub.next(x + 10);
        sub.complete();
      });
      
      const stream$ = of(1, 3, 10);
      
      compose(
        subscribe({
          onError: done,
          onNext,
          onComplete: () => {
            expect(onNext).toBeCalledTimes(3);
            expect(onNext.mock.calls).toEqual([[11], [13], [20]]);
            done();
          },
        }),
        chain(add10Stream),
      )(stream$);
    });
  });
});

