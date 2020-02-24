import { SymbolObject } from '@algebraic-effects/utils';
import { AlgebraicTask } from '@algebraic-effects/task';
export interface ProgramIteratorResult<T = any, E = any> {
    done: boolean;
    value?: T;
    error?: E;
}
export interface ProgramIterator<T = any> {
    next(value?: any): ProgramIteratorResult<T>;
    return(value?: any): ProgramIteratorResult<T>;
    throw(e?: any): ProgramIteratorResult<T>;
}
export interface OperationValue<Args extends Array<any> = Array<any>, Ret = any> {
    name: string;
    payload: Args;
    isMulti?: boolean;
    $$type: SymbolObject;
}
export interface Operation<Args extends Array<any> = any[], Ret = any> {
    (...args: Args): OperationValue<Args, Ret>;
    toString(): string;
}
export interface Program<Args extends Array<any> = any[]> {
    (...args: Args): ProgramIterator<OperationValue>;
}
export interface OperationOptions {
    isMulti?: boolean;
}
export interface FlowOperators {
    resume(v: any): any;
    throwError(e: any): any;
    end(v: any): any;
    cancel(...args: any[]): any;
    promise(p: Promise<any>): any;
    call(program: Program): any;
    callMulti(program: Program): any;
}
export declare type OperationSignature = [Array<string> | undefined, string | undefined, OperationOptions | undefined];
export interface OperationBehavior<Args extends Array<any> = any[]> {
    (o: FlowOperators): (...args: Args) => any;
}
export declare type TaskWithCancel = AlgebraicTask & {
    isCancelled?: boolean;
};
export interface HandlerInstance<Args extends any[] = any[]> {
    (...args: Args): TaskWithCancel;
    effectName: string;
    handlers: Record<string, OperationBehavior>;
    $$type: SymbolObject;
    concat: (x: HandlerInstance) => HandlerInstance;
    with: (x: HandlerInstance | Record<string, OperationBehavior>) => HandlerInstance;
    run: HandlerInstance<Args>;
    runMulti: (...args: Args) => TaskWithCancel;
}
export declare type HandlerMap<T extends string = string> = Record<T, OperationBehavior>;
export declare type OperationMap<T extends string = string> = Record<T, OperationSignature>;
export declare type Effect<T extends string = string> = Record<keyof T, Operation> & {
    name: string;
    operations: OperationMap;
    handler: (handlers: HandlerMap) => HandlerInstance;
    extendAs: (newName: string, newOps?: OperationMap) => Effect;
};
