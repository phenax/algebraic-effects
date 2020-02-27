export interface Subscription<E = any, V = any> {
    readonly isCancelled: boolean;
    next: (v: V) => any;
    throwError: (e: E) => any;
    complete: (d?: any) => any;
    unsubscribe: UnsubscribeFn;
}
export interface ErrorFn<E> {
    (e: E): any;
}
export interface NextFn<V> {
    (v: V): any;
}
export interface CompleteFn<Data = any, E = any, V = any> {
    (sub: Subscription<E, V>, d?: Data): any;
}
export interface UnsubscribeFn {
    (...a: any): any;
}
export interface SubscribeOptions<E, V> {
    onError: ErrorFn<E>;
    onNext: NextFn<V>;
    onComplete: CompleteFn<any, E, V>;
}
export declare type SubscribeFunction<E, V> = (optns: Partial<SubscribeOptions<E, V>>) => UnsubscribeFn | any;
export interface ObservableInstance<E = any, V = any> {
    map: <R = any>(fn: (a: V) => R) => ObservableInstance<E, R>;
    subscribe: SubscribeFunction<E, V>;
}
declare const Observable: <E = any, V = any>(taskFn: (subscription: Subscription<any, any>) => any) => ObservableInstance<E, V>;
export default Observable;
