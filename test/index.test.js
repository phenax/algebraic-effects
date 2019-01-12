
import { createEffect } from '../src';

const ApiEffect = createEffect('ApiEffect', {
  fetch: [],
});

const apiEffect = ApiEffect.handler({
  fetch: next => (url, req) => setTimeout(() => next({ url, req, data: 'wow' }), 500),
});

describe('createEffect example', () => {
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

