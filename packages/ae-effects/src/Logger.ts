import { createEffect, func } from '@algebraic-effects/core';
import { FlowOperators } from '@algebraic-effects/core';

const Logger = createEffect('Logger', {
  log: func(['label', 'data'], 'data'),
  message: func(['...msg']),
  info: func(['info']),
  error: func(['e']),
  warn: func(['e']),
});

export interface ConsoleInterface {
  log: (...x: any[]) => any;
  error: (e: any) => any;
  warn: (e: any) => any;
  info: (s: string) => any;
}

export const fromConsole = (consoleInterface: ConsoleInterface) => {
  const noop = () => {};
  const logger = consoleInterface || { log: (_, d) => d, error: noop, warn: noop, info: noop };

  return Logger.handler({
    log: (o: FlowOperators) => (label: string, data: any) => {
      logger.log(label, data);
      o.resume(data);
    },
    message: (o: FlowOperators) => (...str: any[]) => o.resume(logger.log(...str)),
    info: (o: FlowOperators) => (str: string) => o.resume(logger.info(str)),
    error: (o: FlowOperators) => (e: any) => o.resume(logger.error(e)),
    warn: (o: FlowOperators) => (e: any) => o.resume(logger.warn(e)),
  });
};

export default Logger;
