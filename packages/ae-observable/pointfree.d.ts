import { compose } from '@algebraic-effects/utils';
import { ObservableInstance } from '.';
export declare const chain: (fn: (v: any) => ObservableInstance<unknown, unknown>) => (x: ObservableInstance<any, any>) => ObservableInstance<any, unknown>;
export declare const map: (fn: (a: any) => unknown) => (x: ObservableInstance<any, any>) => ObservableInstance<any, unknown>;
export declare const tap: (fn: (a: any) => any) => (x: ObservableInstance<any, any>) => ObservableInstance<any, any>;
export declare const filter: (fn: (a: any) => boolean) => (x: ObservableInstance<any, any>) => ObservableInstance<any, any>;
export declare const subscribe: (optns: Partial<import(".").SubscribeOptions<any, any>>) => (x: ObservableInstance<any, any>) => any;
export declare const propagateTo: (mapErr: (e: any) => unknown, mapVal: (v: any) => unknown) => (x: ObservableInstance<any, any>) => ObservableInstance<void, unknown>;
export { compose };
