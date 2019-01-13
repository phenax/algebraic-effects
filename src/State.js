import { createEffect } from '.';

// State :: Effect
const State = createEffect('State', {
  get: [],
  set: ['x'],
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
