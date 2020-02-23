import { FlowOperators, createEffect, func } from '@algebraic-effects/core';

declare global {
  interface Window {
    requestIdleCallback(...args: any[]): any;
  }
}

const raf = window.requestAnimationFrame || (fn => setTimeout(fn, 16));
const getRic = () => window.requestIdleCallback || raf;

interface RicOptions { timeout?: number };

const Scheduler = createEffect('Scheduler', {
  waitForNextFrame: func(),
  waitForIdle: func(['?options']),
  waitFor: func(['delay']),
});

export const scheduler = Scheduler.handler({
  waitForNextFrame: (o: FlowOperators) => () => raf(o.resume),
  waitForIdle: (o: FlowOperators) => (options?: RicOptions) => getRic()(o.resume, options),
  waitFor: (o: FlowOperators) => (time: number) => setTimeout(o.resume, time),
});

export default Scheduler;
