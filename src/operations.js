
import { Operation } from './utils';

// * :: Operation
export const sleep = Operation('sleep');
export const awaitPromise = Operation('awaitPromise');
export const call = Operation('call');

export default {
  sleep: ({ resume }) => duration => setTimeout(resume, duration),
  awaitPromise: ({ resume, throwError }) => promise => promise.then(resume).catch(throwError),
  call: ({ call }) => call,
};
