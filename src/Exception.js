
import { createEffect } from '.';

// Exception :: Effect
const Exception = createEffect('Exception', {
  throw: ['error'],
});

// Exception.try :: Runner
Exception.try = Exception.handler({
  throw: ({ throwError }) => e => throwError(e),
});

export default Exception;
