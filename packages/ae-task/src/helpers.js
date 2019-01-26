import { pointfree } from '@algebraic-effects/utils';
import Task from '.';

// race :: [Task e a] -> Task e a
export const race = tasks => Task((rej, res) => tasks.forEach(t => t.fork(rej, res)));

// series :: [Task e a] -> Task e a
export const series = tasks => tasks.reduce(
  (task, t) => task.chain(d => t.map(x => d.concat([x]))),
  Task.Resolved([])
);

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


// Point-free methods
export const map = pointfree('map');
export const bimap = pointfree('bimap');
export const fork = pointfree('fork');
export const fold = pointfree('fold');
export const mapRejected = pointfree('mapRejected');
export const toPromise = pointfree('toPromise')();
