import { pointfreeMethod } from '@algebraic-effects/utils';
import Task from '.';

// Point-free methods
export const map = pointfreeMethod('map');
export const bimap = pointfreeMethod('bimap');
export const fork = pointfreeMethod('fork');
export const fold = pointfreeMethod('fold');
export const mapRejected = pointfreeMethod('mapRejected');
export const resolveWith = pointfreeMethod('resolveWith');
export const rejectWith = pointfreeMethod('rejectWith');
export const empty = pointfreeMethod('empty');
export const toPromise = pointfreeMethod('toPromise');

// race :: [Task e a] -> Task e a
export const race = tasks => Task((rej, res) => tasks.forEach(t => t.fork(rej, res)));

// series :: [Task e a] -> Task e a
export const series = tasks =>
  tasks.reduce((task, t) => task.chain(d => t.map(x => d.concat([x]))), Task.resolved([]));

// parallel :: [Task e a] -> Task e a
export const parallel = tasks => Task((reject, resolve) => {
  let resolvedCount = 0;
  const resolvedData = [];

  const onResolve = index => data => {
    resolvedData[index] = data;
    resolvedCount += 1;
    if(resolvedCount === tasks.length) resolve(resolvedData);
  };

  tasks.forEach((task, index) => task.fork(reject, onResolve(index)));
});
