import State, { state } from '../src/State';
import { sleep, call } from '@algebraic-effects/core/generic';

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

    state(10)
      .run(countdown)
      .map(result => {
        expect(result).toBe(0);
        const reversecount = [10, 9, 8, 7, 6, 5, 4, 3, 2, 1, 0];
        expect(logFn.mock.calls.map(x => x[0])).toEqual(reversecount);
      })
      .fork(done, () => done());
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

    state({ count: 10, done: false })
      .run(countdown)
      .map(result => {
        expect(result).toEqual({ count: 0, done: true });
        const reversecount = [10, 9, 8, 7, 6, 5, 4, 3, 2, 1, 0];
        expect(logFn.mock.calls.map(x => x[0])).toEqual(reversecount);
      })
      .fork(done, () => done());
  });

  it('should work well with another extended state and composition', done => {
    const CountListState = State.extendAs('CountListState');

    const countdown = function *() {
      const count = yield State.get();

      yield CountListState.update(list => [...list, count]);
  
      if(count > 0) {
        yield State.set(count - 1);
        yield sleep(10);
        return yield call(countdown);
      }

      return yield CountListState.get();
    };

    state(10)
      .with(state<number[]>([], CountListState))
      .run(countdown)
      .map(result => {
        const reversecount = [10, 9, 8, 7, 6, 5, 4, 3, 2, 1, 0];
        expect(result).toEqual(reversecount);
      })
      .fork(done, () => done());
  });
});
