declare const Logger: Record<"error" | "message" | "log" | "info" | "warn", import("@algebraic-effects/core/types").Operation<any[], any>> & {
    name: string;
    operations: Record<string, import("@algebraic-effects/core/types").OperationSignature>;
    handler: (handlers: Record<string, import("@algebraic-effects/core/types").OperationBehavior<any[]>>) => import("@algebraic-effects/core/types").HandlerInstance<any[]>;
    extendAs: (newName: string, newOps?: Record<string, import("@algebraic-effects/core/types").OperationSignature>) => import("@algebraic-effects/core").Effect<string>;
} & {
    log: unknown;
    message: unknown;
    info: unknown;
    error: unknown;
    warn: unknown;
};
export interface ConsoleInterface {
    log: (...x: any[]) => any;
    error: (e: any) => any;
    warn: (e: any) => any;
    info: (s: string) => any;
}
export declare const fromConsole: (consoleInterface: ConsoleInterface) => import("@algebraic-effects/core/types").HandlerInstance<any[]>;
export default Logger;
