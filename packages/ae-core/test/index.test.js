
import { createEffect, func, composeEffects, composeHandlers } from '../src';
import { sleep } from '../src/operations';

describe('createEffect', () => {
  const ConsoleEff = createEffect('ConsoleEff', {
    log: func(['...data']),
  });

  const ApiEffect = createEffect('ApiEffect', {
    fetch: func(['url', '?request'], '*'),
  });

  describe('Effect type', () => {
    it('should have type info', () => {
      expect(ApiEffect.name).toBe('ApiEffect');
    });

    it('should have fetch operation', () => {
      expect(ApiEffect.fetch).toBeInstanceOf(Function);
      expect(ApiEffect.fetch('/').name).toBe('fetch');
      expect(ApiEffect.fetch('/').payload).toEqual(['/']);
    });
  });

  describe('Runner', () => {
    it('should have runner effect name', () => {
      const runner = ApiEffect.handler({
        fetch: () => () => {},
      });
      expect(runner.effectName).toBe('ApiEffect');
    });

    it('should reject task the op fails arg check', done => {
      function* action() {
        yield ApiEffect.fetch();
      }

      ApiEffect.handler({ fetch: () => () => {} })
        .run(action)
        .fork(e => {
          expect(e.message).toContain('ArgumentError');
          done();
        }, () => done('Shoundt have ben called'));
    });

    it('should reject task for invalid program', done => {
      const notAGenerator = () => {};

      const callProgram = jest.fn(() =>
        ApiEffect.handler({ fetch: () => () => {} })
          .run(notAGenerator)
          .fork(() => {}, () => {}));

      expect(callProgram).toThrowError();
      done();
    });
  });

  describe('createRunner#with & createRunner#concat', () => {
    const DummyEff = createEffect('DummyEff', { myFn: func() });

    it('should compose handler with another handler using .with', done => {
      const action = function *() {
        yield DummyEff.myFn();
        yield ConsoleEff.log();
        yield 'Yo';
      };
      
      const myFn = jest.fn();
      const logg = jest.fn();
      const dummy = DummyEff.handler({ myFn: ({ resume }) => () => resume(myFn()) });
      const konsole = ConsoleEff.handler({ log: ({ resume }) => d => resume(logg(d)) });

      const run = dummy.with(konsole);

      expect(run.effectName).toBe('DummyEff.ConsoleEff');

      run(action)
        .fork(done, () => {
          expect(myFn).toBeCalledTimes(1);
          expect(logg).toBeCalledTimes(1);
          done();
        });
    });

    it('should compose handler with another handler using .concat', done => {
      const action = function *() {
        yield DummyEff.myFn();
        yield ConsoleEff.log();
        yield 'Yo';
      };

      const myFn = jest.fn();
      const logg = jest.fn();
      const dummy = DummyEff.handler({ myFn: ({ resume }) => () => resume(myFn()) });
      const konsole = ConsoleEff.handler({ log: ({ resume }) => d => resume(logg(d)) });

      const run = dummy.concat(konsole);

      expect(run.effectName).toBe('DummyEff.ConsoleEff');

      run(action)
        .fork(done, () => {
          expect(myFn).toBeCalledTimes(1);
          expect(logg).toBeCalledTimes(1);
          done();
        });
    });
  });

  describe('createRunner#cancel', () => {
    const DummyEff = createEffect('DummyEff', { myFn: func() });

    it('should cancel runner if .cancel is called', done => {
      const action = function *() {
        yield DummyEff.myFn();
        yield sleep(500);
        yield DummyEff.myFn();
        yield 'Yo';
      };

      const myFn = jest.fn();
      const error = () => done('Shundt be called');
      const task = DummyEff
        .handler({ myFn: ({ resume }) => () => resume(myFn()) })
        .run(action)
        .fork(error, error);

      setTimeout(() => {
        task();
        
        setTimeout(() => {
          expect(myFn).toBeCalledTimes(1);
          done();
        }, 500);
      }, 100);

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
        .fork(done, () => done());
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
        .fork(done, data => {
          expect(data).toBe('Hello');
          expect(logg).toBeCalledWith('Hello world');
          done();
        });
    });
  });

  describe('example usage', () => {
    it('should resolve with the correct value for valid operation (fetch example)', done => {
      const api = ApiEffect.handler({
        fetch: ({ resume }) => (url, req) => setTimeout(() => resume({ url, req, data: 'wow' }), 500),
      });

      const action = function *() {
        const response = yield ApiEffect.fetch('/some-api');
        yield response.data;
      };

      api(action)
        .fork(done, data => {
          expect(data).toBe('wow');
          done();
        });
    });

    it('should resolve with the correct value for valid operation (fetch example)', done => {
      const api = ApiEffect.handler({
        fetch: ({ resume }) => (url, req) => setTimeout(() => resume({ url, req, data: 'wow' }), 500),
      });

      const action = function *() {
        const response = yield ApiEffect.fetch('/some-api');
        yield ConsoleEff.log('Wrong operation');
        yield response.data;
      };

      api(action)
        .fork(e => {
          expect(e.message).toContain('Invalid operation');
          expect(e.message).toContain('"log"');
          done();
        }, () => done('Shouldve thrown error'));
    });
  });
});

