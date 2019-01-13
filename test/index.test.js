
import { createEffect, composeEffects, composeHandlers } from '../src';
import { sleep, call } from '../src/operations';

describe('createEffect', () => {
  const ConsoleEff = createEffect('ConsoleEff', {
    log: ['...data'],
  });

  const ApiEffect = createEffect('ApiEffect', {
    fetch: ['url', 'request'],
  });
  
  const State = createEffect('State', {
    get: [],
    set: ['x'],
  });

  describe('Effect type', () => {
    it('should have type info', () => {
      expect(ApiEffect.name).toBe('ApiEffect');
    });

    it('should have fetch operation', () => {
      expect(ApiEffect.fetch).toBeInstanceOf(Function);
      expect(ApiEffect.fetch().name).toBe('fetch');
      expect(ApiEffect.fetch('/').payload).toEqual(['/']);
    });
  });

  describe('composeEffects', () => {
    const action = function *() {
      const response = yield ApiEffect.fetch('/some-api');
      yield ConsoleEff.log(response);
      yield response.data;
    };

    it('should compose Api and IO effects', done => {
      const Effect = composeEffects(ApiEffect, ConsoleEff);

      const eff = Effect.handler({
        log: ({ resume }) => ({ data }) => {
          expect(data).toBe('wow');
          resume();
        },
        fetch: ({ resume }) => () => resume({ data: 'wow' }),
      });

      eff(action)
        .then(() => done())
        .catch(done);
    });
  });

  describe('composeHandlers', () => {
    const action = function *() {
      const response = yield ApiEffect.fetch('/some-api');
      yield ConsoleEff.log(response + ' world');
      yield response;
    };

    it('should compose Api and IO effects', done => {
      const logg = jest.fn();
      const api = ApiEffect.handler({
        fetch: ({ resume }) => () => resume('Hello'),
      });
      const konsole = ConsoleEff.handler({
        log: ({ resume }) => d => resume(logg(d)),
      });

      const eff = composeHandlers(api, konsole);

      eff(action)
        .then(data => {
          expect(data).toBe('Hello');
          expect(logg).toBeCalledWith('Hello world');
          done();
        })
        .catch(done);
    });
  });

  describe('example usage', () => {
    const action = function *() {
      const response = yield ApiEffect.fetch('/some-api');
      yield response.data;
    };

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
  
    it('should resolve with the correct value for valid operation (fetch example)', done => {
      const api = ApiEffect.handler({
        fetch: ({ resume }) => (url, req) => setTimeout(() => resume({ url, req, data: 'wow' }), 500),
      });

      api(action)
        .then(data => {
          expect(data).toBe('wow');
          done();
        })
        .catch(done);
    });

    it('should count down to 0 (state example)', done => {
      const state = initState => {
        let current = initState;
        return State.handler({
          get: ({ resume }) => () => resume(current),
          set: ({ resume }) => x => resume(current = x),
        });
      };

      state(10)(countdown)
        .then(() => {
          const reversecount = Array(11).fill(null).map((_, i) => i).reverse();
          expect(log.mock.calls.map(x => x[0])).toEqual(reversecount);
        })
        .then(() => done())
        .catch(done);
    });
  });
});

