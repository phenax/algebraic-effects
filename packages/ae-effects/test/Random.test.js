
import Random from '../src/Random';

const SAMPLE_SET = 20;

describe('Random', () => {
  
  describe('getInt', () => {
    const logFn = jest.fn();
    const randomizor = function *(a, b) {
      for(let i = 0; i < SAMPLE_SET; i++)
        logFn(yield Random.getInt(a, b));
    };

    afterEach(() => { logFn.mockClear(); });
  
    it('should result in a random integer every time', done => {
      Random.effect(randomizor, 0, 20)
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
      Random.effect(randomizor, list)
        .fork(done, () => {
          logFn.mock.calls.map(x => x[0]).forEach(x => {
            expect(list).toContain(x);
          });
          done();
        });
    });
  });
});
