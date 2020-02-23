import { SymbolObject } from '@algebraic-effects/utils';

export interface GenIteratorResult<T> {
    done: boolean;
    value: T;
}

export interface GenIterator<T> {
    next(value?: any): GenIteratorResult<T>;
    return(value?: any): GenIteratorResult<T>;
    throw(e?: any): GenIteratorResult<T>;
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

export type Program<Args extends Array<any> = any[]> = (...args: Args) => GenIterator<OperationValue>;

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

export type OperationSignature =
  [Array<string> | undefined, string | undefined, OperationOptions | undefined];

export type OperationBehavior<Args extends Array<any> = any[]> =
  (o: FlowOperators) => (...args: Args) => any;

