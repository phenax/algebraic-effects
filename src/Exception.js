
import { createEffect } from '.';

const Exception = createEffect('Exception', {
  throw: [], // NOTE: Unneccassary api
});

Exception.try = Exception.handler({
  throw: (_, __, throw_) => msg => throw_(msg),
});

export default Exception;
