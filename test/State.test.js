
import State from '../src/State';
import { sleep, call } from '../src/operations';

describe('State', () => {
  const log = jest.fn();
  const countdown = function *() {
    const count = yield State.get();
    log(count);
    if(count > 0) {
      yield State.set(count - 1);
      yield sleep(10);
      yield call(countdown);
    }
  };

  beforeEach(() => {
    log.mockClear();
  });

  it('should resolve with the correct value for valid operation', done => {
    State.of(10)(countdown)
      .then(() => {
        const reversecount = Array(11).fill(null).map((_, i) => i).reverse();
        expect(log.mock.calls.map(x => x[0])).toEqual(reversecount);
      })
      .then(() => done())
      .catch(done);
  });
});
