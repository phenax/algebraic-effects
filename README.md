
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

#### Reference
* [Docs](https://github.com/phenax/algebraic-effects/tree/master/docs)
* [Familiarize yourself with the lingo of the cool kids](https://github.com/phenax/algebraic-effects/tree/master/docs/lingo.md)
* [Have a look at the core modules](https://github.com/phenax/algebraic-effects/tree/master/docs/core.md)
* [Global operations](https://github.com/phenax/algebraic-effects/tree/master/docs/operations.md)
* [State effect](https://github.com/phenax/algebraic-effects/tree/master/docs/State.md)
* [Exception effect](https://github.com/phenax/algebraic-effects/tree/master/docs/Exception.md)



## TODO
- [x] Add compose or extend functionality to effects and runners
- [x] Cant handle end state with _
- [x] Make operation handlers get resume, end, throwError as object (destructure)
- [x] Allow calling generators from within effects
- [x] Add ability to cancel a runner
- [x] Add type signature checks
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
  - [ ] Operation collisions workaround
  - [ ] Involve the effect itself in the composition
  - [ ] Add name to runner to identify which Effects were composed

- [ ] ?Move global handlers to their own meaningful effect and let people compose it themselves or make Exception effect global
