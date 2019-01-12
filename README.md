
# Algebraic Effects
Algebraic effects in javascript using generators

<!-- [![CircleCI](https://img.shields.io/circleci/project/github/phenax/algebraic-effects/master.svg?style=for-the-badge)](https://circleci.com/gh/phenax/algebraic-effects) -->
<!-- [![npm bundle size (minified + gzip)](https://img.shields.io/bundlephobia/minzip/algebraic-effects.svg?style=for-the-badge)](https://www.npmjs.com/package/algebraic-effects) -->
<!-- [![Codecov](https://img.shields.io/codecov/c/github/phenax/algebraic-effects.svg?style=for-the-badge)](https://codecov.io/gh/phenax/algebraic-effects) -->


[Read the documentation for more information](https://github.com/phenax/algebraic-effects/tree/master/docs)

## Install

#### To add the project to your project
```bash
yarn add algebraic-effects
```

## Usage

#### Import it to your file
```js
import { createEffect } from 'algebraic-effects';
import { sleep } from 'algebraic-effects/operations';
import Exception from 'algebraic-effects/Exception';
```

#### Custom effect

```js
const ApiEffect = createEffect('ApiEffect', {
  search: ['q'],
});

const api = ApiEffect.handler({
  search: (resume, _, throwE) => q => fetch(`/search?q=${q}`).then(resume).catch(throwE),
});

function* searchUsers(query) {
  const users = yield ApiEffect.search(query);
  yield users.map(user => user.name);
}

const names = await api(searchUsers, 'Akshay');
```



#### Compose handlers

```js
import { createEffect, composeHandlers } from 'algebraic-effects';

const ApiEff = createEffect('ApiEff', { search: ['q'] });
const ConsoleEff = createEffect('ConsoleEff', { log: [] });

const api = ApiEff.handler({
  search: (resume, _, throwE) => q => fetch(`/search?q=${q}`).then(resume).catch(throwE),
});

const konsole = ConsoleEffect.handler({
  log: resume => (label, data) => {
    console.log(data);
    resume(data); // Return data
  },
});

function* searchUsers(query) {
  const users = yield ApiEff.search(query);
  ConsoleEff.log('Users', users);
  yield users.map(user => user.name);
}

const names = await konsole.concat(api).run(searchUsers, 'Akshay');

// OR

const handler = konsole.concat(api);
const names = await handler(searchUsers, 'Akshay');

// OR

const handler = composeHandlers(konsole, api);
const names = await handler(searchUsers, 'Akshay');
```



#### Using Exception effect

```js
import Exception from 'algebraic-effects/Exception';

const divide = function *(a, b) {
  if (b === 0) yield Exception.throw(new Error('Invalid operation'));
  yield a / b;
};

Exception.try(divide, 5, 2)
  .then(result => console.log('5 / 2 ===', result));

Exception.try(divide, 5, 0)
  .catch(e => console.error(e));
```

Custom handler for exceptions
```js
import Exception from 'algebraic-effects/Exception';

const divide = function *(a, b) {
  if (b === 0) yield Exception.throw(new Error('Invalid operation'));
  yield a / b;
};

const myTry = Exception.handler({
  throw: (resume, end, throwError) => error => end({ error }),
  _: (_, end) => value => end({ value }),
});

const { value, error } = await myTry(divide, 5, 2);
```


## TODO
- [x] Add compose or extend functionality to effects and runners
- [ ] Move global handlers to their own meaningful effect and let people compose it themselves
