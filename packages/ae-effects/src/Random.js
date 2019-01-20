
import { createEffect, func } from '@algebraic-effects/core';

// Including min and max i.e. [min, max]
// getRandomInt :: (Number, Number) -> Number
const getRandomInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

// Random :: Effect
const Random = createEffect('Random', {
  getInt: func(['number', 'number'], 'number'),
  fromArray: func(['array a'], 'a'),
});

// Random.effect :: Runner
Random.effect = Random.handler({
  getInt: ({ resume }) => (min, max) => resume(getRandomInt(min, max)),
  fromArray: ({ resume }) => array => resume(array[getRandomInt(0, array.length - 1)]),
});

export default Random;
