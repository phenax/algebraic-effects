
import { Effect, runEffect } from '../src';

describe('Hello', () => {
  const effectful = Effect({
    throw: Effect.fn(['message'], null),
  });

  const divide = effectful.handler(function *(a, b) {
    if (b === 0) yield effectful.throw('Invalid operation');
    return a / b;
  });

  const fn = divide.handle({
    throw: (resume, end) => msg => end(msg),
    _: resume => v => resume(v),
  });

  it('should', done => {
    runEffect()(fn, 8, 3)
      .then(console.log)
      .catch(console.log.bind(null, 'ERR'))
      .then(done);
  });

  it('should', done => {
    runEffect()(fn, 8, 0)
      .then(console.log)
      .catch(console.log.bind(null, 'ERR'))
      .then(done);
  });
});
