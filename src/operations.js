
import { Operation, func } from './utils';

// * :: Operation
export const sleep = Operation('sleep', func(['duration']));
export const awaitPromise = Operation('awaitPromise', func(['promise a'], 'a'));
export const call = Operation('call', func(['generator ...a b', '...a'], 'b'));

export default {
  sleep: ({ resume }) => duration => setTimeout(resume, duration),
  awaitPromise: ({ resume, throwError }) => promise => promise.then(resume).catch(throwError),
  call: ({ call }) => call,
};
