
import Exception from '../src/Exception';

describe('Exception', () => {
  // Divide function with added delays
  const divide = function *(a, b) {
    if (b === 0) yield Exception.throw(new Error('Invalid operation'));
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

  it('should convert operation to Either', done => {
    const toEither = Exception.handler({
      _: (_, end) => x => end({ right: x }),
      throw: (_, end) => e => end({ left: e.message }),
    });

    const p1 = toEither(divide, 12, 6).then(result => {
      expect(result.right).toBe(2);
    });
    
    const p2 = toEither(divide, 12, 0).then(result => {
      expect(result.left).toBe('Invalid operation');
    });

    p1.then(() => p2).then(() => done()).catch(done);
  });
});
