import { Effect } from '@algebraic-effects/core';
declare const State: Effect<string>;
export declare function state<T = any>(initState: T, CustomState?: Effect): import("@algebraic-effects/core/types").HandlerInstance<any[]>;
export default State;
