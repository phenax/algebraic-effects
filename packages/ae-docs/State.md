
# State Effect
State effect allows you to maintain state accross multiple calls to your program.


## API

### Functions

* `State.of`
You can pass it the initial state for your program and run it.
```haskell
State.of :: a -> (Program<State> ...b c, ...b) -> Task e c
```

### Operations
```js
State = {
  get: func([], 'a'),
  set: func(['a']),
  update: func(['a -> a'], 'a'),
}
```

## Usage examples

### Using State effect
State effect allows you to maintain state in your program accross multiple calls.

```js
import { State } from '@algebraic-effects/effects';
import { call, sleep } from '@algebraic-effects/core/operations';

const countdown = function*() {
  const count = yield State.get();

  if(count > 0) {
    yield State.set(count - 1); // Decrement count
    yield sleep(1000); // Add a delay of 1 second
    yield call(countdown); // Call the function recursively
  }
}

State.of(10)(countdown)
  .fork(() => {}, () => alert('HAPPY NEW YEAR!!!!'));
```


### Composing with State effect
You can compose State effect with custom effects to make a really cool api

```js
import { createEffect } from '@algebraic-effects/core';
import { State } from '@algebraic-effects/effects';
import { call, sleep } from '@algebraic-effects/core/operations';

const CounterButtonEff = createEffect('CounterButtonEff', {
  takeButtonClick: func(),
});

const ConsoleEff = createEffect('ConsoleEff', {
  log: func(['data']),
});

const clickCounter = function*() {
  yield CounterButtonEff.takeButtonClick();
  yield State.update(count => count + 1); // Update the state

  yield ConsoleEff.log(`Button clicked ${yield State.get()} times!`);

  yield call(clickCounter);
}

const buttonEff = CounterButtonEff.handler({
  takeButtonClick: ({ resume }) => () =>
    document.getElementById('button').addEventListener('click', resume),
});
const logEff = ConsoleEff.handler({
  log: ({ resume }) => data => resume(console.log(data)),
}),

State.of(0)
  .with(buttonEff)
  .with(logEff)
  .run(clickCounter);
```
