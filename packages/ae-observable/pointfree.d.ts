import { compose } from '@algebraic-effects/utils';
export declare const chain: (...args: unknown[]) => (x: any) => any;
export declare const map: (...args: unknown[]) => (x: any) => any;
export declare const mapRejected: (...args: unknown[]) => (x: any) => any;
export declare const fold: (...args: unknown[]) => (x: any) => any;
export declare const foldRejected: (...args: unknown[]) => (x: any) => any;
export declare const bimap: (...args: unknown[]) => (x: any) => any;
export declare const toPromise: (x: any) => any;
export declare const fork: (...args: unknown[]) => (x: any) => any;
export { compose };