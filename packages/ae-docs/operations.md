# Operations

Most operations are grouped inside effects but there are a few global operations that can be invoked by any program.


### sleep
Sleep operation allows you to put add delay to your program.

```haskell
sleep :: Operation (Number) () 
```

```js
import { sleep } from '@algebraic-effects/core/operations';

// Program that returns 5 after 1 second
const program = function*() {
  yield sleep(1000);
  yield 5;
};
```


### call
Call another program from within your program with the same effects

```haskell
call :: Operation (Program ...a b,...a) b
```

```js
import { sleep, call } from '@algebraic-effects/core/operations';

// Program that logs `Hello ${n}` every 1 second
const program = function*(count) {
  yield sleep(1000);
  yield ConsoleEffect.log('Hello', count);
  yield call(program, count - 1);
};
```


### background
Call another program from within your program with the same effects in the background.

```haskell
background :: Operation (Program ...a b,...a) CancelFunction
```

```js
import { sleep, background } from '@algebraic-effects/core/operations';

// waitFor n seconds and log the duration to console
const waitFor = function*(delay) {
  yield sleep(delay);
  yield ConsoleEffect.log(delay);
}

// Program will log in the following sequence
// >> 'Start', 31, 'Synchronous', 'Running in background', 32, 33
const program = function*() {
  yield ConsoleEffect.log('Start');
  yield call(waitFor, 31);
  yield ConsoleEffect.log('Synchronous');
  yield background(waitFor, 32);
  yield ConsoleEffect.log('Running in background');
  yield call(waitFor, 33);
};
```



### race
Call multiple programs at the same time and yields out with the first one that completes.

```haskell
race :: Operation [Program () b] b
```

```js
import { sleep, race } from '@algebraic-effects/core/operations';

function* programA() {
  yield sleep(100);
  return 'A';
}
function* programB(key) {
  yield sleep(50);
  return `B-${key}`;
}

// Program will resolve with `B-wow wins` as programB has a shorter delay and returns earlier
function* myProgramRace() {
  // You can pass in the generator or the return value of a generator call (iterator instance)
  const winner = yield race([ programA, programB('wow') ]);
  return `${winner} wins`;
}
```


### parallel
Call multiple programs at the same time and waits for each one of them to complete before moving forward.

```haskell
parallel :: Operation [Program () b] b
```

```js
import { sleep, parallel } from '@algebraic-effects/core/operations';

function* programA() {
  yield sleep(100);
  return 'A';
}
function* programB() {
  yield sleep(50);
  return `B`;
}

// Program will resolve with ['A', 'B']
function* program() {
  return yield parallel([ programA, programB ]);
}
```



### awaitPromise
Wait a promise to resolve from your program.
NOTE: In most cases you should be able to avoid this as most promise returning functions can be classified as a type of effect.

```haskell
awaitPromise :: Operation (Promise a) a
```

```js
import { awaitPromise } from '@algebraic-effects/core/operations';

// Program that calls your api and logs it to console
const program = function*() {
  const response = yield awaitPromise(fetch('/api'));
  const json = awaitPromise(response.json());
  yield ConsoleEffect.log(json);
  yield json;
}
```
