import { pointfree, compose } from '@algebraic-effects/utils';
import Task from 'packages/ae-task/src';

export const chain = pointfree<Task, 'chain'>('chain');
export const map = pointfree<Task, 'map'>('map');
export const mapRejected = pointfree<Task, 'mapRejected'>('mapRejected');
export const fold = pointfree<Task, 'fold'>('fold');
export const foldReject = pointfree<Task, 'foldReject'>('foldReject');
export const bimap = pointfree<Task, 'bimap'>('bimap');
export const fork = pointfree<Task, 'fork'>('fork');
export const toPromise = pointfree<Task, 'toPromise'>('toPromise')();

export { compose };
