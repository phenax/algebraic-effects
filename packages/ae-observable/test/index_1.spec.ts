
import createObservable, { Subscription } from '../src';
// import { resolveAfter } from '../src/fns';

// @ts-ignore
const Promise = window.Promise;

describe('Observable', () => {
  it('should subscribe to observable correctly', done => {
    const obs = createObservable<number>((subscription: Subscription) => {
      subscription.complete({ value: 'Hello' });
    });

    obs.subscribe({
      onError: done,
      onNext: () => done('Not called here'),
      onComplete: (sub: Subscription, { value }) => {
        expect(sub.isCancelled).toBe(false);
        expect(value).toBe('Hello');
        done();
      },
    });
  });

  it('should subscribe to streamed data correctly', done => {
    const onNext = jest.fn();
    const obs = createObservable<number>((subscription: Subscription) => {
      subscription.next(1);
      subscription.next(3);
      subscription.complete();
    });

    obs.subscribe({
      onError: done,
      onNext,
      onComplete: () => {
        expect(onNext).toBeCalledTimes(2);
        expect(onNext.mock.calls).toEqual([[1], [3]]);
        done();
      },
    });
  });

  describe('Observable#map', () => {
    
    it('should map over the items in the stream (increment)', done => {
      const onNext = jest.fn();
      const obs = createObservable<number>((subscription: Subscription) => {
        subscription.next(1);
        subscription.next(3);
        subscription.next(10);
        subscription.complete();
      });

      obs
        .map(x => x + 10)
        .subscribe({
          onError: done,
          onNext,
          onComplete: () => {
            expect(onNext).toBeCalledTimes(3);
            expect(onNext.mock.calls).toEqual([[11], [13], [20]]);
            done();
          },
        });
    });
  });

  describe('Observable#fold', () => {
    
    it('should fold the items in the stream (increment both error and value)', done => {
      const onNext = jest.fn();
      const obs = createObservable<number>((subscription: Subscription) => {
        subscription.next(1);
        subscription.next(3);
        subscription.throwError(10);
        subscription.throwError(5);
        subscription.complete();
      });

      obs
        .fold(e => e + 10, x => x + 3)
        .subscribe({
          onError: done,
          onNext,
          onComplete: () => {
            expect(onNext).toBeCalledTimes(4);
            expect(onNext.mock.calls).toEqual([[4], [6], [20], [15]]);
            done();
          },
        });
    });
  });
});

