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
- [x] Change package name to @algebraic-effects scope
- [x] Migrate to yarn workspaces
- [x] Move static functions of Tasks out to a another entry point
- [x] Use something lazy instead of promises (Like Async) or something custom to allow chaing programs and pure operations with an api similar to Async.
- [x] Prevent operation name collisions with effect namespace
- [x] Clone/Extend effect interface with new name.
- [ ] Stateful/parameterized states (to avoid the second parameter to .of method of State)
- [ ] ?Multiple continuations

**Add more effect classes ...**
  - [x] Exception
  - [x] State
  - [x] Random Number
  - [ ] Console

**Running programs inside programs**
  - [x] Synchronously call program
  - [x] Race between programs
  - [x] Parallel execution of programs
  - [x] Run program in background

### Documentation
- [x] Call, Race, etc global operations
- [x] Task monad
- [x] Migrate all doc to use Task
- [x] State effect update operation
- [x] Random effect
- [x] All flow operators
- [x] Cancellation
- [x] FAQ
- [x] Clone/Extend
- [ ] Parameterized custom effects (like State)
- [ ] Custom global operations
- [ ] All links to next document below for readers to continue reeading
- [ ] Explain motivation and inspiration

### Scripts and doc builder
- [x] Version upgrade in publish script should upgrade matching dependencies as well
- [x] Build and publish ae-docs as html github pages. (Maybe mdx?)
- [ ] Docs issue with scrolling to link hook. (Should attempt scrolling after page load)
