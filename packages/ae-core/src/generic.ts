import { AlgebraicTask } from '@algebraic-effects/task';
import { race as raceTasks, parallel as runInParallel } from '@algebraic-effects/task/fns';
import { identity } from '@algebraic-effects/utils';
import { createOperation, func } from './utils';
import { Program, OperationSignature, OperationBehavior, FlowOperators } from './types';

const handleTask = (fn: (o: FlowOperators) => (...a: any[]) => AlgebraicTask) =>
  (o: FlowOperators) =>
    (...args: any[]) => fn(o)(...args).fork(o.throwError, o.resume);

const genericOpHandlers: { [k: string]: OperationBehavior } = {
  sleep: o => duration => setTimeout(o.resume, duration),
  awaitPromise: o => o.promise,
  runTask: o => t => t.fork(o.throwError, o.resume),
  call: handleTask(o => o.call),
  callMulti: handleTask(o => o.callMulti),
  resolve: o => o.end,
  cancel: o => o.cancel,
  race: handleTask(o => (programs: Array<Program>) =>
    raceTasks(programs.map(p => o.call(p)))),
  parallel: handleTask(o => (programs: Array<Program>) =>
    runInParallel(programs.map(p => o.call(p)))),
  background: o => function() {
    const args = arguments;
    return o.resume(o.call.apply(null, args).fork(identity, identity));
  },
};

// * :: Operation
export const sleep = createOperation<[number]>('sleep', func(['duration']));
export const resolve = createOperation<[any]>('resolve', func(['*']));
export const cancel = createOperation('cancel', func(['*']));
export const awaitPromise = createOperation<[Promise<any>], any>('awaitPromise', func(['promise e a'], 'a'));
export const runTask = createOperation<[AlgebraicTask<any, any>], any>('runTask', func(['task e a'], 'a'));
export const call = createOperation<[Program], any>('call', func(['generator ...a b', '...a'], 'b'));
export const callMulti = createOperation<[Program], any>('callMulti', func(['generator ...a b', '...a'], 'b', { isMulti: true }));
export const race = createOperation<Program[], any>('race', func(['...(generator ...a b)'], 'b', { isMulti: true }));
export const parallel = createOperation<Program[], any[]>('parallel', func(['...(generator ...a b)'], '[b]', { isMulti: true }));
export const background = createOperation<Program[], any[]>('background', func(['...(generator ...a b)'], '[b]', { isMulti: true }));

// createGenericEffect :: (String, OpSignature, OpBehavior) -> Operation
export const createGenericEffect = (name: string, signature: OperationSignature, handler: OperationBehavior) => {
  genericOpHandlers[name] = handler;
  return createOperation(name, signature);
};

export default genericOpHandlers;
