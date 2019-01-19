
import { Operation, func } from './utils';

// handlePromise :: (...a -> Promise b) -> FlowOperators -> (...a) -> Promise b
const handlePromise = fn => o => (...args) => fn(o)(...args).then(o.resume).catch(o.throwError);

const globalOpHandlers = {
  sleep: ({ resume }) => duration => setTimeout(resume, duration),
  awaitPromise: handlePromise(() => x => x),
  call: handlePromise(({ call }) => (p, ...a) => call(p, ...a)),
  resolve: ({ end }) => v => end(v),
  race: handlePromise(({ call }) => programs => Promise.race(programs.map(p => call(p)))),
  parallel: handlePromise(({ call }) => programs => Promise.all(programs.map(p => call(p)))),
  background: ({ call, resume }) => (p, ...a) => resume(call(p, ...a)),
};

// * :: Operation
export const sleep = Operation('sleep', func(['duration']));
export const resolve = Operation('resolve', func(['*']));
export const awaitPromise = Operation('awaitPromise', func(['promise a'], 'a'));

export const call = Operation('call', func(['generator ...a b', '...a'], 'b'));
export const race = Operation('race', func(['...(generator ...a b)'], 'b'));
export const parallel = Operation('parallel', func(['...(generator ...a b)'], '[b]'));
export const background = Operation('background', func(['...(generator ...a b)'], '[b]'));

// addGlobalOperation :: (String, Function, Runner) -> Operation
export const addGlobalOperation = (name, signature, handler) => {
  globalOpHandlers[name] = handler;
  return Operation(name, signature);
};

export default globalOpHandlers;
