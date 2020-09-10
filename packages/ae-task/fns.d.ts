import { AlgebraicTask } from '.';
export declare const rejectAfter: (duration: number, value: any) => AlgebraicTask<any, any>;
export declare const resolveAfter: (duration: number, value: any) => AlgebraicTask<any, any>;
export declare const race: (tasks: Array<AlgebraicTask>) => AlgebraicTask;
export declare const series: (tasks: Array<AlgebraicTask>) => AlgebraicTask<any, Array<any>>;
export declare const parallel: (tasks: Array<AlgebraicTask>) => AlgebraicTask<any, Array<any>>;
export * from './pointfree';
