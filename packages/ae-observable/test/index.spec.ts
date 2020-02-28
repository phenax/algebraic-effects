import createObservable, { of, Subscription } from '../src';

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

  it('should go to stream error on throw error', done => {
    const onError = jest.fn();
    const onNext = jest.fn();

    const obs = createObservable<number>((subscription: Subscription) => {
      subscription.next(1);
      subscription.throwError(5);
      subscription.next(2);
      subscription.throwError(6);
      subscription.complete();
    });

    obs
      .map(x => x + 10)
      .subscribe({
        onError,
        onNext,
        onComplete: () => {
          expect(onNext).toBeCalledTimes(2);
          expect(onNext).toHaveBeenCalledWith(11);
          expect(onNext).toHaveBeenCalledWith(12);

          expect(onError).toBeCalledTimes(2);
          expect(onError).toHaveBeenCalledWith(5);
          expect(onError).toHaveBeenCalledWith(6);
          done();
        },
      });
  });

  it('should stream item and complete on resolve', done => {
    const onNext = jest.fn();
    const obs = createObservable<number>((subscription: Subscription) => {
      subscription.next(1);
      subscription.resolve(3);
      subscription.next(5);
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

  describe('Observable.of', () => {
    it('should create a stream of the set of arguments passed to of', done => {
      const onNext = jest.fn();
      const obs = of(1, 3, 5);

      obs.subscribe({
        onError: done,
        onNext,
        onComplete: () => {
          expect(onNext).toBeCalledTimes(3);
          expect(onNext.mock.calls).toEqual([[1], [3], [5]]);
          done();
        },
      });
    });
  });
});

