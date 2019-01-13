
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
import { createEffect, func } from 'algebraic-effects';
import { sleep } from 'algebraic-effects/operations';
```


#### Compose handlers
To compose handlers, you can use the `concat` method or the `composeHandlers` function.
You can also compose entire effects using `composeEffects` function which is used in a similar way.

```js
import { createEffect, composeHandlers } from 'algebraic-effects';

const ApiEffect = createEffect('ApiEffect', { search: func(['q']) });
const ConsoleEffect = createEffect('ConsoleEffect', { log: func(['...data']) });

const withApi = ApiEffect.handler({
  search: ({ resume, throwError }) => q =>
    fetch(`/search?q=${q}`).then(resume).catch(throwError),
});

const withConsole = ConsoleEffect.handler({
  log: ({ resume }) => (...data) => resume(console.log(...data)),
});

function* searchUsers(query) {
  const users = yield ApiEffect.search(query);
  yield ConsoleEffect.log('Users', users);
  yield users.map(user => user.name);
}

// Now compose the handlers as ...

const names = await withConsole.concat(withApi).run(searchUsers, 'Akshay');

// OR

const handler = withConsole.concat(withApi);
const names = await handler(searchUsers, 'Akshay');

// OR

const handler = composeHandlers(withConsole, withApi);
const names = await handler(searchUsers, 'Akshay');
```







## TODO
- [x] Add compose or extend functionality to effects and runners
- [x] Cant handler end state with _
- [x] Make operation handlers get resume, end, throwError as object (destructure)
- [x] Allow calling generators from within effects
- [x] Add ability to cancel a runner
- [x] Add type signature checks
- [x] Add import points for Exception, State, operations
- [ ] Documentation
- [ ] Add more effect classes
  - [ ] Console
  - [ ] Fetch
  - [ ] Random Number
  - [ ] ?Storage (key value)
  - [ ] ?Something for dom
  - [ ] ?Location
  - [ ] ... other browser apis
- [ ] Improve handler composition
  - [ ] Involve the effect itself in the composition
  - [ ] Add name to runner to identify which Effects were composed

- [ ] ?Move global handlers to their own meaningful effect and let people compose it themselves or make Exception effect global
