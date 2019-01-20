
import Task from '../src';

describe('Task', () => {

  describe('Timeout example (integrated test)', () => {
    const delay = (duration, cancel) => Task((reject, resolve) => {
      const timerid = setTimeout(() => resolve(), duration);
      return () => cancel && cancel(timerid);
    });

    it('should delay (combination test of map, chain and fork)', done => {
      const start = Date.now();
      delay(100)
        .map(() => 100)
        .map(n => n + 50)
        .chain(delay)
        .map(() => 10)
        .fork(done, x => {
          expect(x).toBe(10);
          expect(Date.now() - start).toBeGreaterThanOrEqual(200);
          done();
        });
    });

    it('should reject', done => {
      const err = new Error('Eoww');
      Task.reject(err)
        .fork(
          e => {
            expect(e).toBe(err);
            done();
          },
          () => done('shouldnt have reached here'),
        );
    });

    it('should cancel', done => {
      const cancel = delay(50).fork(done, () => done('shouldnt have reached here'));
      cancel();
      setTimeout(() => done(), 150);
    });

    it('should cancel with clearTimeout', done => {
      const cancel = delay(50, clearTimeout).fork(done, () => done('shouldnt have reached here'));
      cancel();
      setTimeout(() => done(), 150);
    });
  });
});

