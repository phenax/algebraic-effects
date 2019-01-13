
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
```



#### Custom effect

```js
const IOEffect = createEffect('IOEffect', {
  getInput: ['label'],
  showMessage: ['type', 'data'],
});

const io = IOEffect.handler({
  getInput: resume => label => showModal({ label, onSubmit: resume }), // Some onSubmit function
  showMessage: resume => message => {
    renderMessage(message); // Some renderMessage function that renders a text
    resume();
  };
});

function* greetUser(greetText) {
  const name = yield IOEffect.getInput('What is your name?'); // Will show the modal to a user and halt the execution till the user submits their response.
  yield IOEffect.showMessage(`Hello, ${name}! ${greetText}`);
}

await io(greetUser, 'Welcome!');
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

// Now compose the handlers as ...

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



#### Custom handler for Exception effect

```js
import Exception from 'algebraic-effects/Exception';
import Either from 'crocks/Either'; // Using Either from crocks

const divide = function *(a, b) {
  if (b === 0) yield Exception.throw(new Error('Invalid operation'));
  yield a / b;
};

const toEither = Exception.handler({
  throw: (_, end) => error => end(Either.Left(error.message)),
  _: (_, end) => value => end(Either.Right(value)),
});

await toEither(divide, 5, 2); // Either.Right 2.5
await toEither(divide, 5, 0); // Either.Left 'Invalid operation'
```



## TODO
- [x] Add compose or extend functionality to effects and runners
- [ ] Allow calling generators from within effects
- [ ] Understand state effect and find how it actually works in koka
- [ ] Improve handler composition
- [ ] Add type signature checks
- [ ] Add name to runner to identify which Effects were composed
- [ ] ?Move global handlers to their own meaningful effect and let people compose it themselves
