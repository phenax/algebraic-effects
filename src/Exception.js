
import { createEffect } from '.';

// Exception :: Effect
const Exception = createEffect('Exception', {
  throw: [], // NOTE: Unneccassary api
});

// Exception.try :: Runner
Exception.try = Exception.handler({
  throw: (_, __, throwE) => e => throwE(e),
});

export default Exception;
