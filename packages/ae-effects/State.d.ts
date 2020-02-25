declare const State: Record<"update" | "get" | "set", import("@algebraic-effects/core/types").Operation<any[], any>> & {
    name: string;
    operations: Record<string, import("@algebraic-effects/core/types").OperationSignature>;
    handler: (handlers: Record<string, import("@algebraic-effects/core/types").OperationBehavior<any[]>>) => import("@algebraic-effects/core/types").HandlerInstance<any[]>;
    extendAs: (newName: string, newOps?: Record<string, import("@algebraic-effects/core/types").OperationSignature>) => import("@algebraic-effects/core").Effect<string>;
} & {
    get: unknown;
    set: unknown;
    update: unknown;
};
export declare function state<T = any>(initState: T, CustomState?: typeof State): import("@algebraic-effects/core/types").HandlerInstance<any[]>;
export default State;
