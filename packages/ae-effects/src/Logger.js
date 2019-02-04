import { createEffect, func } from '@algebraic-effects/core';

const Logger = createEffect('Logger', {
  log: func(['label', 'data'], 'data'),
  message: func(['...msg']),
  info: func(['info']),
  error: func(['e']),
  warn: func(['e']),
});

const noop = () => {};

const guard = konsole => konsole || {
  log: (_, d) => d,
  error: noop,
  warn: noop,
  info: noop,
};

Logger.from = konsole => Logger.handler({
  log: ({ resume }) => (label, data) => {
    guard(konsole).log(label, data);
    resume(data);
  },
  message: ({ resume }) => (...str) => resume(guard(konsole).log(...str)),
  info: ({ resume }) => str => resume(guard(konsole).info(str)),
  error: ({ resume }) => e => resume(guard(konsole).error(e)),
  warn: ({ resume }) => e => resume(guard(konsole).warn(e)),
});

export default Logger;
