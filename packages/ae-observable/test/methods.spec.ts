import createObservable, { of, Subscription } from '../src';

describe('Observable methods', () => {
  describe('Observable#map', () => {
    it('should map over the items in the stream (increment)', done => {
      const onNext = jest.fn();

      of(1, 3, 10)
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

    it('should not map over the error in the stream (increment)', done => {
      const onError = jest.fn();
      const onNext = jest.fn();

      const error = new Error('Fuck');
      const obs = createObservable<number>((subscription: Subscription) => {
        subscription.throwError(error);
        subscription.complete();
      });

      obs
        .map(x => x + 10)
        .subscribe({
          onError,
          onNext,
          onComplete: () => {
            expect(onNext).toBeCalledTimes(0);
            expect(onError).toBeCalledTimes(1);
            expect(onError).toHaveBeenCalledWith(error);
            done();
          },
        });
    });
  });

  describe('Observable#fold', () => {
    it('should fold the items in the stream (increment both error and value)', done => {
      const onNext = jest.fn();
      const obs = createObservable<number, number>((subscription: Subscription) => {
        subscription.next(1);
        subscription.next(3);
        subscription.throwError(10);
        subscription.throwError(5);
        subscription.complete();
      });

      obs
        .propagateTo(e => e + 10, x => x + 3)
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

    it('should fold the items in the stream (group both error and value)', done => {
      const onNext = jest.fn();
      const obs = createObservable<Error, string>((subscription: Subscription) => {
        subscription.next('Hello');
        subscription.throwError(new Error('Break'));
        subscription.next('world');
        subscription.complete();
      });

      obs
        .propagateTo(
          e => ({ error: e.message }),
          x => ({ str: x }),
        )
        .subscribe({
          onError: done,
          onNext,
          onComplete: () => {
            expect(onNext).toBeCalledTimes(3);
            expect(onNext.mock.calls).toEqual([
              [{ str: 'Hello' }],
              [{ error: 'Break' }],
              [{ str: 'world' }],
            ]);
            done();
          },
        });
    });
  });

  describe('Observable#chain', () => {
    
    it('should chain the two in the stream (increment)', done => {
      const onNext = jest.fn();

      const add10Stream = (x: number) => createObservable(sub => {
        sub.next(x + 10);
        sub.complete();
      });

      of(1, 3, 10)
        .chain(add10Stream)
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

    it('should not chain the error in the stream (increment)', done => {
      const onError = jest.fn();
      const onNext = jest.fn();

      const error = new Error('Fuck');
      const obs = createObservable<number>((subscription: Subscription) => {
        subscription.throwError(error);
        subscription.complete();
      });

      const throwErrorStream = () => createObservable(sub => {
        sub.throwError('Err');
        sub.complete();
      });

      obs
        .chain(throwErrorStream)
        .subscribe({
          onError,
          onNext,
          onComplete: () => {
            expect(onNext).toBeCalledTimes(0);
            expect(onError).toBeCalledTimes(1);
            expect(onError).toHaveBeenCalledWith(error);
            done();
          },
        });
    });
  });
});

