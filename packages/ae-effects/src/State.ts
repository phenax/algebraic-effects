import { Effect, FlowOperators, createEffect, func } from '@algebraic-effects/core';

const State = createEffect('State', {
  get: func([], 'a'),
  set: func(['a']),
  update: func(['a -> a'], 'a'),
});

export function state<T = any>(initState: T, CustomState: Effect = State) {
  let current: T = initState;

  return CustomState.handler({
    get: (o: FlowOperators) => () => o.resume(current),
    set: (o: FlowOperators) => (x: T) => o.resume(current = x),
    update: (o: FlowOperators) => (updateFn: (s: T) => T) => {
      current = updateFn(current);
      o.resume(current);
    },
  });
};

export default State;
