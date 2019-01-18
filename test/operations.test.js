
import { run, func } from '../src';
import { sleep, awaitPromise, resolve, call, race, parallel, addGlobalOperation } from '../src/operations';

describe('Global operations', () => {
  describe('sleep', () => {
    function* gimmeXReturned(x) {
      yield sleep(150);
      yield sleep(300);
      return x;
    }

    function* gimmeXYielded(x) {
      yield sleep(450);
      yield x;
    }

    it('should wait 900 ms before resolving promise with 5 (as return value)', done => {
      const startTime = Date.now();
      run(gimmeXReturned, 5)
        .then(x => {
          expect(x).toBe(5);
          expect(Date.now() - startTime).toBeGreaterThan(400);
          done();
        })
        .catch(done);
    });

    it('should wait 900 ms before resolving promise with 5 (as yield value)', done => {
      const startTime = Date.now();
      run(gimmeXYielded, 5)
        .then(x => {
          expect(x).toBe(5);
          expect(Date.now() - startTime).toBeGreaterThan(400);
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

  describe('resolve', () => {
    function* gimmeXReturned(x) {
      yield resolve(x);
    }

    it('should wait 900 ms before resolving promise with 5 (as return value)', done => {
      run(gimmeXReturned, 5)
        .then(x => {
          expect(x).toBe(5);
          done();
        })
        .catch(done);
    });
  });

  describe('call', () => {
    const logfn = jest.fn();
    function* finalCountdown(x) {
      if(x <= 0) return x;
      yield sleep(500);
      logfn(x);
      yield call(finalCountdown, x - 1);
    }

    function* programB() {
      yield sleep(100);
      logfn('B');
    }

    function* programA() {
      logfn('A');
      yield call(programB);
    }

    afterEach(() => {
      logfn.mockClear();
    });

    it('should call itself recursively (program recusrsion)', done => {
      run(finalCountdown, 3)
        .then(() => {
          expect(logfn).toBeCalledTimes(3);
          expect(logfn.mock.calls.map(x => x[0])).toEqual([ 3, 2, 1 ]);
          done();
        })
        .catch(done);
    });

    it('should call another program with the same set of effects', done => {
      run(programA)
        .then(() => {
          expect(logfn).toBeCalledTimes(2);
          expect(logfn.mock.calls.map(x => x[0])).toEqual([ 'A', 'B' ]);
          done();
        })
        .catch(done);
    });
  });

  describe('race', () => {
    function* programA(delay) {
      yield sleep(delay);
      return 'A';
    }
    function* programB(delay) {
      yield sleep(delay);
      return 'B';
    }

    function* myProgramRace() {
      const winner = yield race([ programA(100), programB(50) ]);
      return `${winner} wins`;
    }

    it('should race both programs and resolve with the fastest one', done => {
      run(myProgramRace)
        .then(result => {
          expect(result).toBe('B wins');
          done();
        })
        .catch(done);
    });
  });

  describe('Custom global operations', () => {
    const logfn = jest.fn();

    const log = addGlobalOperation('log', func(['...data']),
      ({ resume }) => (...data) => resume(logfn(...data)));

    function* program(x) {
      yield log('Data', x);
      return x;
    }

    afterEach(() => {
      logfn.mockClear();
    });

    it('should wait 900 ms before resolving promise with 5 (as return value)', done => {
      run(program, 5)
        .then(x => {
          expect(x).toBe(5);
          expect(logfn).toBeCalledWith('Data', 5);
          done();
        })
        .catch(done);
    });
  });
});
