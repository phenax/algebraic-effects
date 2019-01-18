
import { Operation, func } from './utils';

// handlePromise :: (...a -> Promise b) -> FlowOperators -> (...a) -> Promise b
const handlePromise = fn => o => (...args) => fn(o)(...args).then(o.resume).catch(o.throwError);

const globalOperations = {
  sleep: ({ resume }) => duration => setTimeout(resume, duration),
  awaitPromise: handlePromise(() => x => x),
  call: ({ call }) => call,
  resolve: ({ end }) => v => end(v),
  race: handlePromise(({ call }) => programs =>
    Promise.race(programs.map(p => call(p)))),
};
export default globalOperations;

// * :: Operation
export const sleep = Operation('sleep', func(['duration']));
export const awaitPromise = Operation('awaitPromise', func(['promise a'], 'a'));
export const call = Operation('call', func(['generator ...a b', '...a'], 'b'));
export const resolve = Operation('resolve', func(['*']));
export const race = Operation('race', func(['*']));

// addGlobalOperation :: (String, Function, Runner) -> Operation
export const addGlobalOperation = (name, signature, handler) => {
  globalOperations[name] = handler;
  return Operation(name, signature);
};
