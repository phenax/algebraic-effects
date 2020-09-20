import { createOperation, func } from './utils';
import { createGenericEffect } from './generic';
import { Program, ProgramIterator, ProgramIteratorResult, FlowOperators, HandlerMap, HandlerInstance, OperationMap, Effect, Operation } from './types';
export { Program, ProgramIterator, ProgramIteratorResult, FlowOperators, HandlerMap, OperationMap, Effect };
export declare const createEffect: <OpMap = Record<string, Function>>(name: string, operations: Record<keyof OpMap, import("./types").OperationSignature>) => Effect<OpMap> & Record<keyof OpMap, Operation<any[], any>>;
export declare function composeHandlers(): any;
export declare const run: HandlerInstance<any[]>;
export { func, createGenericEffect, createOperation };
