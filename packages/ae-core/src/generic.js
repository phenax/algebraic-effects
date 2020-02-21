import { race as raceTasks, parallel as runInParallel } from '@algebraic-effects/task/fns';
import { identity } from '@algebraic-effects/utils';
import { Operation, func } from './utils';

// handleTask :: (...a -> Task e b) -> FlowOperators -> (...a) -> CancelFunction
const handleTask = fn => o => (...args) => fn(o)(...args).fork(o.throwError, o.resume);

const genericOpHandlers = {
  sleep: o => duration => setTimeout(o.resume, duration),
  awaitPromise: o => o.promise,
  runTask: o => t => t.fork(o.throwError, o.resume),
  call: handleTask(o => o.call),
  callMulti: handleTask(o => o.callMulti),
  resolve: o => o.end,
  cancel: o => o.cancel,
  race: handleTask(o => programs => raceTasks(programs.map(p => o.call(p)))),
  parallel: handleTask(o => programs => runInParallel(programs.map(p => o.call(p)))),
  background: o => function() {
    const args = arguments;
    return o.resume(o.call.apply(null, args).fork(identity, identity));
  },
};

// * :: Operation
export const sleep = Operation('sleep', func(['duration']));
export const resolve = Operation('resolve', func(['*']));
export const cancel = Operation('cancel', func(['*']));
export const awaitPromise = Operation('awaitPromise', func(['promise e a'], 'a'));
export const runTask = Operation('runTask', func(['task e a'], 'a'));
export const call = Operation('call', func(['generator ...a b', '...a'], 'b'));
export const callMulti = Operation('callMulti', func(['generator ...a b', '...a'], 'b', { isMulti: true }));
export const race = Operation('race', func(['...(generator ...a b)'], 'b', { isMulti: true }));
export const parallel = Operation('parallel', func(['...(generator ...a b)'], '[b]', { isMulti: true }));
export const background = Operation('background', func(['...(generator ...a b)'], '[b]', { isMulti: true }));

// createGenericEffect :: (String, OpSignature, OpBehavior) -> Operation
export const createGenericEffect = (name, signature, handler) => {
  genericOpHandlers[name] = handler;
  return Operation(name, signature);
};

export default genericOpHandlers;
