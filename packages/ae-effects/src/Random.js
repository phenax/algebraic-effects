
import { createEffect, func } from '@algebraic-effects/core';

// Random :: Effect
const Random = createEffect('Random', {
  number: func(['?times'], 'number', { isMulti: true }),
  getInt: func(['number', 'number', '?times'], 'number', { isMulti: true }),
  fromArray: func(['array a', '?times'], 'a', { isMulti: true }),
  flipCoin: func(['?times'], 'bool', { isMulti: true }),
});

// Random.seed :: Number -> Runner Number
Random.seed = seed => {
  // random :: () -> Number
  const random = () => {
    const x = Math.sin(seed) * 10000;
    seed = seed + 1;
    return x - Math.floor(x);
  };

  // Including min and max i.e. [min, max]
  // getRandomInt :: (Number, Number) -> Number
  const getRandomInt = (min, max) => Math.floor(random() * (max - min + 1)) + min;

  // pickFromList :: [a] -> a
  const pickFromList = list => list[getRandomInt(0, list.length - 1)];

  // flipCoin :: () -> Boolean
  const flipCoin = () => !!(getRandomInt(0, 100) % 2);

  // wrapMulti :: (...a) -> FlowOperators -> (...a, ?Number) -> ()
  const wrapMulti = fn => o => function() {
    const argLength = fn.length;
    const times = typeof arguments[argLength] !== 'undefined' ? arguments[argLength] : 1;
    Array(times).fill(null).forEach(() => o.resume(fn.apply(null, arguments)));
  };

  return Random.handler({
    number: wrapMulti(random),
    getInt: wrapMulti(getRandomInt),
    fromArray: wrapMulti(pickFromList),
    flipCoin: wrapMulti(flipCoin),
  });
};

// Random.random :: Runner
Random.random = Random.seed(Math.random() * 10);

export default Random;
