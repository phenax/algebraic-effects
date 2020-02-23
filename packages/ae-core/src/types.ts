import { SymbolObject } from '@algebraic-effects/utils';

export interface IteratorResult<T> {
    done: boolean;
    value: T;
}

export interface Iterator<T> {
    next(value?: any): IteratorResult<T>;
    return(value?: any): IteratorResult<T>;
    throw(e?: any): IteratorResult<T>;
}

export interface OperationValue<Args = Array<any>> {
  name: string;
  payload: Args;
  isMulti?: boolean;
  $$type: SymbolObject;
  toString(): string;
}

export type Operation<Args extends Array<any> = any[]> = (...args: Args) => OperationValue<Args>;

export type Program<Args extends Array<any> = any[]> = (...args: Args) => Iterator<OperationValue>;

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

