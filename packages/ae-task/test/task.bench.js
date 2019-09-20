
import { Bencho } from '@algebraic-effect/test-utils';
import Task from '../src';
import { parallel } from '../src/helpers';

// const printResult = (label, result) => {
//   console.log(`
// ${label}
//   Time Diff (W: ${result.time.winner}): ${result.time.perc.toFixed(2)} %
//   Memory Diff (W: ${result.memory.winner}): ${result.memory.perc.toFixed(2)} %

// `);
// };

// const onComplete = ({ label, compare }) => printResult(label, compare('task', 'promise'));

Bencho.benchmark('Task vs Promise - simple', {
  repeat: 1,
  keys: ['task', 'baseline'],
  threshold: {
    time: 80,
    memory: 90,
  },
  measure: ({ measure }) => {
    measure('task', onEnd => {
      Task.Resolved(5).fork(null, onEnd);
    });
  },
});


// Bencho.benchmark('Task vs Promise - map', {
//   repeat: 10,
//   keys: ['task', 'promise'],
//   threshold: {
//     time: 85,
//     memory: 90,
//   },
//   measure: ({ measure }) => {
//     const increment = x => x + 1;

//     measure('task', onEnd => {
//       Task.Resolved(5)
//         .map(increment)
//         .map(increment)
//         .map(increment)
//         .map(increment)
//         .map(increment)
//         .map(increment)
//         .map(increment)
//         .map(increment)
//         .map(increment)
//         .map(increment)
//         .fork(null, onEnd);
//     });
  
//     measure('promise', onEnd => {
//       Promise.resolve(5)
//         .then(increment)
//         .then(increment)
//         .then(increment)
//         .then(increment)
//         .then(increment)
//         .then(increment)
//         .then(increment)
//         .then(increment)
//         .then(increment)
//         .then(increment)
//         .then(onEnd);
//     });
//   },
// });


// Bencho.benchmark('Task vs Promise - chain', {
//   repeat: 10,
//   keys: ['task', 'promise'],
//   threshold: {
//     time: 70,
//     memory: 80,
//   },
//   measure: ({ measure }) => {
//     measure('task', onEnd => {
//       const increment = x => Task.Resolved(x + 1);
//       Task.Resolved(5)
//         .chain(increment)
//         .chain(increment)
//         .chain(increment)
//         .chain(increment)
//         .chain(increment)
//         .chain(increment)
//         .chain(increment)
//         .chain(increment)
//         .chain(increment)
//         .chain(increment)
//         .fork(null, onEnd);
//     });
  
//     measure('promise', onEnd => {
//       const increment = x => Promise.resolve(x + 1);
//       Promise.resolve(5)
//         .then(increment)
//         .then(increment)
//         .then(increment)
//         .then(increment)
//         .then(increment)
//         .then(increment)
//         .then(increment)
//         .then(increment)
//         .then(increment)
//         .then(increment)
//         .then(onEnd);
//     });
//   },
// });


// Bencho.benchmark('Task vs Promise - parallel', {
//   repeat: 10,
//   keys: ['task', 'promise'],
//   threshold: {
//     time: 20,
//     memory: 50,
//   },
//   measure: ({ measure }) => {
//     measure('task', onEnd => {
//       const t1 = Task((_, res) => res(5));
//       const t2 = Task((_, res) => setTimeout(res, 10));
//       parallel([ t1, t2 ]).fork(null, onEnd);
//     });
  
//     measure('promise', onEnd => {
//       const p1 = new Promise(res => res(5));
//       const p2 = new Promise(res => setTimeout(res, 10));
//       Promise.all([ p1, p2 ]).then(onEnd);
//     });
//   },
// });


// Bencho.benchmark('Task vs Promise - mapRejected', {
//   repeat: 10,
//   keys: ['task', 'promise'],
//   threshold: {
//     time: 50,
//     memory: 50,
//   },
//   measure: ({ measure }) => {
//     measure('task', onEnd => {
//       const increment = x => x + 1;
//       Task.Rejected(5)
//         .mapRejected(increment)
//         .fork(onEnd);
//     });
  
//     measure('promise', onEnd => {
//       const increment = x => Promise.reject(x + 1);
//       Promise.reject(5)
//         .catch(increment)
//         .catch(onEnd);
//     });
//   },
// });


