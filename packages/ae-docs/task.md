
# Task monad
A lightweight asynchronous and lazy task monad. Running an effectful program returns an instance of a Task


Import it as
```js
import Task from '@algebraic-effects/task';
import { race, parallel, bimap, fork } from '@algebraic-effects/task/fns'; // Helper functions. Also includes point-free alternatives for Task#method
```

## API

### Task constructor
You can pass it the initial state for your program and run it.
```haskell
Task :: (e -> (), a -> ()) -> Task e a
```

```js
const waitASec = Task((reject, resolve) => setTimeout(resolve, 1000));
```

### Static methods

* `Task.of`, `Task.Resolved`
`Task.of` is an alias for `Task.Resolved` which creates a resolved task with the given value.
```haskell
Task.of :: a -> Task.Resolved a
Task.Resolved :: a -> Task.Resolved a
```

* `Task.Rejected`
`Task.Rejected` creates a rejected/failed task with the given value.
```haskell
Task.Rejected :: e -> Task.Rejected e
```

* `Task.Empty`
`Task.Empty` creates a task which will never resolve or get rejected. You can call `rejectWith` or `resolveWith` methods on the task instance to make the task reject or resolve.
```haskell
Task.Empty :: () -> Task.Empty
```

* `Task.fromPromise`
`Task.empty` creates a task which will never resolve or get rejected. You can call `rejectWith` or `resolveWith` methods on the task instance to make the task reject or resolve.
```haskell
Task.fromPromise :: (() -> Promise e a) -> Task e a
```

```js
Task.fromPromise(() => fetch('/api').then(r => r.json()));
```

You can also pass it an async function as it returns a promise.
```js
Task.fromPromise(async function() {
  const response = await fetch('/api');
  return response.json();
})
```


### Instance methods

* `fork`
`fork` is the function that runs your task and allows to to handle to result of execution. `Task` is lazy so you can compose your functions and it will only execute the chain when this method is called. When you call this method, you will recieve a cancel function in return. Calling this function will cancel your task.
```haskell
(Task e a).fork :: (e -> (), a -> ()) -> CancelFunction
```
```js
const cancelTimeout = Task((_, resolve) => setTimeout(() => resolve(10), 1000))
  .fork(handleError, console.log); // Will log 10 to console

// Call cancelTimeout() will prevent the console.log
```


* `map`
`map` method allows you to map over a value in the `Task` i.e. transform the resolved value inside the task
```haskell
(Task e a).map :: (a -> b) -> Task e b
```
```js
Task.of(10)
  .map(x => x + 1)
  .fork(handleError, console.log); // Will log 11 to console
```


* `mapRejected`
`mapRejected` method allows you to map over a the rejected value in the `Task`. So it will only map over e and ignore resolved values.
```haskell
(Task e a).mapRejected :: (a -> b) -> Task e b
```
```js
Task.Rejected('Something went wrong')
  .mapRejected(e => `ERROR: ${e}`)
  .fork(console.error, handleSuccess); // Will log error "ERROR: Something went wrong"
```


* `chain`
`chain` method allows you to map over a value in the `Task` with a function that returns another task and merges the nested tasks. It behaves similar to how flatMap behaves with arrays.
```haskell
(Task e a).chain :: (a -> Task e' b) -> Task (e|e') b
```
```js
Task.of(10)
  .chain(x => Task((_, resolve) => setTimeout(() => resolve(x + 1), 1000)))
  .fork(handleError, console.log); // Will log 11 to console after 1 second
```


* `bimap`
Where with `map` you can only map over a resolved value in a Task, `bimap` allows you to map over the resolved and the rejected value.
```haskell
(Task e a).bimap :: (e -> e', a -> a') -> Task e' a'
```
```js
someTask
  .bimap(e => `${e} - Something went wrong`, x => x + 1)
  .fork(handleError, handleSuccess);
```


* `fold`
`fold` is similar to `bimap` with the only difference being that the resolved or rejected value is wrapped.
```haskell
(Task e a).fold :: (e -> b, a -> b) -> Task.Resolved b
```
```js
someTask
  .fold(() => 10, x => x + 10)
  .fork(() = {}, handleResult); // Handle result will get a 10 if the task is rejected, else, it will get (resolved value + 10)

someOtherTask
  .fold(Either.Left, Either.Right)
  .fork(() = {}, handleResult); // Will convert the result into an Either
```


* `resolveWith`, `rejectWith`, `empty`
These methods allow you to ignore everything that happened before it and resolve or reject with a value or just empty out the task.
```haskell
(Task e a).resolveWith :: a' -> Task.Resolved a'
(Task e a).rejectWith :: e' -> Task.Rejected e'
(Task e a).empty :: () -> Task.Empty
```

* `toPromise`
Convert the given task to a promise.
NOTE: This will immediately execute your task.
```haskell
(Task e a).toPromise :: () -> Promise e a
```
```js
someTask
  .toPromise()
  .then(handleSuccess)
  .catch(handleError);
```


### Helper functions

```js
import { rejectAfter, race, parallel } from '@algebraic-effects/task/fns';
```

* `resolveAfter`
Will resolve with a given value after a delay

```haskell
resolveAfter :: (Number, a) -> Task.Resolved a
```
```js
resolveAfter(1000, 5)
  .fork(handleError, handleSuccess);
```


* `rejectAfter`
Will reject with a given value after a delay


```haskell
rejectAfter :: (Number, e) -> Task.Rejected e
```
```js
rejectAfter(1000, 5)
  .fork(handleError, handleSuccess);
```


* `race`
Resolve or Reject with the first task tha reaches completion.

```haskell
race :: [Task e a] -> Task e a
```
```js
race([ fetchResource, rejectAfter(2000), ])
  .fork(handleError, handleSuccess);
```


* `series`
Run a given set of tasks one after the other and resolve with a list of results. Fail if one of the tasks fail.

```haskell
series :: [Task e a] -> Task e [a]
```
```js
series([ fetchResourceA, fetchResourceB,, fetchResourceC ])
  .fork(handleError, ([ a, b, c ]) => handleSuccess(a, b, c));
```


* `parallel`
Run a given set of tasks parallely. Fail if one of the tasks fail.

```haskell
parallel :: [Task e a] -> Task e [a]
```
```js
parallel([ fetchResourceA, fetchResourceB, fetchResourceC ])
  .fork(handleError, ([ a, b, c ]) => handleSuccess(a, b, c));
```


### Point free functions

```haskell
map :: (a -> b) -> Task e a -> Task e b
```
```haskell
mapRejected :: (e -> e') -> Task e a -> Task e' a
```
```haskell
bimap :: (e -> e', a -> a') -> Task e a -> Task e' a'
```
```haskell
fold :: (e -> b, a -> b) -> Task e a -> Task.Resolved b
```
```haskell
fork :: (e -> (), a -> ()) -> Task e a -> CancelFunction
```
```haskell
toPromise :: Task e a -> Promise e b
```

