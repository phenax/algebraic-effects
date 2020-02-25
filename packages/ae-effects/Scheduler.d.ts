declare global {
    interface Window {
        requestIdleCallback(...args: any[]): any;
    }
}
declare const Scheduler: Record<"waitForNextFrame" | "waitForIdle" | "waitFor", import("@algebraic-effects/core/types").Operation<any[], any>> & {
    name: string;
    operations: Record<string, import("@algebraic-effects/core/types").OperationSignature>;
    handler: (handlers: Record<string, import("@algebraic-effects/core/types").OperationBehavior<any[]>>) => import("@algebraic-effects/core/types").HandlerInstance<any[]>;
    extendAs: (newName: string, newOps?: Record<string, import("@algebraic-effects/core/types").OperationSignature>) => import("@algebraic-effects/core").Effect<string>;
} & {
    waitForNextFrame: unknown;
    waitForIdle: unknown;
    waitFor: unknown;
};
export declare const scheduler: import("@algebraic-effects/core/types").HandlerInstance<any[]>;
export default Scheduler;
