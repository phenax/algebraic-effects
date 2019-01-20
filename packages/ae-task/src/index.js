
// compose :: (...Function) -> Function
const compose = (...fns) => fns.reduce((a, b) => (...args) => a(b(...args)));

// identity :: a -> a
const identity = x => x;

// Task (constructor) :: ((RejectFn, ResolveFn) -> ()) -> Task
const Task = (taskFn) => {
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
      const cleanup = taskFn(guard(onFailure), guard(onSuccess));
      return compose(globalCleanup, cleanup || identity);
    } catch(e) {
      return (guard(onFailure)(e), globalCleanup);
    }
  };

  const fold = (mapErr, mapVal) => Task((_, res) => fork(compose(res, mapErr), compose(res, mapVal)));

  const bimap = (mapErr, mapVal) => Task((rej, res) => fork(compose(rej, mapErr), compose(res, mapVal)));

  const chain = fn => Task((reject, resolve) => fork(reject, b => fn(b).fork(reject, resolve)));

  const map = fn => bimap(identity, fn);
  const mapRejected = fn => bimap(fn, identity);

  const instance = {
    fork,
    map,
    mapRejected,
    bimap,
    fold,
    chain,
    resolveWith: Task.resolved,
    rejectWith: Task.rejected,
    empty: Task.empty,
    toPromise: () => new Promise((res, rej) => fork(rej, res)),
  };

  return instance;
};

Task.empty = () => Task(() => {});
Task.resolved = data => Task((_, resolve) => resolve(data));
Task.rejected = data => Task(reject => reject(data));
Task.of = Task.resolved;
Task.fromPromise = factory => Task((rej, res) => factory().then(res).catch(rej));
Task.race = tasks => Task((rej, res) => tasks.forEach(t => t.fork(rej, res)));
// Task.parallel = tasks => Task((rej, res) => tasks.forEach(t => t.fork(rej, res)));

export default Task;
