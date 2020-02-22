
import Task from '@algebraic-effects/task';
import { SymbolObject } from '@algebraic-effects/utils';

declare module AlgebraicEffects {
  export type Program = GeneratorFunction | Iterator<any>;
  export type Runner = (program: Program, ...args: any) => Task<any, any>;
  export type FuncDefinition = [string, string];

  export type Operation = { name: string, payload: Array<any>, $$type: SymbolObject }
  export type OpsDefinition = { [key: string]: FuncDefinition };

  export interface Effect {
    name: string
    operations: OpsDefinition
    extendAs: (name: string, ops: OpsDefinition) => Effect
    // handler: 
  }

  export function createEffect(effectName: string, ops: OpsDefinition): Effect;
}

