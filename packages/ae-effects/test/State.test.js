
import State from '../src/State';
import { sleep, call } from '@algebraic-effects/core/operations';

describe('State', () => {
  const logFn = jest.fn();

  afterEach(() => {
    logFn.mockClear();
  });

  it('should count down to 0 from 10 with setter', done => {
    const countdown = function *() {
      const count = yield State.get();
  
      logFn(count);
  
      if(count > 0) {
        yield State.set(count - 1);
        yield sleep(10);
        return yield call(countdown);
      }

      return count;
    };

    State.of(10)
      .run(countdown)
      .then(result => {
        expect(result).toBe(0);
        const reversecount = [10, 9, 8, 7, 6, 5, 4, 3, 2, 1, 0];
        expect(logFn.mock.calls.map(x => x[0])).toEqual(reversecount);
      })
      .then(() => done())
      .catch(done);
  });

  it('should count down to 0 from 10 with update', done => {
    const countdown = function *() {
      const { count, done } = yield State.get();

      logFn(count, done);

      if(count > 0) {
        yield State.update(state => ({ ...state, count: state.count - 1 }));
        return yield call(countdown);
      }

      yield State.update(state => ({ ...state, done: true }));
      return yield State.get();
    };

    State.of({ count: 10, done: false })
      .run(countdown)
      .then(result => {
        expect(result).toEqual({ count: 0, done: true });
        const reversecount = [10, 9, 8, 7, 6, 5, 4, 3, 2, 1, 0];
        expect(logFn.mock.calls.map(x => x[0])).toEqual(reversecount);
      })
      .then(() => done())
      .catch(done);
  });
});
