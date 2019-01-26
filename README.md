
# Algebraic Effects
Algebraic effects in javascript using generators inspired by [koka](https://github.com/koka-lang/koka)

<!-- [![CircleCI](https://img.shields.io/circleci/project/github/phenax/algebraic-effects/master.svg?style=for-the-badge)](https://circleci.com/gh/phenax/algebraic-effects) -->
[![npm bundle size (minified + gzip)](https://img.shields.io/bundlephobia/minzip/algebraic-effects.svg?style=for-the-badge)](https://www.npmjs.com/package/algebraic-effects)
<!-- [![Codecov](https://img.shields.io/codecov/c/github/phenax/algebraic-effects.svg?style=for-the-badge)](https://codecov.io/gh/phenax/algebraic-effects) -->


[Read the documentation for more information](https://github.com/phenax/algebraic-effects/tree/master/packages/ae-docs)


## Install

### To add the project to your project
```bash
yarn add @algebraic-effects/core
```

If you want effects like Exception, State, Random, etc.
```bash
yarn add @algebraic-effects/core @algebraic-effects/effects
```


## Docs
* [Gettting started](https://github.com/phenax/algebraic-effects/tree/master/packages/ae-docs)
* [Familiarize yourself with the lingo of the cool kids](https://github.com/phenax/algebraic-effects/tree/master/packages/ae-docs/lingo.md)
* [Have a look at the core modules](https://github.com/phenax/algebraic-effects/tree/master/packages/ae-docs/core.md)
* [Global operations](https://github.com/phenax/algebraic-effects/tree/master/packages/ae-docs/operations.md)
* [State effect](https://github.com/phenax/algebraic-effects/tree/master/packages/ae-docs/State.md)
* [Exception effect](https://github.com/phenax/algebraic-effects/tree/master/packages/ae-docs/Exception.md)


## Usage


### Import it to your file
```js
import { createEffect, func } from '@algebraic-effects/core';
import { sleep } from '@algebraic-effects/core/operations';
```


### Simple state effect example

```js
import { State } from '@algebraic-effects/effects';
import { call, sleep } from '@algebraic-effects/core/operations';

const countdown = function*() {
  const count = yield State.get();

  if(count > 0) {
    yield State.set(count - 1); // Decrement count
    yield sleep(1000); // Add a delay of 1 second
    yield call(countdown); // Recursively call the program again.
  }
}

State.of(10)(countdown)
  .fork(() => {}, () => alert('HAPPY NEW YEAR!!!!'));
```


### Creating your own effects

* Declare your effects
```js
import { createEffect, func } from '@algebraic-effects/core';

export const ConsoleEffect = createEffect('ConsoleEffect', {
  log: func(['...data']),
});

export const ApiEffect = createEffect('ApiEffect', {
  fetchUser: func(['userid'], 'user'),
  markUserAsViewed: func(['userid']),
});
```
`func` function allows you to document the operation signature.



* Write your program
```js
const fetchProfile = function*(uid) {
  const user = yield ApiEffect.fetchUser(uid);

  yield ConsoleEffect.log('>> Fetched user user', uid);

  if(user.isPublic) {
    yield ApiEffect.markUserAsViewed(user.id);
    yield ConsoleEffect.log('>> Marked', uid, 'as viewed');
    return user;
  }

  return { id: uid, name: user.name, isPrivate: true };
}
```


* Implement effect operation behavior
```js
const logger = ConsoleEffect.handler({
  log: ({ resume }) => (...args) => {
    console.log(...args);
    resume();
  },
});

const api = ApiEffect.handler({
  markUserAsViewed: ({ resume, throwError }) =>
    uid => fetchJson(`/user/${uid}/mark-as-viewed`).then(() => resume()).catch(throwError),
  fetchUser: ({ promise }) => uid => promise(fetchJson(`/user/${uid}`)),
});
```
`promise` is a shorthand for doing `.then(resume).catch(throwError)`


* Calling your program
```js
api.with(logger) // Compose your effect handlers togather and run them
  .run(fetchProfile)
  .fork(handleError, user => {
    // You've got the user now
  })
```

