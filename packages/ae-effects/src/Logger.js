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
    log: o => (label, data) => {
      logger.log(label, data);
      o.resume(data);
    },
    message: o => (...str) => o.resume(logger.log(...str)),
    info: o => str => o.resume(logger.info(str)),
    error: o => e => o.resume(logger.error(e)),
    warn: o => e => o.resume(logger.warn(e)),
  });
};

export default Logger;
