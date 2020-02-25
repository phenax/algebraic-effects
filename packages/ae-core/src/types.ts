import { SymbolObject } from '@algebraic-effects/utils';
import {AlgebraicTask} from '@algebraic-effects/task';

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

// @ts-ignore
export interface OperationValue<Args extends Array<any> = Array<any>, Ret = any> {
  name: string;
  payload: Args;
  isMulti?: boolean;
  $$type: SymbolObject;
}

export interface Operation<Args extends Array<any> = any[], Ret = any> {
  (...args: Args): OperationValue<Args, Ret>;
  toString(): string;
};

export type Program<Args extends Array<any> = any[]> =
  | ((...args: Args) => ProgramIterator<OperationValue>)
  | Generator<OperationValue<any, any>, any, any>;

export interface OperationOptions {
  isMulti?: boolean;
}

export type ProgramParams<P> = P extends Function ? Parameters<P> : any[];

export interface FlowOperators {
  resume(v: any): any;
  throwError(e: any): any;
  end(v: any): any;
  cancel(...args: any[]): any;
  promise(p: Promise<any>): any;
  call(program: Program, ...args: ProgramParams<Program>): any;
  callMulti(program: Program, ...args: ProgramParams<Program>): any;
}

export type OperationSignature =
  [Array<string> | undefined, string | undefined, OperationOptions | undefined];

export interface OperationBehavior<Args extends Array<any> = any[]> {
  (o: FlowOperators): (...args: Args) => any;
}

export type TaskWithCancel = AlgebraicTask & { isCancelled?: boolean };

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

export type HandlerMap<T extends string|symbol|number = string> = Record<T, OperationBehavior>;
export type OperationMap<T extends string|symbol|number = string> = Record<T, OperationSignature>;

export interface Effect<T = {}> {
  name: string;
  operations: OperationMap<keyof T>;
  handler: (handlers: HandlerMap<keyof T>) => HandlerInstance,
  extendAs: (newName: string, newOps?: OperationMap) => Effect,
};

