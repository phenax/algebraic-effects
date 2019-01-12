
import { createEffect, sleep } from '../src';

const Exception = createEffect('Exception', {
  throw: [], // NOTE: Unneccassary api
});

Exception.try = Exception.handler({
  throw: (resume, end, throw_) => msg => throw_(msg),
});

describe('Exception', () => {
  const divide = function *(a, b) {
    if (b === 0) yield Exception.throw(new Error('Invalid operation'));
    // yield sleep(500);
    yield a / b;
  };

  it('should resolve with the correct value for valid operation', done => {
    Exception.try(divide, 12, 3)
      .then(result => {
        expect(result).toBe(4);
        done();
      })
      .catch(done);
  });

  it('should reject with invalid operation error if denominator is 0', done => {
    Exception.try(divide, 8, 0)
      .then(() => done(new Error('Shouldn have been called boey')))
      .catch(e => {
        expect(e.message).toBe('Invalid operation');
        done();
      });
  });
});
