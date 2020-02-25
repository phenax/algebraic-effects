import Logger, { fromConsole } from '@algebraic-effects/effects/Logger';
import { createEffect, func, composeHandlers } from '../src';
import { sleep } from '../src/generic';

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
      expect(ApiEffect.fetch('/').name).toBe('ApiEffect[fetch]');
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

    it('should allow adding custom behavior to generic effects using .with', done => {
      const action = function *() {
        yield Logger.message('Nothing');
        yield DummyEff.myFn();
        return yield sleep('Hello world');
      };

      fromConsole(null)
        .with(DummyEff.handler({ myFn: ({ resume }) => () => resume() }))
        .with({ sleep: ({ resume }) => d => resume(d) })
        .run(action)
        .fork(done, res => {
          expect(res).toBe('Hello world');
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

    it('should allow operations with the same name under different effects', done => {
      const Log1 = createEffect('Log1', { log: func(['...a']) });
      const Log2 = createEffect('Log2', { log: func(['...a']) });
      const action = function *() {
        yield Log1.log('a');
        yield Log2.log('b');
        yield 'Yo';
      };
      
      const logfn1 = jest.fn();
      const logfn2 = jest.fn();
      const l1 = Log1.handler({ log: ({ resume }) => d => resume(logfn1(d)) });
      const l2 = Log2.handler({ log: ({ resume }) => d => resume(logfn2(d)) });

      const run = l1.with(l2);

      run(action).fork(done, () => {
        expect(logfn1).toBeCalledWith('a');
        expect(logfn2).toBeCalledWith('b');
        done();
      });
    });
  });

  describe('.extendAs', () => {
    const DummyEff = createEffect('DummyEff', { myFn: func() });

    it('should allow extending an effect without collisions without any additional methods', done => {
      const NewDummyEff = DummyEff.extendAs('NewDummyEffect');

      const action = function *() {
        yield DummyEff.myFn();
        yield NewDummyEff.myFn('Hello1');
        yield 'Yo';
      };

      const aFn = jest.fn();
      const bFn = jest.fn();
      const bHandler = DummyEff.handler({ myFn: ({ resume }) => () => resume(aFn()) });
      const aHandler = NewDummyEff.handler({ myFn: ({ resume }) => d => resume(bFn(d)) });

      const run = bHandler.with(aHandler);

      run(action).fork(done, () => {
        expect(aFn).toBeCalledTimes(1);
        expect(bFn).toBeCalledTimes(1);
        expect(bFn).toBeCalledWith('Hello1');
        done();
      });
    });

    it('should allow extending an effect without collisions', done => {
      const NewDummyEff = DummyEff.extendAs('NewDummyEffect', {
        otherFunc: func(['a']),
      });

      const action = function *() {
        yield DummyEff.myFn();
        yield NewDummyEff.myFn('Hello1');
        yield NewDummyEff.otherFunc('Hello2');
        yield 'Yo';
      };

      const aFn = jest.fn();
      const bFn = jest.fn();
      const bHandler = DummyEff.handler({ myFn: ({ resume }) => () => resume(aFn()) });
      const aHandler = NewDummyEff.handler({
        otherFunc: ({ resume }) => d => resume(bFn(d)),
        myFn: ({ resume }) => msg => resume(bFn(msg)),
      });

      const run = bHandler.with(aHandler);

      run(action).fork(done, () => {
        expect(aFn).toBeCalledTimes(1);
        expect(bFn).toBeCalledTimes(2);
        expect(bFn).toBeCalledWith('Hello1');
        expect(bFn).toBeCalledWith('Hello2');
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
          expect(e.message).toContain('"ConsoleEff[log]"');
          done();
        }, () => done('Shouldve thrown error'));
    });
  });
});

