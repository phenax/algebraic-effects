import { compose2, identity, constant } from '@algebraic-effects/utils';
// import { fork } from './pointfree';

export interface Subscription<E = any, V = any> {
  readonly isCancelled: boolean;
  next: (v: V) => any;
  throwError: (e: E) => any;
  complete: (d?: any) => any;
  unsubscribe: UnsubscribeFn;
}

export interface ErrorFn<E> { (e: E): any; }
export interface NextFn<V> { (v: V): any; }
export interface CompleteFn<Data = any, E = any, V = any> { (sub: Subscription<E, V>, d?: Data): any; };
export interface UnsubscribeFn { (...a: any): any; };

export interface SubscribeOptions<E, V> {
  onError: ErrorFn<E>;
  onNext: NextFn<V>;
  onComplete: CompleteFn<any, E, V>;
};
export type SubscribeFunction<E, V> = (optns: Partial<SubscribeOptions<E, V>>) => UnsubscribeFn|any;

export interface ObservableInstance<E = any, V = any> {
  // chain: <F = any, T = any>(fn: (v: V) => AlgebraicTask<F, T>) => AlgebraicTask<E | F, T>;

  map: <R = any>(fn: (a: V) => R) => ObservableInstance<E, R>;

  fold: <TE = any, TV = TE>(mapErr: (e: E) => TE, mapVal: (v: V) => TV) => ObservableInstance<void, TE | TV>;

  subscribe: SubscribeFunction<E, V>;

  // resolveWith: <R = any>(value: R) => AlgebraicTask<void, R>,
  // rejectWith: <F = any>(err: F) => AlgebraicTask<F, void>;
  // empty: typeof Observable.Empty,

  // toPromise: () => Promise<V>;
};

const Observable = <E = any, V = any>(
  taskFn: (subscription: Subscription) => any
): ObservableInstance<E, V> => {
  const subscribe: ObservableInstance<E, V>['subscribe'] = function(options) {
    let isCancelled = false;
    let isComplete = false;

    const parseOptions = identity;

    function guardOptns(o: Partial<SubscribeOptions<E, V>>): SubscribeOptions<E, V> {
      function guard(cb?: (...x: any[]) => any) {
        return (...a: any[]) => isCancelled || isComplete || !cb ? null : cb(...a);
      }

      return { onError: guard(o.onError), onNext: guard(o.onNext), onComplete: guard(o.onComplete) };
    }

    const optns = guardOptns(parseOptions(options));

    const subscription: Subscription<E, V> = {
      get isCancelled() { return isCancelled; },
      unsubscribe: () => {}, // This gets overwritten after fn returns
      next: optns.onNext,
      throwError: optns.onError,
      complete: (value: any) => {
        optns.onComplete(subscription, value);
        isComplete = true;
      },
    };

    const cleanup = taskFn(subscription);

    function cancelTask() {
      cleanup && cleanup.apply(null, arguments);
      optns.onComplete.apply(null, arguments);
      isCancelled = true;
    }

    subscription.unsubscribe = cancelTask;

    return subscription;
  };

  // const foldRejected: AlgebraicTask<E, V>['foldRejected'] = (mapErr, mapVal) =>
    // Observable(rej => forkTask(compose2(rej, mapErr), compose2(rej, mapVal)));

  // const chain: AlgebraicTask<E, V>['chain'] = fn =>
    // Observable((rej, res) => forkTask(rej, compose2(fork(rej, res), fn)));

  const copy = <E = any, V = any>(fn: (o: SubscribeOptions<E, V>) => Partial<SubscribeOptions<any, any>>) =>
    Observable(sub => subscribe(fn({
      onNext: sub.next,
      onError: sub.throwError,
      onComplete: (_: any, x: any) => sub.complete(x),
    })).unsubscribe);

  return {
    subscribe,

    // chain,
    // bimap,
    map: fn => copy(options => ({ ...options, onNext: compose2(options.onNext, fn) })),
    fold: (errFn, nextFn) => copy(options => ({
      ...options,
      onError: compose2(options.onNext, errFn),
      onNext: compose2(options.onNext, nextFn),
    })),
    // foldRejected,

    // resolveWith: value => fold(constant(value), constant(value)),
    // rejectWith: err => foldRejected(constant(err), constant(err)),
    // empty: Observable.Empty,

    // toPromise: () => new Promise((res, rej) => forkTask(rej, res)),
  };
};

// Observable.;

// Observable.Empty :: () -> Task
// Observable.Empty = () => Observable(constant(null));

// Observable.Resolved = <T = any>(data: T) => Observable<any, T>((_, resolve) => resolve(data));
// Observable.Rejected = <E = any>(err: E) => Observable<E, any>(reject => reject(err));

// Observable.of = Observable.Resolved;

// Observable.fromPromise = function<E, T, Args extends any[] = any[]>(
  // factory: (...a: Args) => Promise<T>,
  // ...args: Args
// ): AlgebraicTask<E, T> {
  // return Observable((rej, res) =>
    // factory.apply(null, args)
      // .then(res)
      // .catch(rej));
// };

export default Observable;
