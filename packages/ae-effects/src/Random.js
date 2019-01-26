
import { createEffect, func } from '@algebraic-effects/core';
import { compose } from '@algebraic-effects/utils';

// Random :: Effect
const Random = createEffect('Random', {
  number: func([], 'number'),
  getInt: func(['number', 'number'], 'number'),
  fromArray: func(['array a'], 'a'),
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

  return Random.handler({
    number: ({ resume }) => compose(resume, random),
    getInt: ({ resume }) => compose(resume, getRandomInt),
    fromArray: ({ resume }) => array => resume(array[getRandomInt(0, array.length - 1)]),
  });
};

// Random.random :: Runner
Random.random = Random.seed(Math.random() * 10);

export default Random;
