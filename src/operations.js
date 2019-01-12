
import { Operation } from './utils';

export const sleep = Operation('sleep');
export const awaitPromise = Operation('awaitPromise');

export default {
  sleep: resume => duration => setTimeout(resume, duration),
  awaitPromise: (resume, _, throwE) => promise => promise.then(resume).catch(throwE),
};
