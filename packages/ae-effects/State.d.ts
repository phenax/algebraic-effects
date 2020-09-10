declare const State: import("@algebraic-effects/core").Effect<{
    get: unknown;
    set: unknown;
    update: unknown;
}> & Record<"update" | "get" | "set", import("@algebraic-effects/core/types").OperationBehavior<any[]>>;
export declare function state<T = any>(initState: T, CustomState?: typeof State): import("@algebraic-effects/core/types").HandlerInstance<any[]>;
export default State;
