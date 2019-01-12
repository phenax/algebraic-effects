
import { run } from '../src';
import { sleep } from '../src/operations';

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
});
