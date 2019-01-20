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
call :: Operation (Program,...a) ()
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

