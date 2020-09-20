declare const Exception: import("@algebraic-effects/core").Effect<{
    throw: unknown;
}> & Record<"throw", import("@algebraic-effects/core/types").Operation<any[], any>>;
export declare const tryCatch: import("@algebraic-effects/core/types").HandlerInstance<any[]>;
export default Exception;
