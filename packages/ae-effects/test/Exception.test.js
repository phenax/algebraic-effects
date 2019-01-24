
import Exception from '../src/Exception';

describe('Exception', () => {
  // Divide function with added delays
  const divide = function *(a, b) {
    if (b === 0) yield Exception.throw(new Error('Invalid operation'));
    yield a / b;
  };

  it('should resolve with the correct value for valid operation', done => {
    Exception.try(divide, 12, 3)
      .fork(done, result => {
        expect(result).toBe(4);
        done();
      });
  });

  it('should reject with invalid operation error if denominator is 0', done => {
    Exception.try(divide, 8, 0)
      .fork(e => {
        expect(e.message).toBe('Invalid operation');
        done();
      }, () => done('Shouldn have been called boey'));
  });

  it('should convert operation to Either', done => {
    const toEither = Exception.handler({
      _: ({ end }) => x => end({ right: x }),
      throw: ({ end }) => e => end({ left: e.message }),
    });

    const p1 = toEither(divide, 12, 6).map(result => {
      expect(result.right).toBe(2);
    });
    
    const p2 = toEither(divide, 12, 0).mapRejected(result => {
      expect(result.left).toBe('Invalid operation');
    });

    p1.chain(() => p2).fork(done, () => done());
  });
});
