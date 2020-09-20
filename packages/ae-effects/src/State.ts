import { FlowOperators, createEffect, func } from '@algebraic-effects/core';

const State = createEffect<{
  get: <T = any>() => T;
  set: <T = any>(a: T) => void;
  update: <T = any>(f: (a: T) => T) => T,
}>('State', {
  get: func([], 'a'),
  set: func(['a']),
  update: func(['a -> a'], 'a'),
});

export function state<T = any>(initState: T, CustomState: typeof State = State) {
  let current: T = initState;

  return CustomState.handler({
    get: (o: FlowOperators) => () => o.resume(current),
    set: (o: FlowOperators) => (x: T) => o.resume(current = x),
    update: (o: FlowOperators) => (updateFn: (s: T) => T) => o.resume(current = updateFn(current)),
  });
};

export default State;
