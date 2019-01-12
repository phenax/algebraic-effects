
import { createEffect, composeEffects, composeHandlers } from '../src';

describe('createEffect', () => {
  const ConsoleEff = createEffect('ConsoleEff', {
    log: ['...data'],
  });

  const ApiEffect = createEffect('ApiEffect', {
    fetch: ['url', 'request'],
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
        log: resume => ({ data }) => {
          expect(data).toBe('wow');
          resume();
        },
        fetch: resume => () => resume({ data: 'wow' }),
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
        fetch: resume => () => resume('Hello'),
      });
      const konsole = ConsoleEff.handler({
        log: resume => d => resume(logg(d)),
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
  
    it('should resolve with the correct value for valid operation', done => {
      const api = ApiEffect.handler({
        fetch: resume => (url, req) => setTimeout(() => resume({ url, req, data: 'wow' }), 500),
      });

      api(action)
        .then(data => {
          expect(data).toBe('wow');
          done();
        })
        .catch(done);
    });
  });
});

