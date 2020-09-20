declare const State: import("@algebraic-effects/core").Effect<{
    get: <T = any>() => T;
    set: <T_1 = any>(a: T_1) => void;
    update: <T_2 = any>(f: (a: T_2) => T_2) => T_2;
}> & Record<"update" | "get" | "set", import("@algebraic-effects/core/types").Operation<any[], any>>;
export declare function state<T = any>(initState: T, CustomState?: typeof State): import("@algebraic-effects/core/types").HandlerInstance<any[]>;
export default State;
