import { compose2, identity, constant } from '@algebraic-effects/utils';
import { fork } from './pointfree';

// type AlgebraicTask = ()

const Task = <E = any, V = any>(
  taskFn: (
    rej: (e: E) => any,
    res: (v: V) => any,
    cancel: (...a: any[]) => any
  ) => any
) => {
  type RejectFn = (e: E) => any;
  type ResolveFn = (v: V) => any;
  type CancelFn = (...args: any[]) => any;

  type ForkOptions = { Rejected?: RejectFn, Resolved?: ResolveFn, Cancelled?: CancelFn };
  type ForkFunction =
    | ((rej: RejectFn, res: ResolveFn, c?: CancelFn) => CancelFn)
    | ((optns: ForkOptions) => CancelFn);

  const forkTask: ForkFunction = function() {
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

    function guardOptns(o: ForkOptions) {
      function guard(cb?: (...x: any[]) => any) {
        return function(...a: any[]) {
          isCancelled || isDone || !cb ? null : cb(...a);
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

  const fold = <TE = any, TV = TE>(
    mapErr: (e: E) => TE,
    mapVal: (v: V) => TV,
  ) => Task((_, res) => forkTask(compose2(res, mapErr), compose2(res, mapVal)));

  const foldRejected = <TE = any, TV = TE>(
    mapErr: (e: E) => TE,
    mapVal: (v: V) => TV,
  ) => Task(rej => forkTask(compose2(rej, mapErr), compose2(rej, mapVal)));

  const bimap = <TE = any, TV = TE>(
    mapErr: (e: E) => TE,
    mapVal: (v: V) => TV,
  ) => Task((rej, res) => forkTask(compose2(rej, mapErr), compose2(res, mapVal)));

  const chain = <T = any>(fn: (v: V) => Task<E, T>) =>
    Task((rej, res) => forkTask(rej, compose2(fork(rej, res), fn)));

  return {
    fork: forkTask,
    bimap,
    fold,
    foldRejected,
    chain,
    resolveWith: <R = any>(value: R): Task<void, R> => fold(constant(value), constant(value)),
    rejectWith: <F = any>(err: F): Task<F, void> => foldRejected(constant(err), constant(err)),
    empty: Task.Empty,

    map: <R = any>(fn: (a: V) => R): Task<E, R> => bimap(identity, fn),

    mapRejected: <F = any>(fn: (e: E) => F): Task<F, V> => bimap(fn, identity),

    toPromise: (): Promise<V> => new Promise((res, rej) => forkTask(rej, res)),
  };
};

// Task.Empty :: () -> Task
Task.Empty = () => Task(constant(null));

Task.Resolved = <T = any>(data: T) => Task<void, T>((_, resolve) => resolve(data));
Task.Rejected = <E = any>(err: E) => Task<E, void>(reject => reject(err));

Task.of = Task.Resolved;

Task.fromPromise = function<E, T>(factory: (...a: any[]) => Promise<T>): Task<E, T> {
  const args = arguments;

  return Task((rej, res) =>
    factory.apply(null, [].slice.call(args, 1))
      .then(res)
      .catch(rej));
};

export default Task;
