export interface RejectFn<E> {
    (e: E): any;
}
export interface ResolveFn<V> {
    (v: V): any;
}
export interface CancelFn {
    (...args: any[]): any;
}
export interface ForkOptions<E, V> {
    Rejected?: RejectFn<E>;
    Resolved?: ResolveFn<V>;
    Cancelled?: CancelFn;
}
export declare type ForkFunction<E, V> = ((rej: RejectFn<E>, res: ResolveFn<V>, c?: CancelFn) => CancelFn) | ((optns: ForkOptions<E, V>) => CancelFn);
export interface AlgebraicTask<E = any, V = any> {
    chain: <F = any, T = any>(fn: (v: V) => AlgebraicTask<F, T>) => AlgebraicTask<F, T>;
    map: <R = any>(fn: (a: V) => R) => AlgebraicTask<E, R>;
    mapRejected: <F = any>(fn: (e: E) => F) => AlgebraicTask<F, V>;
    bimap: <TE = any, TV = TE>(mapErr: (e: E) => TE, mapVal: (v: V) => TV) => AlgebraicTask<TE, TV>;
    fold: <TE = any, TV = TE>(mapErr: (e: E) => TE, mapVal: (v: V) => TV) => AlgebraicTask<void, TE | TV>;
    foldRejected: <TE = any, TV = TE>(mapErr: (e: E) => TE, mapVal: (v: V) => TV) => AlgebraicTask<TE | TV, void>;
    fork: ForkFunction<any, any>;
    resolveWith: <R = any>(value: R) => AlgebraicTask<void, R>;
    rejectWith: <F = any>(err: F) => AlgebraicTask<F, void>;
    empty: typeof Task.Empty;
    toPromise: () => Promise<V>;
}
declare const Task: {
    <E = any, V = any>(taskFn: (rej: (e: E) => any, res: (v: V) => any, cancel: (...a: any[]) => any) => any): AlgebraicTask<E, V>;
    Empty(): AlgebraicTask<any, any>;
    Resolved<T = any>(data: T): AlgebraicTask<void, T>;
    Rejected<E_1 = any>(err: E_1): AlgebraicTask<E_1, void>;
    of: <T = any>(data: T) => AlgebraicTask<void, T>;
    fromPromise<E_2, T_1>(factory: (...a: any[]) => Promise<T_1>): AlgebraicTask<E_2, T_1>;
};
export default Task;
