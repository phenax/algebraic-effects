# TODO

### Features & bugs
- [x] Add compose or extend functionality to effects and runners
- [x] Cant handle end state with _
- [x] Make operation handlers get resume, end, throwError as object (destructure)
- [x] Allow calling generators from within effects
- [x] Add ability to cancel a runner
- [x] Add type signature checks
- [x] Custom global operations
- [ ] ?From regular function with exceptions to program
- [ ] Map/Over method for State effect

- Add more effect classes ...
  - [ ] Console
  - [ ] Fetch
  - [ ] Random Number
  - [ ] ?Storage (key value)
  - [ ] ?Something for dom
  - [ ] ?Location
  - [ ] ?... other browser apis

- Improve effect and handler composition ...
  - [x] Add name to runner to identify which Effects were composed

- Running programs inside programs
  - [x] Race between programs
  - [ ] Parallel execution of programs

- [ ] ?Use something lazy instead of promises (Like Async)

### Documentations
- [ ] Explain motivation and inspiration
- [ ] Custom global operations
- [ ] Cancellation
- [ ] Call, Race, etc global operations
