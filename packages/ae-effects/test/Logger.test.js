
import Logger from '../src/Logger';

describe('Logger', () => {
  describe('Logger.from', () => {
    const logFn = jest.fn();

    const program = function *() {
      yield Logger.message('Hello world');
      const data = yield Logger.log('label', 5);
      yield Logger.error('Error message');
      yield Logger.info('Info');
      yield Logger.warn('Warn message');
      yield Logger.message(`Data: ${data}`);
      return data;
    };

    afterEach(() => { logFn.mockClear(); });
  
    it('should log all stuff', done => {
      const loggerInterface = {
        log: logFn.bind(null, '>log'),
        error: logFn.bind(null, '>error'),
        warn: logFn.bind(null, '>warn'),
        info: logFn.bind(null, '>info'),
      };

      Logger.from(loggerInterface)
        .run(program)
        .map(result => {
          expect(result).toBe(5);
          expect(logFn).toHaveBeenCalledWith('>log', 'Hello world');
          expect(logFn).toHaveBeenCalledWith('>log', 'label', 5);
          expect(logFn).toHaveBeenCalledWith('>error', 'Error message');
          expect(logFn).toHaveBeenCalledWith('>info', 'Info');
          expect(logFn).toHaveBeenCalledWith('>warn', 'Warn message');
          expect(logFn).toHaveBeenCalledWith('>log', 'Data: 5');
        })
        .fork(done, () => done());
    });

    it('should not call shit if no interface', done => {
      Logger.from(null)
        .run(program)
        .map(result => {
          expect(result).toBe(5);
          expect(logFn).not.toBeCalled();
        })
        .fork(done, () => done());
    });
  });
});
