import { pointfree, compose } from '@algebraic-effects/utils';
import { ObservableInstance } from '.';

export const chain = pointfree<ObservableInstance, 'chain'>('chain');
export const map = pointfree<ObservableInstance, 'map'>('map');
export const filter = pointfree<ObservableInstance, 'filter'>('filter');
export const subscribe = pointfree<ObservableInstance, 'subscribe'>('subscribe');
export const propagateTo = pointfree<ObservableInstance, 'propagateTo'>('propagateTo');

export { compose };
