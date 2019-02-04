import { createEffect, func } from '@algebraic-effects/core';

const Logger = createEffect('Logger', {
  log: func(['label', 'data'], 'data'),
  message: func(['...msg']),
  info: func(['info']),
  error: func(['e']),
  warn: func(['e']),
});

Logger.from = (konsole = console) => Logger.handler({
  log: ({ resume }) => (label, data) => {
    konsole.log(label, data);
    resume(data);
  },
  message: ({ resume }) => (...str) => resume(konsole.log(...str)),
  info: ({ resume }) => str => resume(konsole.info(str)),
  error: ({ resume }) => e => resume(konsole.error(e)),
  warn: ({ resume }) => e => resume(konsole.warn(e)),
});

export default Logger;
