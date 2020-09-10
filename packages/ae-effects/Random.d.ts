declare const Random: import("@algebraic-effects/core").Effect<{
    number: unknown;
    getInt: unknown;
    fromArray: unknown;
    flipCoin: unknown;
}> & Record<"number" | "getInt" | "fromArray" | "flipCoin", import("@algebraic-effects/core/types").OperationBehavior<any[]>>;
export declare const seeded: (seed: number) => import("@algebraic-effects/core/types").HandlerInstance<any[]>;
export declare const random: import("@algebraic-effects/core/types").HandlerInstance<any[]>;
export default Random;
