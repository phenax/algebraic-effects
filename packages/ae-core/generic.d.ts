import { AlgebraicTask } from '@algebraic-effects/task';
import { Program, OperationSignature, OperationBehavior } from './types';
declare const genericOpHandlers: {
    [k: string]: OperationBehavior;
};
export declare const sleep: import("./types").Operation<[number], any>;
export declare const resolve: import("./types").Operation<[any], any>;
export declare const cancel: import("./types").Operation<any[], any>;
export declare const awaitPromise: import("./types").Operation<[Promise<any>], any>;
export declare const runTask: import("./types").Operation<[AlgebraicTask<any, any>], any>;
export declare const call: import("./types").Operation<[Program<any[]>], any>;
export declare const callMulti: import("./types").Operation<[Program<any[]>], any>;
export declare const race: import("./types").Operation<Program<any[]>[], any>;
export declare const parallel: import("./types").Operation<Program<any[]>[], any[]>;
export declare const background: import("./types").Operation<Program<any[]>[], any[]>;
export declare const createGenericEffect: (name: string, signature: OperationSignature, handler: OperationBehavior<any[]>) => import("./types").Operation<any[], any>;
export default genericOpHandlers;
