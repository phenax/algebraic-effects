import { AlgebraicTask } from '.';
export declare const rejectAfter: (duration: number, value: any) => AlgebraicTask<any, any>;
export declare const resolveAfter: (duration: number, value: any) => AlgebraicTask<any, any>;
export declare const race: (tasks: AlgebraicTask<any, any>[]) => AlgebraicTask<any, any>;
export declare const series: (tasks: AlgebraicTask<any, any>[]) => AlgebraicTask<any, any[]>;
export declare const parallel: (tasks: AlgebraicTask<any, any>[]) => AlgebraicTask<any, any[]>;
export * from './pointfree';
