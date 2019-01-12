
import { createEffect } from '../src';

describe('createEffect', () => {
  const ApiEffect = createEffect('ApiEffect', {
    fetch: ['url', 'request'],
  });

  const apiEffect = ApiEffect.handler({
    fetch: next => (url, req) => setTimeout(() => next({ url, req, data: 'wow' }), 500),
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
  
  describe('example usage', () => {
    const action = function *() {
      const response = yield ApiEffect.fetch('/some-api');
      yield response.data;
    };
  
    it('should resolve with the correct value for valid operation', done => {
      apiEffect(action)
        .then(data => {
          expect(data).toBe('wow');
          done();
        })
        .catch(done);
    });
  });
});

