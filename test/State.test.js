
import { createEffect}  from '../src';
import State from '../src/State';
import { sleep, call } from '../src/operations';

describe('State', () => {
  const Logger = createEffect('Logger', { log: ['count'] });

  const countdown = function *() {
    const count = yield State.get();
    yield Logger.log(count);
    if(count > 0) {
      yield State.set(count - 1);
      yield sleep(10);
      yield call(countdown);
    }
  };

  it('should count down to 0 from 10', done => {
    const log = jest.fn();
    const logger = Logger.handler({ log: ({ resume }) => d => resume(log(d)) });

    State.of(10)
      .concat(logger)
      .run(countdown)
      .then(() => {
        const reversecount = [10, 9, 8, 7, 6, 5, 4, 3, 2, 1, 0];
        expect(log.mock.calls.map(x => x[0])).toEqual(reversecount);
      })
      .then(() => done())
      .catch(done);
  });
});
