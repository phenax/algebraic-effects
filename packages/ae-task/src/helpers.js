import Task from '.';

// rejectAfter :: (Number, e) -> Task.Rejected e
export const rejectAfter = (duration, value) => Task(rej => {
  const timer = setTimeout(rej, duration, value);
  return () => clearTimeout(timer);
});

// resolveAfter :: (Number, a) -> Task.Resolved a
export const resolveAfter = (duration, value) => Task((_, res) => {
  const timer = setTimeout(res, duration, value);
  return () => clearTimeout(timer);
});

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

  const onResolve = (index, data) => {
    resolvedData[index] = data;
    resolvedCount += 1;
    if(resolvedCount === tasks.length) return resolve(resolvedData);
  };

  tasks.forEach((task, index) => task.fork(reject, onResolve.bind(null, index)));
});

// Point-free methods
export * from './pointfree';
