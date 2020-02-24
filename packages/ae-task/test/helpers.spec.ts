import Task, {AlgebraicTask} from '../src';
import { parallel, race, series, rejectAfter, resolveAfter, map, fork } from '../src/fns';

describe('helpers', () => {
  const delay = (duration: number, cancel = clearTimeout): AlgebraicTask<void, number> => Task((_, resolve) => {
    const timerid = setTimeout(() => resolve(1), duration);
    return () => cancel && cancel(timerid);
  });

  describe('rejectAfter', () => {
    it('should reject task after some time', done => {
      const startTime = Date.now();
      rejectAfter(500, 5).fork(e => {
        expect(Date.now() - startTime).toBeGreaterThanOrEqual(480);
        expect(e).toBe(5);
        done();
      }, () => done('shoundlt be here'));
    });
  });

  describe('resolveAfter', () => {
    it('should reject task after some time', done => {
      const startTime = Date.now();
      resolveAfter(500, 5).fork(done, n => {
        expect(Date.now() - startTime).toBeGreaterThanOrEqual(480);
        expect(n).toBe(5);
        done();
      });
    });
  });

  describe('race', () => {
    it('should race to the finish line and resolve with the first', done => {
      const t1 = delay(200).map(() => 1);
      const t2 = delay(100).map(() => 2);
      const t3 = delay(300).map(() => 3);
      race([ t1, t2, t3 ]).fork(done, (n) => {
        expect(n).toBe(2);
        done();
      });
    });

    it('should race to the finish line and reject with the first', done => {
      const t1 = delay(200).map(() => 1);
      const t2 = delay(100).rejectWith(2);
      const t3 = delay(300).rejectWith(3);
      race([ t1, t2, t3 ]).fork(n => {
        expect(n).toBe(2);
        done();
      }, () => done('Shoudnbe here'));
    });
  });

  describe('series', () => {
    it('should run all tasks in series', done => {
      const t1 = delay(50).map(() => 1);
      const t2 = delay(70).map(() => 2);
      const t3 = delay(90).map(() => 3);

      const startTime = Date.now();
      series([ t1, t2, t3 ]).fork(done, arr => {
        expect(Date.now() - startTime).toBeGreaterThanOrEqual(180);
        expect(arr).toEqual([ 1, 2, 3 ]);
        done();
      });
    });

    it('should reject with the first one (lowest index) that fails', done => {
      const t1 = delay(50).map(() => 1);
      const t2 = delay(80).rejectWith(2);
      const t3 = delay(100).rejectWith(3);
      series([ t1, t2, t3 ]).fork(n => {
        expect(n).toBe(2);
        done();
      }, () => done('Shoudnbe here'));
    });
  });

  describe('parallel', () => {
    it('should run all tasks in parallel', done => {
      const t1 = delay(100).map(() => 1);
      const t2 = delay(20).map(() => 2);
      const t3 = delay(120).map(() => 3);
      const t4 = delay(90).map(() => 4);

      const startTime = Date.now();
      parallel([ t1, t2, t3, t4 ]).fork(done, arr => {
        expect(Date.now() - startTime).toBeGreaterThanOrEqual(117);
        expect(Date.now() - startTime).toBeLessThan(200);
        expect(arr).toEqual([ 1, 2, 3, 4 ]);
        done();
      });
    });

    it('should reject with the first one (first in time) that fails', done => {
      const t1 = delay(100).map(() => 1);
      const t2 = delay(20).map(() => 2);
      const t3 = delay(120).map(() => 3);
      const t4 = delay(90).rejectWith(4);

      series([ t1, t2, t3, t4 ]).fork(n => {
        expect(n).toBe(4);
        done();
      }, () => done('Shoudnbe here'));
    });
  });

  describe('pointfree parallel', () => {
    it('should run all tasks in parallel', done => {
      const t1 = map(() => 1)(delay(100));
      const t2 = map(() => 2)(delay(20));
      const t3 = map(() => 3)(delay(120));
      const t4 = map(() => 4)(delay(90));

      const startTime = Date.now();
      fork(done, arr => {
        expect(Date.now() - startTime).toBeGreaterThanOrEqual(115);
        expect(Date.now() - startTime).toBeLessThan(200);
        expect(arr).toEqual([ 1, 2, 3, 4 ]);
        done();
      })(parallel([ t1, t2, t3, t4 ]));
    });

    it('should reject with the first one (first in time) that fails', done => {
      const t1 = map(() => 1)(delay(100));
      const t2 = map(() => 2)(delay(20));
      const t3 = map(() => 3)(delay(120));
      const t4 = delay(90).rejectWith(4);

      fork(n => {
        expect(n).toBe(4);
        done();
      }, () => done('Shoudnbe here'))(series([ t1, t2, t3, t4 ]));
    });
  });
});
