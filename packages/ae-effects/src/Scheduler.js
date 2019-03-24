import { createEffect, func } from '@algebraic-effects/core';

const raf = () => window.requestAnimationFrame || (fn => setTimeout(fn, 16));
const ric = () => window.requestIdleCallback || raf;

const Scheduler = createEffect('Scheduler', {
  waitForNextFrame: func(),
  waitForIdle: func(['?options']),
  waitFor: func(['delay']),
});

Scheduler.scheduler = Scheduler.handler({
  waitForNextFrame: ({ resume }) => () => raf()(resume),
  waitForIdle: ({ resume }) => options => ric()(resume, options),
  waitFor: ({ resume }) => time => setTimeout(resume, time),
});

export default Scheduler;
