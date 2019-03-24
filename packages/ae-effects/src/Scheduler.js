import { createEffect, func } from '@algebraic-effects/core';

const raf = window.requestAnimationFrame || (fn => setTimeout(fn, 16));
const ric = () => window.requestIdleCallback || raf;

const Scheduler = createEffect('Scheduler', {
  waitForNextFrame: func(),
  waitForIdle: func(['?options']),
  waitFor: func(['delay']),
});

Scheduler.scheduler = Scheduler.handler({
  waitForNextFrame: o => () => raf(o.resume),
  waitForIdle: o => options => ric()(o.resume, options),
  waitFor: o => time => setTimeout(o.resume, time),
});

export default Scheduler;
