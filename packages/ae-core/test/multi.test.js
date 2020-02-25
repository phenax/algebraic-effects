import State, { state } from '@algebraic-effects/effects/State';
import Exception, { tryCatch } from '@algebraic-effects/effects/Exception';
import { createEffect, func } from '../src';

describe('Multiple continuations', () => {
  const LoopEffect = createEffect('LoopEffect', {
    takeItem: func(['list'], '*', { isMulti: true }),
  });

  it('should do synchronous mutliple continuations', done => {
    const runner = LoopEffect.handler({
      takeItem: ({ resume }) => list => list.forEach(resume),
    });

    function *program() {
      const item1 = yield LoopEffect.takeItem([ 1, 4 ]);
      const item2 = yield LoopEffect.takeItem([ 2, 3 ]);

      return item1 + item2;
    }

    runner
      .runMulti(program)
      .fork(
        done,
        data => {
          expect(data).toEqual([ 3, 4, 6, 7 ]);
          done();
        },
      );
  });

  it('should do synchronous mutliple continuations with exception handling', done => {
    const runner = LoopEffect.handler({
      takeItem: ({ resume }) => list => list.forEach(resume),
    });

    function *program() {
      const item1 = yield LoopEffect.takeItem([ 1, 4 ]);
      const item2 = yield LoopEffect.takeItem([ 2, 3 ]);

      if (item1 === 4 && item2 == 3)
        yield Exception.throw(new Error('Erorry'));

      return [item1, item2];
    }

    runner
      .with(tryCatch)
      .runMulti(program)
      .fork(
        e => {
          expect(e.message).toBe('Erorry');
          done();
        },
        () => done('shouldnt be here'),
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
      .with(state(0))
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


  it('should do async mutliple continuations', done => {
    const runner = LoopEffect.handler({
      takeItem: ({ resume }) => list => list.forEach((x, i) => setTimeout(resume, 50 * (i + 1), x)),
    });

    let count = 0;

    function *program() {
      const item1 = yield LoopEffect.takeItem([ 1, 2 ]);
      const item2 = yield LoopEffect.takeItem([ 3, 4 ]);

      yield State.update(log => [...log, item1 + item2]);
      count = count + 1;

      const sumLog = yield State.get();
      if (sumLog.length === 4) {
        expect(sumLog).toEqual([4, 5, 5, 6]);
        done();
      }
    }

    runner
      .with(state([]))
      .runMulti(program)
      .fork(
        done,
        () => {},
      );
  });

  it('should do async mutliple continuations using value handler', done => {
    const runner = LoopEffect.handler({
      takeItem: ({ resume }) => list => list.forEach((x, i) => setTimeout(resume, 100 * i, x)),
    });

    let count = 0;

    function *program() {
      const item1 = yield LoopEffect.takeItem([ 1, 2 ]);
      const item2 = yield LoopEffect.takeItem([ 3, 4 ]);

      yield State.update(log => [...log, item1 + item2]);
      count = count + 1;

      return yield State.get();
    }

    runner
      .with(state([]))
      .with({
        _: ({ end }) => v => {
          if (v.length === 4) {
            expect(v).toEqual([4, 5, 5, 6]);
            done();
          }
          end();
        },
      })
      .runMulti(program)
      .fork(done);
  });

  it('should do sync mutlple continuation without multi ops', done => {
    function *program() {
      yield State.set(3);

      yield State.update(c => c + 1);
      yield State.update(c => c + 5);

      return yield State.get();
    }

    state(0)
      .runMulti(program)
      .fork(
        done,
        data => {
          expect(data).toEqual([9]);
          done();
        },
      );
  });

  it('should do synchronous mutliple continuations cancellations', done => {
    let cancel = () => {};
    const breakpoint = jest.fn((_, fn) => fn && fn());
    const runner = LoopEffect.handler({
      takeItem: ({ resume }) => list => list.forEach(resume),
    });

    function *program() {
      const item1 = yield LoopEffect.takeItem([ 1, 4 ]);

      breakpoint('1', cancel);

      const item2 = yield LoopEffect.takeItem([ 2, 3 ]);

      breakpoint('2');

      return item1 + item2;
    }

    cancel = runner
      .runMulti(program)
      .fork(
        done,
        () => done('Shouldnt have reached here'),
      );

    setTimeout(() => {
      expect(breakpoint.mock.calls).toHaveLength(1);
      done();
    }, 100);
  });

  describe('coin flip test', () => {
    const Coin = createEffect('Coin', {
      flip: func(['?times'], 'bool', { isMulti: true }),
    });

    const myCoin = Coin.handler({
      flip: ({ resume }) => (times = 1) => {
        Array(times).fill(null)
          .map((_, i) => i % 2) // Imagine this was Math.round(Math.random()) === 1
          .forEach(resume);
      },
    });

    function *randomness() {
      const isHead1 = yield Coin.flip(1);
      const isHead2 = yield Coin.flip(2);
      const isHead3 = yield Coin.flip(4);
    
      return [isHead1, isHead2, isHead3];
    }

    it('should generate a random set of states', done => {
      myCoin.runMulti(randomness).fork(
        done,
        data => {
          expect(data).toEqual([
            [ 0, 0, 0 ],
            [ 0, 0, 1 ],
            [ 0, 0, 0 ],
            [ 0, 0, 1 ],
            [ 0, 1, 0 ],
            [ 0, 1, 1 ],
            [ 0, 1, 0 ],
            [ 0, 1, 1 ],
          ]);
          done();
        }
      );
    });
  });
});
