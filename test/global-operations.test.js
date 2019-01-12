
import { run } from '../src';
import { sleep, awaitPromise } from '../src/operations';

describe('Global operations', () => {
  describe('sleep', () => {
    function* gimmeXReturned(x) {
      yield sleep(100);
      yield sleep(500);
      yield sleep(300);
      return x;
    }

    function* gimmeXYielded(x) {
      yield sleep(900);
      yield x;
    }

    it('should wait 900 ms before resolving promise with 5 (as return value)', done => {
      const startTime = Date.now();
      run(gimmeXReturned, 5)
        .then(x => {
          expect(x).toBe(5);
          expect(Date.now() - startTime).toBeGreaterThan(800);
          done();
        })
        .catch(done);
    });

    it('should wait 900 ms before resolving promise with 5 (as yield value)', done => {
      const startTime = Date.now();
      run(gimmeXYielded, 5)
        .then(x => {
          expect(x).toBe(5);
          expect(Date.now() - startTime).toBeGreaterThan(800);
          done();
        })
        .catch(done);
    });
  });

  describe('awaitPromise', () => {
    function* runSuccPromise() {
      const resp = yield awaitPromise(Promise.resolve({
        data: 'Some data',
      }));
      return resp.data;
    }

    function* runFailPromise() {
      const resp = yield awaitPromise(Promise.reject('rror'));
      return resp.data;
    }

    it('should resolve normally for resolves promise', done => {
      run(runSuccPromise)
        .then(x => {
          expect(x).toBe('Some data');
          done();
        })
        .catch(done);
    });

    it('should resolve normally for resolves promise', done => {
      run(runFailPromise)
        .then(done)
        .catch(e => {
          expect(e).toBe('rror');
          done();
        });
    });
  });
});
