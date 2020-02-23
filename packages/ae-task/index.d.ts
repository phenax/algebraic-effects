declare const Task: {
    <E = any, V = any>(taskFn: (rej: (e: E) => any, res: (v: V) => any, cancel: (...a: any[]) => any) => any): {
        fork: ((rej: (e: E) => any, res: (v: V) => any, c?: (...args: any[]) => any) => (...args: any[]) => any) | ((optns: {
            Rejected?: (e: E) => any;
            Resolved?: (v: V) => any;
            Cancelled?: (...args: any[]) => any;
        }) => (...args: any[]) => any);
        bimap: <TE = any, TV = TE>(mapErr: (e: E) => TE, mapVal: (v: V) => TV) => {
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
        fold: <TE = any, TV = TE>(mapErr: (e: E) => TE, mapVal: (v: V) => TV) => {
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
        foldRejected: <TE = any, TV = TE>(mapErr: (e: E) => TE, mapVal: (v: V) => TV) => {
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
        chain: <T = any>(fn: (v: V) => any) => {
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
        resolveWith: <R = any>(value: R) => any;
        rejectWith: <F = any>(err: F) => any;
        empty: () => {
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
            empty: any;
            map: <R = any>(fn: (a: any) => R) => any;
            mapRejected: <F = any>(fn: (e: any) => F) => any;
            toPromise: () => Promise<any>;
        };
        map: <R = any>(fn: (a: V) => R) => any;
        mapRejected: <F = any>(fn: (e: E) => F) => any;
        toPromise: () => Promise<V>;
    };
    Empty(): {
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
    Resolved<T = any>(data: T): {
        fork: ((rej: (e: void) => any, res: (v: T) => any, c?: (...args: any[]) => any) => (...args: any[]) => any) | ((optns: {
            Rejected?: (e: void) => any;
            Resolved?: (v: T) => any;
            Cancelled?: (...args: any[]) => any;
        }) => (...args: any[]) => any);
        bimap: <TE = any, TV = TE>(mapErr: (e: void) => TE, mapVal: (v: T) => TV) => {
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
        fold: <TE = any, TV = TE>(mapErr: (e: void) => TE, mapVal: (v: T) => TV) => {
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
        foldRejected: <TE = any, TV = TE>(mapErr: (e: void) => TE, mapVal: (v: T) => TV) => {
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
        chain: <T = any>(fn: (v: T) => any) => {
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
        resolveWith: <R = any>(value: R) => any;
        rejectWith: <F = any>(err: F) => any;
        empty: () => {
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
            empty: any;
            map: <R = any>(fn: (a: any) => R) => any;
            mapRejected: <F = any>(fn: (e: any) => F) => any;
            toPromise: () => Promise<any>;
        };
        map: <R = any>(fn: (a: T) => R) => any;
        mapRejected: <F = any>(fn: (e: void) => F) => any;
        toPromise: () => Promise<T>;
    };
    Rejected<E = any>(err: E): {
        fork: ((rej: (e: E) => any, res: (v: void) => any, c?: (...args: any[]) => any) => (...args: any[]) => any) | ((optns: {
            Rejected?: (e: E) => any;
            Resolved?: (v: void) => any;
            Cancelled?: (...args: any[]) => any;
        }) => (...args: any[]) => any);
        bimap: <TE = any, TV = TE>(mapErr: (e: E) => TE, mapVal: (v: void) => TV) => {
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
        fold: <TE = any, TV = TE>(mapErr: (e: E) => TE, mapVal: (v: void) => TV) => {
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
        foldRejected: <TE = any, TV = TE>(mapErr: (e: E) => TE, mapVal: (v: void) => TV) => {
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
        chain: <T = any>(fn: (v: void) => any) => {
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
        resolveWith: <R = any>(value: R) => any;
        rejectWith: <F = any>(err: F) => any;
        empty: () => {
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
            empty: any;
            map: <R = any>(fn: (a: any) => R) => any;
            mapRejected: <F = any>(fn: (e: any) => F) => any;
            toPromise: () => Promise<any>;
        };
        map: <R = any>(fn: (a: void) => R) => any;
        mapRejected: <F = any>(fn: (e: E) => F) => any;
        toPromise: () => Promise<void>;
    };
    of: <T = any>(data: T) => {
        fork: ((rej: (e: void) => any, res: (v: T) => any, c?: (...args: any[]) => any) => (...args: any[]) => any) | ((optns: {
            Rejected?: (e: void) => any;
            Resolved?: (v: T) => any;
            Cancelled?: (...args: any[]) => any;
        }) => (...args: any[]) => any);
        bimap: <TE = any, TV = TE>(mapErr: (e: void) => TE, mapVal: (v: T) => TV) => {
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
        fold: <TE = any, TV = TE>(mapErr: (e: void) => TE, mapVal: (v: T) => TV) => {
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
        foldRejected: <TE = any, TV = TE>(mapErr: (e: void) => TE, mapVal: (v: T) => TV) => {
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
        chain: <T = any>(fn: (v: T) => any) => {
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
        resolveWith: <R = any>(value: R) => any;
        rejectWith: <F = any>(err: F) => any;
        empty: () => {
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
            empty: any;
            map: <R = any>(fn: (a: any) => R) => any;
            mapRejected: <F = any>(fn: (e: any) => F) => any;
            toPromise: () => Promise<any>;
        };
        map: <R = any>(fn: (a: T) => R) => any;
        mapRejected: <F = any>(fn: (e: void) => F) => any;
        toPromise: () => Promise<T>;
    };
    fromPromise<E, T>(factory: (...a: any[]) => Promise<T>): any;
};
export default Task;
