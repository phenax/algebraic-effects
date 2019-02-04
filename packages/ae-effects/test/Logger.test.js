
import Logger from '../src/Logger';

describe('Logger', () => {
  describe('Logger.from', () => {
    const logFn = jest.fn();
    const loggerInterface = {
      log: logFn.bind(null, '>log'),
      error: logFn.bind(null, '>error'),
      warn: logFn.bind(null, '>warn'),
      info: logFn.bind(null, '>info'),
    };

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
  
    it('should result in a random number b/w 0,1 every time', done => {
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
  });
});
