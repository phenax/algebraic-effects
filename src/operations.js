
import { Operation } from './utils';

// sleep :: Operation
export const sleep = Operation('sleep');

export default {
  sleep: resume => duration => setTimeout(resume, duration),
};
