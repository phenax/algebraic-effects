
import Scheduler, { scheduler } from '../src/Scheduler';

describe('Scheduler', () => {
  describe('waitForNextFrame', () => {
    const program = function *() {
      yield Scheduler.waitForNextFrame();
      return 1;
    };

    it('should skip a frame', done => {
      const now = performance.now();
      scheduler
        .run(program)
        .map(result => {
          expect(result).toBe(1);
          expect(performance.now() - now).toBeGreaterThan(16);
        })
        .fork(done, () => done());
    });
  });

  describe('waitForIdle', () => {
    const logFn = jest.fn();
    const originalRic = window.requestIdleCallback;
    const program = function *() {
      yield Scheduler.waitForIdle();
      return 1;
    };

    beforeEach(() => {
      window.requestIdleCallback = fn => fn(logFn());
    });

    afterEach(() => {
      window.requestIdleCallback = originalRic;
    });

    it('should wait for the next idle time', done => {
      scheduler
        .run(program)
        .map(result => {
          expect(result).toBe(1);
          expect(logFn).toHaveBeenCalledTimes(1);
        })
        .fork(done, () => done());
    });
  });

  describe('waitForNextFrame', () => {
    const program = function *() {
      yield Scheduler.waitFor(51);
      return 1;
    };

    it('should wait for timeout', done => {
      const now = performance.now();
      scheduler
        .run(program)
        .map(result => {
          expect(result).toBe(1);
          expect(performance.now() - now).toBeGreaterThan(50);
        })
        .fork(done, () => done());
    });
  });
});
