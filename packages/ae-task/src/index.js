import { compose, identity } from '@algebraic-effects/utils';

// Task (constructor) :: ((RejectFn, ResolveFn) -> ()) -> Task e a
const Task = (taskFn) => {

  // fork :: (e -> (), b -> ()) -> CancelFunction
  const fork = (onFailure, onSuccess) => {
    let isCancelled = false;
    let isDone = false;

    const guard = cb => a => {
      isCancelled || isDone ? null : cb(a);
      isDone = true;
    };

    const globalCleanup = () => (isCancelled = true);
    const cleanup = taskFn(guard(onFailure), guard(onSuccess)) || identity;

    return compose(globalCleanup, cleanup);
  };

  // fold :: (e -> b, a -> b) -> Task () b
  const fold = (mapErr, mapVal) => Task((_, res) => fork(compose(res, mapErr), compose(res, mapVal)));

  // bimap :: (e -> e', a -> a') -> Task e' a'
  const bimap = (mapErr, mapVal) => Task((rej, res) => fork(compose(rej, mapErr), compose(res, mapVal)));

  // chain :: (a -> Task a') -> Task e a'
  const chain = fn => Task((reject, resolve) => fork(reject, b => fn(b).fork(reject, resolve)));

  return {
    fork,
    bimap,
    fold,
    chain,
    resolveWith: Task.resolved,
    rejectWith: Task.rejected,
    empty: Task.empty,

    // map :: (a -> a') -> Task e a'
    map: fn => bimap(identity, fn),

    // mapRejected :: (e -> e') -> Task e' a
    mapRejected: fn => bimap(fn, identity),

    // toPromise :: () -> Promise e a
    toPromise: () => new Promise((res, rej) => fork(rej, res)),
  };
};

// Task.empty :: () -> Task
Task.empty = () => Task(() => {});

// Task.resolved :: a -> Task () a
Task.resolved = data => Task((_, resolve) => resolve(data));

// Task.rejected :: e -> Task e ()
Task.rejected = data => Task(reject => reject(data));

// Task.of :: e -> Task e ()
Task.of = Task.resolved;

// Task.fromPromise :: (() -> Promise e a) -> Task e a
Task.fromPromise = factory => Task((rej, res) => factory().then(res).catch(rej));

export default Task;
