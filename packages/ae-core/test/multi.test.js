import { State } from '@algebraic-effects/effects';
import { createEffect, func } from '../src';
import { sleep, call } from '../src/generic';

describe('Multiple continuations', () => {
  const LoopEffect = createEffect('LoopEffect', {
    takeItem: func(['list'], '*', { isMulti: true }),
  });

  it('should do synchronous mutliple continuations', done => {
    const runner = LoopEffect.handler({
      takeItem: ({ resume }) => list => list.forEach(resume),
    });

    function *program() {
      const item1 = yield LoopEffect.takeItem([ 1, 2 ]);
      const item2 = yield LoopEffect.takeItem([ 3, 4 ]);

      return item1 + item2;
    }

    runner
      .runMulti(program)
      .fork(
        done,
        data => {
          expect(data).toEqual([4, 5, 5, 6]);
          done();
        },
      );
  });

  it('should do synchronous mutliple continuations with state', done => {
    const runner = LoopEffect.handler({
      takeItem: ({ resume }) => list => list.forEach(resume),
    });

    function *program() {
      yield State.set(3);

      const item1 = yield LoopEffect.takeItem([ 1, 2 ]);
      const item2 = yield LoopEffect.takeItem([ 3, 4 ]);

      yield State.update(c => c + item1);
      yield State.update(c => c + item2);

      return yield State.get();
    }

    runner
      .with(State.of(0))
      .runMulti(program)
      .fork(
        done,
        sums => {
          expect(sums).toHaveLength(4);
          expect(sums[3]).toEqual(23);
          expect(sums).toEqual([7, 12, 17, 23]);
          done();
        },
      );
  });
});