import { compose2, identity, constant } from '@algebraic-effects/utils';
import { fork } from './pointfree';

export interface RejectFn<E> { (e: E): any; }
export interface ResolveFn<V> { (v: V): any; }
export interface CancelFn { (...args: any[]): any; }

export interface ForkOptions<E, V> {
  Rejected?: RejectFn<E>;
  Resolved?: ResolveFn<V>;
  Cancelled?: CancelFn;
};
export type ForkFunction<E, V> =
  | ((rej?: RejectFn<E>, res?: ResolveFn<V>, c?: CancelFn) => CancelFn)
  | ((optns: ForkOptions<E, V>) => CancelFn);

export interface AlgebraicTask<E = any, V = any> {
  chain: <F = any, T = any>(fn: (v: V) => AlgebraicTask<F, T>) => AlgebraicTask<E | F, T>;

  map: <R = any>(fn: (a: V) => R) => AlgebraicTask<E, R>;
  mapRejected: <F = any>(fn: (e: E) => F) => AlgebraicTask<F, V>;
  bimap: <TE = any, TV = TE>(
    mapErr: (e: E) => TE,
    mapVal: (v: V) => TV,
  ) => AlgebraicTask<TE, TV>,

  fold: <TE = any, TV = TE>(mapErr: (e: E) => TE, mapVal: (v: V) => TV) => AlgebraicTask<void, TE | TV>;
  foldRejected: <TE = any, TV = TE>(mapErr: (e: E) => TE, mapVal: (v: V) => TV) => AlgebraicTask<TE | TV, void>;

  fork: ForkFunction<E, V>;

  resolveWith: <R = any>(value: R) => AlgebraicTask<void, R>,
  rejectWith: <F = any>(err: F) => AlgebraicTask<F, void>;
  empty: typeof Task.Empty,

  toPromise: () => Promise<V>;
};

const Task = <E = any, V = any>(
  taskFn: (
    rej: (e: E) => any,
    res: (v: V) => any,
    cancel: (...a: any[]) => any
  ) => any
): AlgebraicTask<E, V> => {
  const forkTask: AlgebraicTask<E, V>['fork'] = function() {
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

    function guardOptns(o: ForkOptions<E, V>) {
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

  const fold: AlgebraicTask<E, V>['fold'] = (mapErr, mapVal) =>
    Task((_, res) => forkTask(compose2(res, mapErr), compose2(res, mapVal)));

  const foldRejected: AlgebraicTask<E, V>['foldRejected'] = (mapErr, mapVal) =>
    Task(rej => forkTask(compose2(rej, mapErr), compose2(rej, mapVal)));

  const bimap: AlgebraicTask<E, V>['bimap'] = (mapErr, mapVal) =>
    Task((rej, res) => forkTask(compose2(rej, mapErr), compose2(res, mapVal)));

  const chain: AlgebraicTask<E, V>['chain'] = fn =>
    Task((rej, res) => forkTask(rej, compose2(fork(rej, res), fn)));

  return {
    fork: forkTask,

    chain,
    bimap,
    map: fn => bimap(identity, fn),
    mapRejected: fn => bimap(fn, identity),
    fold,
    foldRejected,

    resolveWith: value => fold(constant(value), constant(value)),
    rejectWith: err => foldRejected(constant(err), constant(err)),
    empty: Task.Empty,

    toPromise: () => new Promise((res, rej) => forkTask(rej, res)),
  };
};

// Task.Empty :: () -> Task
Task.Empty = () => Task(constant(null));

Task.Resolved = <T = any>(data: T) => Task<any, T>((_, resolve) => resolve(data));
Task.Rejected = <E = any>(err: E) => Task<E, any>(reject => reject(err));

Task.of = Task.Resolved;

Task.fromPromise = function<E, T, Args extends any[] = any[]>(
  factory: (...a: Args) => Promise<T>,
  ...args: Args
): AlgebraicTask<E, T> {
  return Task((rej, res) =>
    factory.apply(null, args)
      .then(res)
      .catch(rej));
};

export default Task;
