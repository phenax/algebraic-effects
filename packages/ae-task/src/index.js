
// compose :: (...Function) -> Function
export const compose = (...fns) => fns.reduce((a, b) => (...args) => a(b(...args)));

const Task = (taskFn) => {
  let isCancelled = false;
  const guard = cb => a => isCancelled ? null : cb(a);
  const globalCleanup = () => (isCancelled = true);

  const fork = (onFailure, onSuccess) => {
    const reject = guard(onFailure);
    const resolve = guard(onSuccess);

    try {
      const cleanup = taskFn(reject, resolve) || globalCleanup;
      return (...args) => {
        globalCleanup();
        return cleanup(...args);
      };
    } catch(e) {
      return (reject(e), globalCleanup);
    }
  };

  const bimap = (mapErr, mapVal) =>
    Task((rej, res) => fork(compose(rej, mapErr), compose(res, mapVal)));

  const map = fn =>
    Task((reject, resolve) => fork(reject, compose(resolve, fn)));

  const chain = fn =>
    Task((reject, resolve) => fork(reject, b => fn(b).fork(reject, resolve)));

  const instance = {
    fork,
    map,
    bimap,
    chain,
    resolveWith: Task.resolve,
    rejectWith: Task.reject,
  };

  return instance;
};

Task.resolve = data => Task((_, resolve) => resolve(data));
Task.reject = data => Task(reject => reject(data));
Task.of = Task.resolve;

export default Task;
