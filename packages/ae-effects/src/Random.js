
import { createEffect, func } from '@algebraic-effects/core';
import { compose } from '@algebraic-effects/utils';

// Random :: Effect
const Random = createEffect('Random', {
  number: func(['?times'], 'number', { isMulti: true }),
  getInt: func(['number', 'number', '?times'], 'number', { isMulti: true }),
  fromArray: func(['array a', '?times'], 'a', { isMulti: true }),
  flipCoin: func(['?times'], 'bool', { isMulti: true }),
});

// Random.seed :: Number -> Runner Number
Random.seed = seed => {
  const random = () => {
    const x = Math.sin(seed) * 10000;
    seed = seed + 1;
    return x - Math.floor(x);
  };

  // Including min and max i.e. [min, max]
  // getRandomInt :: (Number, Number) -> Number
  const getRandomInt = (min, max) => Math.floor(random() * (max - min + 1)) + min;

  const pickFromList = list => list[getRandomInt(0, list.length - 1)];

  const flipCoin = () => !!(getRandomInt(0, 100) % 2);

  const wrapMulti = fn => ({ resume }) => (...args) => {
    const argLength = fn.length;
    const times = typeof args[argLength] !== 'undefined' ? args[argLength] : 1;
    times <= 0 && console.log(fn, times);
    Array(times).fill(null).forEach(() => resume(fn(...args)));
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
