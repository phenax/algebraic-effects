
// compose :: (...Function) -> Function
const compose = (...fns) => fns.reduce((a, b) => (...args) => a(b(...args)));

// identity :: a -> a
const identity = x => x;

// Task (constructor) :: ((RejectFn, ResolveFn) -> ()) -> Task e a
const Task = (taskFn) => {

  // fork :: (e -> (), b -> ()) -> CancelFunction
  const fork = (onFailure, onSuccess) => {
    let isCancelled = false;
    let isDone = false;

    const guard = cb => a => {
      const result = isCancelled || isDone ? null : cb(a);
      isDone = true;
      return result;
    };

    const globalCleanup = () => (isCancelled = true);

    try {
      const cleanup = taskFn(guard(onFailure), guard(onSuccess)) || identity;
      return compose(globalCleanup, cleanup);
    } catch(e) {
      return (guard(onFailure)(e), globalCleanup);
    }
  };

  // fold :: (e -> b, a -> b) -> Task () b
  const fold = (mapErr, mapVal) => Task((_, res) => fork(compose(res, mapErr), compose(res, mapVal)));

  // bimap :: (e -> e', a -> a') -> Task e' a'
  const bimap = (mapErr, mapVal) => Task((rej, res) => fork(compose(rej, mapErr), compose(res, mapVal)));

  // chain :: (a -> Task a') -> Task e a'
  const chain = fn => Task((reject, resolve) => fork(reject, b => fn(b).fork(reject, resolve)));

  // map :: (a -> a') -> Task e a'
  const map = fn => bimap(identity, fn);

  // mapRejected :: (e -> e') -> Task e' a
  const mapRejected = fn => bimap(fn, identity);

  return {
    fork,
    map,
    mapRejected,
    bimap,
    fold,
    chain,
    resolveWith: Task.resolved,
    rejectWith: Task.rejected,
    empty: Task.empty,

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

// Task.race :: [Task e a] -> Task e a
Task.race = tasks => Task((rej, res) => tasks.forEach(t => t.fork(rej, res)));

// Task.parallel = tasks => Task((rej, res) => tasks.reduce(() => t.fork(rej, res)));

export default Task;
