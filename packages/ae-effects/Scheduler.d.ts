declare global {
    interface Window {
        requestIdleCallback(...args: any[]): any;
    }
}
declare const Scheduler: import("@algebraic-effects/core").Effect<string>;
export declare const scheduler: import("@algebraic-effects/core/types").HandlerInstance<any[]>;
export default Scheduler;
