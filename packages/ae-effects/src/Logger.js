import { createEffect, func } from '@algebraic-effects/core';

const Logger = createEffect('Logger', {
  log: func(['label', 'data'], 'data'),
  message: func(['...msg']),
  info: func(['info']),
  error: func(['e']),
  warn: func(['e']),
});

Logger.from = loggerInterface => {
  const noop = () => {};
  const logger = loggerInterface || { log: (_, d) => d, error: noop, warn: noop, info: noop };

  return Logger.handler({
    log: ({ resume }) => (label, data) => {
      logger.log(label, data);
      resume(data);
    },
    message: ({ resume }) => (...str) => resume(logger.log(...str)),
    info: ({ resume }) => str => resume(logger.info(str)),
    error: ({ resume }) => e => resume(logger.error(e)),
    warn: ({ resume }) => e => resume(logger.warn(e)),
  });
};

export default Logger;
