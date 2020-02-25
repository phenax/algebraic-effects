
import { createEffect, func } from '@algebraic-effects/core';
import { FlowOperators } from '@algebraic-effects/core';

interface ExceptionEffect {
  throw: (e: any) => any;
}

const Exception = createEffect<ExceptionEffect>('Exception', {
  throw: func(['error']),
});

export const tryCatch = Exception.handler({
  throw: (o: FlowOperators) => o.throwError,
});

export default Exception;
