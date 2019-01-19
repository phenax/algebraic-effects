
# State Effect
State effect allows you to maintain state accross multiple calls to your program.


## API

### Functions

* `State.of`
You can pass it the initial state for your program and run it.
```haskell
State.of :: a -> (Program<State> ...b c, ...b) -> Promise c
```


## Usage examples

### Using State effect
State effect allows you to maintain state in your program accross multiple calls.

```js
import State from 'algebraic-effects/State';
import { call, sleep } from 'algebraic-effects/operations';

const countdown = function*() {
  const count = yield State.get();

  if(count > 0) {
    yield State.set(count - 1); // Decrement count
    yield sleep(1000); // Add a delay of 1 second
    yield call(countdown); // Call the function recursively
  }
}

State.of(10)(countdown)
  .then(() => alert('HAPPY NEW YEAR!!!!'));
```


### Composing with State effect
You can compose State effect with custom effects to make a really cool api

```js
import { createEffect } from 'algebraic-effects';
import State from 'algebraic-effects/State';
import { call, sleep } from 'algebraic-effects/operations';

const CounterButtonEff = createEffect('CounterButtonEff', {
  takeButtonClick: func(),
});

const ConsoleEff = createEffect('ConsoleEff', {
  log: func(['data']),
});

const clickCounter = function*() {
  yield CounterButtonEff.takeButtonClick();

  const count = yield State.get();
  yield State.set(count + 1);

  yield ConsoleEff.log(`Button clicked ${count} times!`);

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
  .concat(buttonEff)
  .concat(logEff)
  .run(clickCounter);
```

