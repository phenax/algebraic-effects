declare const Logger: import("@algebraic-effects/core").Effect<{
    log: unknown;
    message: unknown;
    info: unknown;
    error: unknown;
    warn: unknown;
}> & Record<"error" | "message" | "log" | "info" | "warn", import("@algebraic-effects/core/types").Operation<any[], any>>;
export interface ConsoleInterface {
    log: (...x: any[]) => any;
    error: (e: any) => any;
    warn: (e: any) => any;
    info: (s: string) => any;
}
export declare const fromConsole: (consoleInterface: ConsoleInterface) => import("@algebraic-effects/core/types").HandlerInstance<any[]>;
export default Logger;
