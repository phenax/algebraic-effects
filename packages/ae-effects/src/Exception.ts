
import { createEffect, func } from '@algebraic-effects/core';
import { FlowOperators } from '@algebraic-effects/core';

const Exception = createEffect('Exception', {
  throw: func(['error']),
});

export const tryCatch = Exception.handler({
  throw: (o: FlowOperators) => o.throwError,
});

export default Exception;
