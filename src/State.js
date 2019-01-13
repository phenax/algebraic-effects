import { createEffect, func } from '.';

// State :: Effect
const State = createEffect('State', {
  get: func([], 'a'),
  set: func(['a']),
});

// State.of :: a -> Runner a
State.of = initState => {
  let current = initState;

  return State.handler({
    get: ({ resume }) => () => resume(current),
    set: ({ resume }) => x => resume(current = x),
  });
};

export default State;
