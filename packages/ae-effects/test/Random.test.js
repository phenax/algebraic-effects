
import Random from '../src/Random';

const SAMPLE_SET = 20;

describe('Random', () => {

  describe('number', () => {
    const logFn = jest.fn();
    const randomizor = function *() {
      for(let i = 0; i < SAMPLE_SET; i++)
        logFn(yield Random.number());
    };

    afterEach(() => { logFn.mockClear(); });
  
    it('should result in a random number b/w 0,1 every time', done => {
      Random.random(randomizor, 0, 20)
        .fork(done, () => {
          logFn.mock.calls.map(x => x[0]).forEach(x => {
            expect(x).toBeGreaterThanOrEqual(0);
            expect(x).toBeLessThanOrEqual(1);
          });
          done();
        });
    });
  });
  
  describe('getInt', () => {
    const logFn = jest.fn();
    const randomizor = function *(a, b) {
      for(let i = 0; i < SAMPLE_SET; i++)
        logFn(yield Random.getInt(a, b));
    };

    afterEach(() => { logFn.mockClear(); });
  
    it('should result in a random integer every time', done => {
      Random.random(randomizor, 0, 20)
        .fork(done, () => {
          logFn.mock.calls.map(x => x[0]).forEach(x => {
            expect(x).toBeGreaterThanOrEqual(0);
            expect(x).toBeLessThanOrEqual(20);
          });
          done();
        });
    });
  });

  describe('fromArray', () => {
    const logFn = jest.fn();
    const randomizor = function *(list) {
      for(let i = 0; i < SAMPLE_SET; i++)
        logFn(yield Random.fromArray(list));
    };

    afterEach(() => { logFn.mockClear(); });

    it('should result in a random value from the given array', done => {
      const list = [2342, 112, 'afshkjsz', 'wpw', true, {}, []];
      Random.random(randomizor, list)
        .fork(done, () => {
          logFn.mock.calls.map(x => x[0]).forEach(x => {
            expect(list).toContain(x);
          });
          done();
        });
    });
  });

  describe('seeded >> number', () => {
    const logFn = jest.fn();
    const randomizor = function *() {
      for(let i = 0; i < SAMPLE_SET; i++)
        logFn(yield Random.number());
    };

    afterEach(() => { logFn.mockClear(); });
  
    it('should result in a random number b/w 0,1 every time', done => {
      Random.seed(10)
        .run(randomizor, 0, 20)
        .fork(done, () => {
          logFn.mock.calls.map(x => x[0]).forEach(x => {
            expect(x).toBeGreaterThanOrEqual(0);
            expect(x).toBeLessThanOrEqual(1);
          });
          done();
        });
    });
  });
  
  describe('seeded >> getInt', () => {
    const logFn = jest.fn();
    const randomizor = function *(a, b) {
      for(let i = 0; i < SAMPLE_SET; i++)
        logFn(yield Random.getInt(a, b));
    };

    afterEach(() => { logFn.mockClear(); });
  
    it('should result in a random integer every time', done => {
      Random.seed(10)
        .run(randomizor, 0, 20)
        .fork(done, () => {
          logFn.mock.calls.map(x => x[0]).forEach(x => {
            expect(x).toBeGreaterThanOrEqual(0);
            expect(x).toBeLessThanOrEqual(20);
          });
          done();
        });
    });
  });

  describe('seeded >> fromArray', () => {
    const logFn = jest.fn();
    const randomizor = function *(list) {
      for(let i = 0; i < SAMPLE_SET; i++)
        logFn(yield Random.fromArray(list));
    };

    afterEach(() => { logFn.mockClear(); });

    it('should result in a random value from the given array', done => {
      const list = [2342, 112, 'afshkjsz', 'wpw', true, {}, []];
      Random.seed(10)
        .run(randomizor, list)
        .fork(done, () => {
          logFn.mock.calls.map(x => x[0]).forEach(x => {
            expect(list).toContain(x);
          });
          done();
        });
    });
  });

  describe('seeded >> flipCoin', () => {
    const logFn = jest.fn();
    const flipCoin = function *(times) {
      return yield Random.flipCoin(times);
    };

    afterEach(() => { logFn.mockClear(); });
  
    it('should flip a coin', done => {
      Random.seed(100)
        .run(flipCoin)
        .chain(res1 => Random.seed(10).run(flipCoin).map(res2 => [res1, res2]))
        .fork(done, flipResult => {
          expect(flipResult).toEqual([ false, true ]);
          done();
        });
    });
  });

  describe('seeded with multiple continuations', () => {
    describe('number', () => {
      function *randomizor(times) {
        return yield Random.number(times);
      }

      it('should result in a random number b/w 0,1 every time', done => {
        Random.seed(10)
          .runMulti(randomizor, SAMPLE_SET)
          .fork(done, result => {
            expect(result).toHaveLength(SAMPLE_SET);
            result.forEach(x => {
              expect(x).toBeGreaterThanOrEqual(0);
              expect(x).toBeLessThanOrEqual(1);
            });
            done();
          });
      });
    });
    
    describe('getInt', () => {
      function *randomizor(a, b, times) {
        return yield Random.getInt(a, b, times);
      }
    
      it('should result in a random integer every time', done => {
        Random.seed(10)
          .runMulti(randomizor, 0, 20, SAMPLE_SET)
          .fork(done, result => {
            expect(result).toHaveLength(SAMPLE_SET);
            result.forEach(x => {
              expect(x).toBeGreaterThanOrEqual(0);
              expect(x).toBeLessThanOrEqual(20);
            });
            done();
          });
      });
    });
  
    describe('fromArray', () => {
      const randomizor = function *(list, times) {
        return yield Random.fromArray(list, times);
      };
    
      it('should result in a random value from the given array', done => {
        const list = [2342, 112, 'afshkjsz', 'wpw', true, {}, []];
        Random.seed(10)
          .runMulti(randomizor, list, SAMPLE_SET)
          .fork(done, result => {
            expect(result).toHaveLength(SAMPLE_SET);
            result.forEach(x => {
              expect(list).toContain(x);
            });
            done();
          });
      });
    });

    describe('flipCoin', () => {
      const flipCoin = function *(times) {
        return yield Random.flipCoin(times);
      };

      it('should flip a bunch of coins', done => {
        Random.seed(100)
          .runMulti(flipCoin, 5)
          .fork(done, result => {
            expect(result).toHaveLength(5);
            expect(result).toEqual([false, false, true, true, false]);
            done();
          });
      });
    });
  });
});
