declare const Exception: Record<"throw", import("@algebraic-effects/core/types").Operation<any[], any>> & {
    name: string;
    operations: Record<string, import("@algebraic-effects/core/types").OperationSignature>;
    handler: (handlers: Record<string, import("@algebraic-effects/core/types").OperationBehavior<any[]>>) => import("@algebraic-effects/core/types").HandlerInstance<any[]>;
    extendAs: (newName: string, newOps?: Record<string, import("@algebraic-effects/core/types").OperationSignature>) => import("@algebraic-effects/core").Effect<string>;
} & {
    throw: unknown;
};
export declare const tryCatch: import("@algebraic-effects/core/types").HandlerInstance<any[]>;
export default Exception;
