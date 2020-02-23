import { pointfree, compose } from '@algebraic-effects/utils';

export const map = pointfree('map');
export const bimap = pointfree('bimap');
export const fork = pointfree('fork');
export const fold = pointfree('fold');
export const mapRejected = pointfree('mapRejected');
export const toPromise = pointfree('toPromise')();

export { compose };
