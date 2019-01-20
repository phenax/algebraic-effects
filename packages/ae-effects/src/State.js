import { createEffect, func } from '@algebraic-effects/core';

// State :: Effect
const State = createEffect('State', {
  get: func([], 'a'),
  set: func(['a']),
  update: func(['a -> a'], 'a'),
});

// State.of :: a -> Runner a
State.of = initState => {
  let current = initState;

  return State.handler({
    get: ({ resume }) => () => resume(current),
    set: ({ resume }) => x => resume(current = x),
    update: ({ resume }) => fn => resume(current = fn(current)),
  });
};

export default State;
