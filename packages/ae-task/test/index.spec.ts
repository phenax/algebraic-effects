
import Task, { AlgebraicTask } from '../src';
import { resolveAfter } from '../src/fns';

// @ts-ignore
const Promise = window.Promise;

const delay = (duration: number, cancel = clearTimeout) => Task((_, resolve) => {
  const timerid = setTimeout(() => resolve(1), duration);
  return () => cancel && cancel(timerid);
});

describe('Task', () => {
  describe('Task.fromPromise', () => {
    it('should convert a rejected promise factory into a task (with args)', done => {
      Task.fromPromise((n: number) => Promise.resolve(5 + n), 5)
        .fork(done, (n) => {
          expect(n).toBe(10);
          done();
        });
    });

    it('should convert a resolved promise factory into a task', done => {
      Task.fromPromise(() => Promise.reject(5))
        .fork((n) => {
          expect(n).toBe(5);
          done();
        }, done);
    });
  });

  describe('#resolveWith, #rejectWith', () => {
    it('should ignore previous operations and just resolve with a value', done => {
      const t = Task.of(5).map(x => x * 2).resolveWith(9);
      t.fork(done, n => {
        expect(n).toBe(9);
        done();
      });
    });

    it('should ignore previous operations and reject with value', done => {
      const randomTask = Task.Rejected(5);
      const t = randomTask.map(_ => 10).mapRejected(x => x * 5).rejectWith(4);
      t.fork(n => {
        expect(n).toBe(4);
        done();
      }, () => done('Shouldnt be here'));
    });
  });

  describe('#fork', () => {
    it('should call the second callback (for resolved)', done => {
      const t = Task.of(5);
      t.fork(done, n => {
        expect(n).toBe(5);
        done();
      });
    });

    it('should call the first callback (for rejected)', done => {
      const t = Task.Rejected(5);
      t.fork(n => {
        expect(n).toBe(5);
        done();
      }, () => done('Shouldnt be here'));
    });
  });

  describe('#fold', () => {
    const foldToObj = (t: AlgebraicTask<Error, any>) =>
      t.fold((error: Error) => ({ error, value: undefined }), (value: number) => ({ error: undefined, value }));

    it('should group both rejected and resolved response to one', done => {
      foldToObj(Task.of(5)).fork(done, ({ error, value }) => {
        expect(error).toBeUndefined();
        expect(value).toBe(5);
        done();
      });
    });

    it('should call the first callback (for rejected)', done => {
      const e = new Error('Www');
      foldToObj(Task.Rejected(e)).fork(done, ({ error, value }) => {
        expect(error).toBe(e);
        expect(value).toBeUndefined();
        done();
      });
    });
  });

  describe('#map', () => {
    it('should map over the given value for resolved task', done => {
      const t = Task.of(5).map(x => x * 2);
      t.fork(done, n => {
        expect(n).toBe(10);
        done();
      });
    });

    it('should ignore for rejected task', done => {
      const t = Task.Rejected(5).map(x => x * 2);
      t.fork(n => {
        expect(n).toBe(5);
        done();
      }, () => done('Shouldnt be here'));
    });
  });

  describe('#mapRejected', () => {
    it('should ignore for resolved task', done => {
      const t = Task.Rejected(5).mapRejected(x => x * 2);
      t.fork(n => {
        expect(n).toBe(10);
        done();
      }, () => done('Shouldnt be here'));
    });

    it('should map over the given value for rejected task', done => {
      const t = Task.of(5).mapRejected(x => x * 2);
      t.fork(done, n => {
        expect(n).toBe(5);
        done();
      });
    });
  });

  describe('#bimap', () => {
    const mapper = t => t.bimap(x => x * 2, y => y * 3);

    it('should map over the given value for resolved task', done => {
      mapper(Task.of(5)).fork(done, n => {
        expect(n).toBe(15);
        done();
      });
    });

    it('should ignore for rejected task', done => {
      mapper(Task.Rejected(5)).fork(n => {
        expect(n).toBe(10);
        done();
      }, () => done('Shouldnt be here'));
    });
  });

  describe('#chain', () => {
    it('should map over the given value and merge nested task for resolved task', done => {
      const t = Task.of(5).chain(x => Task.of(2 * x));
      t.fork(done, n => {
        expect(n).toBe(10);
        done();
      });
    });

    it('should ignore for rejected task', done => {
      const t = Task.Rejected(5).chain(x => Task.of(2 * x));
      t.fork(n => {
        expect(n).toBe(5);
        done();
      }, () => done('Shouldnt be here'));
    });

    it('should throw error if result is not a task', () => {
      // Typescript will break here. Ignoring ts for runtime behavior
      // @ts-ignore
      const t = Task.of(5).chain(x => 2 * x);
      expect(() => t.fork(() => {}, () => {})).toThrowError();
    });
  });

  describe('#empty', () => {
    it('should ignore previous operations and never resolve or reject', done => {
      const t = Task.of(5)
        .map(x => x + 1)
        .chain(x => Task.of(2 * x))
        .empty()
        .map(x => x + 5);

      t.fork(done, done); // Wont call either one of the pipes

      setTimeout(() => done(), 100);
    });
  });

  describe('#toPromise', () => {
    it('should return a resolved promise', done => {
      const t = Task.of(5)
        .map(x => x + 1)
        .chain(x => Task.of(2 * x))
        .map(x => x + 5);

      t.toPromise()
        .then(d => {
          expect(d).toBe(17);
          done();
        })
        .catch(done);
    });

    it('should return a resolved promise', done => {
      const t = Task.Rejected(5)
        .map(x => x + 1)
        .chain(x => Task.of(2 * x))
        .map(x => x + 5);

      t.toPromise()
        .then(() => done('shoundt be here'))
        .catch(n => {
          expect(n).toBe(5);
          done();
        });
    });
  });

  describe('Timeout example (integrated test)', () => {
    it('should delay (combination test of map, chain and fork)', done => {
      const start = Date.now();
      // TODO: Fix fork options error
      delay(100)
        .map(() => 100)
        .map(n => n + 50)
        .chain(delay)
        .map(() => 10)
        .fork({
          Cancelled: () => null,
          Rejected: () => null,
          Resolved: x => {
            expect(x).toBe(10);
            expect(Date.now() - start).toBeGreaterThanOrEqual(200);
            done();
          },
        });
    });

    it('should reject', done => {
      const err = new Error('Eoww');
      Task.Rejected(err)
        .fork(
          e => {
            expect(e).toBe(err);
            done();
          },
          () => done('shouldnt have reached here'),
        );
    });

    it('should cancel without cancel handler', done => {
      const cancel = delay(50, () => {}).fork(done, () => done('shouldnt have reached here'));
      cancel();
      setTimeout(() => done(), 150);
    });

    it('should cancel', done => {
      const cancel = delay(50).fork(done, () => done('shouldnt have reached here'));
      cancel();
      setTimeout(() => done(), 150);
    });
  });

  describe('Cancellation', () => {
    it('should cancel task', done => {
      const cancel = resolveAfter(50, {}).fork(done, () => done('shouldnt have reached here'));
      cancel();
      setTimeout(() => done(), 150);
    });

    it('should cancel task and allow handling cancellation', done => {
      const cancel = resolveAfter(50, {}).fork({
        Rejected: done,
        Cancelled: done,
        Resolved: () => done('shouldnt have reached here'),
      });

      cancel();
    });

    it('should cancel task from within a task', done => {
      const task = Task((rej, res, cancel) => cancel());

      task.fork({
        Rejected: done,
        Cancelled: done,
        Resolved: () => done('shouldnt have reached here'),
      });
    });
  });
});

