# TODO

### Features & bugs
- [x] Add compose or extend functionality to effects and runners
- [x] Cant handle end state with _
- [x] Make operation handlers get resume, end, throwError as object (destructure)
- [x] Allow calling generators from within effects
- [x] Add ability to cancel a runner
- [x] Add type signature checks
- [x] Custom global operations
- [x] Add name to runner to identify which Effects were composed
- [x] Map/Over method for State effect
- [ ] Change package name to @algebraic-effects scope
- [ ] Migrate to yarn workspaces
- [ ] ?Use something lazy instead of promises (Like Async) or something custom to allow chaing programs and pure operations with an api similar to Async.

- Add more effect classes ...
  - [x] Random Number
  - [ ] Console
  - [ ] Fetch
  - [ ] ?Storage (key value)
  - [ ] ?Something for dom
  - [ ] ?Location
  - [ ] ?... other browser apis

- Running programs inside programs
  - [x] Synchronously call program
  - [x] Race between programs
  - [x] Parallel execution of programs
  - [x] Run program in background

### Documentations
- [ ] Explain motivation and inspiration
- [ ] Custom global operations
- [ ] Cancellation
- [ ] Call, Race, etc global operations
- [ ] State effect update operation
- [ ] Random effect
- [ ] All flow operators

### Scripts
- [x] Version upgrade in publish script should upgrade matching dependencies as well
