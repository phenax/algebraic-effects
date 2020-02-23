export declare const rejectAfter: (duration: number, value: any) => {
    fork: ((rej: (e: any) => any, res: (v: any) => any, c?: (...args: any[]) => any) => (...args: any[]) => any) | ((optns: {
        Rejected?: (e: any) => any;
        Resolved?: (v: any) => any;
        Cancelled?: (...args: any[]) => any;
    }) => (...args: any[]) => any);
    bimap: <TE = any, TV = TE>(mapErr: (e: any) => TE, mapVal: (v: any) => TV) => any;
    fold: <TE = any, TV = TE>(mapErr: (e: any) => TE, mapVal: (v: any) => TV) => any;
    foldRejected: <TE = any, TV = TE>(mapErr: (e: any) => TE, mapVal: (v: any) => TV) => any;
    chain: <T = any>(fn: (v: any) => any) => any;
    resolveWith: <R = any>(value: R) => any;
    rejectWith: <F = any>(err: F) => any;
    empty: () => any;
    map: <R = any>(fn: (a: any) => R) => any;
    mapRejected: <F = any>(fn: (e: any) => F) => any;
    toPromise: () => Promise<any>;
};
export declare const resolveAfter: (duration: number, value: any) => {
    fork: ((rej: (e: any) => any, res: (v: any) => any, c?: (...args: any[]) => any) => (...args: any[]) => any) | ((optns: {
        Rejected?: (e: any) => any;
        Resolved?: (v: any) => any;
        Cancelled?: (...args: any[]) => any;
    }) => (...args: any[]) => any);
    bimap: <TE = any, TV = TE>(mapErr: (e: any) => TE, mapVal: (v: any) => TV) => any;
    fold: <TE = any, TV = TE>(mapErr: (e: any) => TE, mapVal: (v: any) => TV) => any;
    foldRejected: <TE = any, TV = TE>(mapErr: (e: any) => TE, mapVal: (v: any) => TV) => any;
    chain: <T = any>(fn: (v: any) => any) => any;
    resolveWith: <R = any>(value: R) => any;
    rejectWith: <F = any>(err: F) => any;
    empty: () => any;
    map: <R = any>(fn: (a: any) => R) => any;
    mapRejected: <F = any>(fn: (e: any) => F) => any;
    toPromise: () => Promise<any>;
};
export declare const race: (tasks: any[]) => any;
export declare const series: (tasks: any[]) => any;
export declare const parallel: (tasks: any[]) => any;
export * from './pointfree';
