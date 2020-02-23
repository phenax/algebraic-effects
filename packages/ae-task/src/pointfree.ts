import { pointfree, compose } from '@algebraic-effects/utils';
import { AlgebraicTask } from '.';

export const chain = pointfree<AlgebraicTask, 'chain'>('chain');
export const map = pointfree<AlgebraicTask, 'map'>('map');
export const mapRejected = pointfree<AlgebraicTask, 'mapRejected'>('mapRejected');
export const fold = pointfree<AlgebraicTask, 'fold'>('fold');
export const foldRejected = pointfree<AlgebraicTask, 'foldRejected'>('foldRejected');
export const bimap = pointfree<AlgebraicTask, 'bimap'>('bimap');
export const toPromise = pointfree<AlgebraicTask, 'toPromise'>('toPromise')();
export const fork = pointfree<AlgebraicTask, 'fork'>('fork');

export { compose };
