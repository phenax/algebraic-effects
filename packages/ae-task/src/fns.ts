import Task, { AlgebraicTask } from '.';

export const rejectAfter = (duration: number, value: any) => Task(rej => {
  const timer = setTimeout(rej, duration, value);
  return () => clearTimeout(timer);
});

export const resolveAfter = (duration: number, value: any) => Task((_, res) => {
  const timer = setTimeout(res, duration, value);
  return () => clearTimeout(timer);
});

// race :: [Task e a] -> Task e a
export const race = (tasks: Array<AlgebraicTask>): AlgebraicTask =>
  Task((rej, res) => tasks.forEach(t => t.fork(rej, res)));

// series :: [Task e a] -> Task e [a]
export const series = (tasks: Array<AlgebraicTask>): AlgebraicTask<any, Array<any>> => tasks.reduce(
  (task, t) => task.chain((d: Array<any>) => t.map((x: any) => d.concat([x]))),
  Task.Resolved([]),
);

// parallel :: [Task e a] -> Task e [a]
export const parallel = (tasks: Array<AlgebraicTask>): AlgebraicTask<any, Array<any>> => Task((reject, resolve) => {
  let resolvedCount = 0;
  const resolvedData: Array<any> = [];

  const onResolve = (index: number, data: any) => {
    resolvedData[index] = data;
    resolvedCount += 1;
    if(resolvedCount === tasks.length) return resolve(resolvedData);
  };

  tasks.forEach((task, index) => task.fork(reject, onResolve.bind(null, index)));
});

// Point-free methods
export * from './pointfree';
