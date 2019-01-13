
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



#### Create your own Effect for I/O
In the example below, we have created a I/O effect with the operations `getInput` and `showMessage`. The behavior of those operations are not defined with the type as this just acts as the interface marking control flow to the actual effect.

You can write your program without worrying about the behavior of those effects.

You can then call the `handler` method to attach behavior/control flow to the operations.

```js
const IOEffect = createEffect('IOEffect', {
  getInput: ['label'],
  showMessage: ['type', 'data'],
});

// greetUser :: Program (String) IOEffect
function* greetUser(greetText) {
  const name = yield IOEffect.getInput('What is your name?'); // Will show the modal to a user and halt the execution till the user submits their response.
  yield IOEffect.showMessage(`Hello, ${name}! ${greetText}`);
}

// io :: Runner
const io = IOEffect.handler({
  // Some showModal function that accepts an onSubmit callback
  getInput: ({ resume }) => label => showModal({ label, onSubmit: resume }),
  showMessage: ({ resume }) => message => {
    // Some renderMessage function that renders a text
    renderMessage(message);
    resume();
  };
});

io(greetUser, 'Welcome!');
// Shows a modal with the text "What is your name?" and an input form.
// When you click on the submit, it renders a message that reads. "Hello Akshay! Welcome!"
```



#### Compose handlers
To compose handlers, you can use the `concat` method or the `composeHandlers` function.
You can also compose entire effects using `composeEffects` function which is used in a similar way.

```js
import { createEffect, composeHandlers } from 'algebraic-effects';

const ApiEff = createEffect('ApiEff', { search: ['q'] });
const ConsoleEff = createEffect('ConsoleEff', { log: [] });

const api = ApiEff.handler({
  search: ({ resume, throwError }) => q =>
    fetch(`/search?q=${q}`).then(resume).catch(throwError),
});

const konsole = ConsoleEffect.handler({
  log: ({ resume }) => (label, data) => {
    console.log(data);
    resume(data); // Return data
  },
});

function* searchUsers(query) {
  const users = yield ApiEff.search(query);
  yield ConsoleEff.log('Users', users);
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


#### Using State effect
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


#### Composing with State effect
You can compose State effect with custom effects to make a really cool api

```js
import { createEffect } from 'algebraic-effects';
import State from 'algebraic-effects/State';
import { call, sleep } from 'algebraic-effects/operations';

const CounterButtonEff = createEffect('CounterButtonEff', {
  takeButtonClick: [],
});

const ConsoleEff = createEffect('ConsoleEff', {
  log: ['data'],
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
  .run(clickCounter)
  .then(() => alert('HAPPY NEW YEAR!!!!'));
```



#### Using Exception effect
You can use the Exception effect to handle error flows in your application. This gives you more control of the flow of the program than the traditional throw with `try/catch`.

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



#### Custom handler for Exception effect (toEither)

```js
import Exception from 'algebraic-effects/Exception';
import Either from 'crocks/Either'; // Using Either from crocks

// divide :: Program (Number, Number) Excecption Number
const divide = function *(a, b) {
  if (b === 0) yield Exception.throw(new Error('Invalid operation'));
  yield a / b;
};

// toEither :: (Program (...a) (Exception b), ...a) -> Promise (Either Error b)
const toEither = Exception.handler({
  throw: ({ end }) => error => end(Either.Left(error.message)),
  _: ({ end }) => value => end(Either.Right(value)),
});

await toEither(divide, 5, 2); // Either.Right 2.5
await toEither(divide, 5, 0); // Either.Left 'Invalid operation'
```



## TODO
- [x] Add compose or extend functionality to effects and runners
- [x] Cant handler end state with _
- [x] Make operation handlers get resume, end, throwError as object (destructure)
- [x] Allow calling generators from within effects
- [x] Add ability to cancel a runner
- [ ] Add type signature checks
- [ ] Improve handler composition
  - [ ] Involve the effect itself in the composition
  - [ ] Add name to runner to identify which Effects were composed

- [ ] ?Move global handlers to their own meaningful effect and let people compose it themselves or make Exception effect global
