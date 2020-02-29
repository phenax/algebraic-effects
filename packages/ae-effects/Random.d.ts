declare const Random: Record<"number" | "getInt" | "fromArray" | "flipCoin", import("@algebraic-effects/core/types").Operation<any[], any>> & {
    name: string;
    operations: Record<string, import("@algebraic-effects/core/types").OperationSignature>;
    handler: (handlers: Record<string, import("@algebraic-effects/core/types").OperationBehavior<any[]>>) => import("@algebraic-effects/core/types").HandlerInstance<any[]>;
    extendAs: (newName: string, newOps?: Record<string, import("@algebraic-effects/core/types").OperationSignature>) => import("@algebraic-effects/core").Effect<string>;
} & {
    number: unknown;
    getInt: unknown;
    fromArray: unknown;
    flipCoin: unknown;
};
export declare const seeded: (seed: number) => import("@algebraic-effects/core/types").HandlerInstance<any[]>;
export declare const random: import("@algebraic-effects/core/types").HandlerInstance<any[]>;
export default Random;
