import { compose, identity, constant } from '@algebraic-effects/utils';
import { fork } from './pointfree';

// Task (constructor) :: ((RejectFn, ResolveFn) -> ()) -> Task e a
const Task = (taskFn) => {

  // forkTask :: (e -> (), b -> ()) -> CancelFunction
  const forkTask = function() {
    let isCancelled = false;
    let isDone = false;
    const args = arguments;

    function parseOptions() {
      if (
        args.length === 1 && args[0] &&
        (args[0].Resolved || args[0].Rejected || args[0].Cancelled)
      ) {
        return args[0];
      }
      return { Rejected: args[0], Resolved: args[1], Cancelled: args[2] };
    }

    function guardOptns(o) {
      function guard(cb) {
        return function(a) {
          isCancelled || isDone || !cb ? null : cb(a);
          isDone = true;
        };
      }

      return { Rejected: guard(o.Rejected), Resolved: guard(o.Resolved), Cancelled: guard(o.Cancelled) };
    }

    const optns = guardOptns(parseOptions());

    const cleanup = taskFn(optns.Rejected, optns.Resolved, cancelTask);

    function cancelTask() {
      cleanup && cleanup.apply(null, arguments);
      optns.Cancelled.apply(null, arguments);
      isCancelled = true;
    }

    return cancelTask;
  };

  // fold :: (e -> b, a -> b) -> Task () b
  const fold = (mapErr, mapVal) => Task((_, res) => forkTask(compose(res, mapErr), compose(res, mapVal)));
  // foldReject :: (e -> b, a -> b) -> Task () b
  const foldReject = (mapErr, mapVal) => Task(rej => forkTask(compose(rej, mapErr), compose(rej, mapVal)));

  // bimap :: (e -> e', a -> a') -> Task e' a'
  const bimap = (mapErr, mapVal) => Task((rej, res) => forkTask(compose(rej, mapErr), compose(res, mapVal)));

  // chain :: (a -> Task a') -> Task e a'
  const chain = fn => Task((rej, res) => forkTask(rej, compose(fork(rej, res), fn)));

  return {
    fork: forkTask,
    bimap,
    fold,
    foldReject,
    chain,
    resolveWith: value => fold(constant(value), constant(value)),
    rejectWith: value => foldReject(constant(value), constant(value)),
    empty: Task.Empty,

    // map :: (a -> a') -> Task e a'
    map: fn => bimap(identity, fn),

    // mapRejected :: (e -> e') -> Task e' a
    mapRejected: fn => bimap(fn, identity),

    // toPromise :: () -> Promise e a
    toPromise: () => new Promise((res, rej) => forkTask(rej, res)),
  };
};

// Task.Empty :: () -> Task
Task.Empty = () => Task(constant(null));

// Task.Resolved :: a -> Task () a
Task.Resolved = data => Task((_, resolve) => resolve(data));

// Task.Rejected :: e -> Task e ()
Task.Rejected = data => Task(reject => reject(data));

// Task.of :: e -> Task e ()
Task.of = Task.Resolved;

// Task.fromPromise :: ((...*) -> Promise e a, ...*) -> Task e a
Task.fromPromise = function(factory) {
  return Task((rej, res) =>
    factory.apply(null, [].slice.call(arguments, 1))
      .then(res)
      .catch(rej));
};

export default Task;
