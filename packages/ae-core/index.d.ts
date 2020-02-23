import { createOperation, func } from './utils';
import { createGenericEffect } from './generic';
import { HandlerInstance, Effect } from './types';
export declare const createEffect: (name: string, operations: Record<string, import("./types").OperationSignature>) => Effect<string>;
export declare function composeHandlers(): any;
export declare const run: HandlerInstance;
export { func, createGenericEffect, createOperation };
