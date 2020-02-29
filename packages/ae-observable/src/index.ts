import { compose2, identity, noop, ifElse } from '@algebraic-effects/utils';

export interface Subscription<E = any, V = any> {
  readonly isCancelled: boolean;
  next: (v: V) => any;
  resolve: (v: V) => any;
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
  chain: <F = any, T = any>(
    fn: (v: V) => ObservableInstance<F, T>,
  ) => ObservableInstance<E | F, T>;
  map: <R = any>(fn: (a: V) => R) => ObservableInstance<E, R>;
  merge: <V1 = any>(obs: ObservableInstance<V1>) => ObservableInstance<E, V | V1>;
  filter: (fn: (a: V) => boolean) => ObservableInstance<E, R>;
  propagateTo: <TE = any, TV = TE>(
    mapErr: (e: E) => TE,
      mapVal: (v: V) => TV,
  ) => ObservableInstance<void, TE | TV>;
  tap: (fn: (a: V) => any) => ObservableInstance<E, V>;

  subscribe: SubscribeFunction<E, V>;
};

const createObservable = <E = any, V = any>(
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
      resolve: x => compose2(subscription.complete, subscription.next)(x),
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

  const extend = <E = any, V = any>(
    fn: (o: SubscribeOptions<E, V>) => Partial<SubscribeOptions<any, any>> = identity
  ) =>
    createObservable(sub => subscribe(fn({
      onNext: sub.next,
      onError: sub.throwError,
      onComplete: (_: any, x: any) => sub.complete(x),
    })).unsubscribe);

  const map: ObservableInstance['map'] =
    fn => extend(options => ({ ...options, onNext: compose2(options.onNext, fn) }));

  const merge: ObservableInstance['merge'] = obs => createObservable(sub => {
    let completionCount = 0;
    const onComplete = () => {
      completionCount++;
      if (completionCount >= 2) {
        sub.complete();
      }
    };

    const unsub1 = subscribe({
      onNext: sub.next,
      onError: sub.throwError,
      onComplete,
    });
    const unsub2 = obs.subscribe({
      onNext: sub.next,
      onError: sub.throwError,
      onComplete,
    });

    return () => {
      unsub1();
      unsub2();
    };
  });

  return {
    subscribe,
    map,
    merge,
    tap: fn => map<V>((x: V) => {
      fn(x);
      return x;
    }),
    filter: fn => extend(options => ({
      ...options,
      onNext: ifElse(fn, options.onNext, noop),
    })),
    chain: fn => extend(options => ({
      ...options,
      onNext: compose2(o => o.subscribe({ ...options, onNext: options.onNext, onComplete: noop }), fn),
    })),
    propagateTo: (errFn, nextFn) => extend(options => ({
      ...options,
      onError: compose2(options.onNext, errFn),
      onNext: compose2(options.onNext, nextFn),
    })),
  };
};

export const of = <T = any>(...items: T[]) => createObservable(sub => {
  items.forEach(x => sub.next(x));
  sub.complete();
});

export const range = (a: number, b: number) => createObservable(sub => {
  Array(b - a).fill(null).forEach((_, index) => {
    sub.next(a + index);
  });
  sub.complete();
});

export const interval = (delay: number) => createObservable(sub => {
  const timer = setInterval(sub.next, delay, null);
  return () => clearInterval(timer);
});

export default createObservable;

