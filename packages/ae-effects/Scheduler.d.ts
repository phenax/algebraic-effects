declare global {
    interface Window {
        requestIdleCallback(...args: any[]): any;
    }
}
declare const Scheduler: import("@algebraic-effects/core").Effect<{
    waitForNextFrame: unknown;
    waitForIdle: unknown;
    waitFor: unknown;
}> & Record<"waitForNextFrame" | "waitForIdle" | "waitFor", (...a: any[]) => any>;
export declare const scheduler: import("@algebraic-effects/core/types").HandlerInstance<any[]>;
export default Scheduler;
