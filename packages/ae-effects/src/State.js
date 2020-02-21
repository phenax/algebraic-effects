import { createEffect, func } from '@algebraic-effects/core';

// State :: Effect
const State = createEffect('State', {
  get: func([], 'a'),
  set: func(['a']),
  update: func(['a -> a'], 'a'),
});

// State.of :: a -> Runner a
State.of = (initState, CustomState = State) => {
  let current = initState;

  return CustomState.handler({
    get: o => () => o.resume(current),
    set: o => x => o.resume(current = x),
    update: o => fn => o.resume(current = fn(current)),
  });
};

export default State;
