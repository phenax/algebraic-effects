declare const Exception: import("@algebraic-effects/core").Effect<{
    throw: unknown;
}> & Record<"throw", (...a: any[]) => any>;
export declare const tryCatch: import("@algebraic-effects/core/types").HandlerInstance<any[]>;
export default Exception;
