import { createStore } from 'redux';
import Store from '../src/Store';

describe('Store effect', () => {

  describe('.dispatch', () => {

    it('should dispatch action passed to it', done => {
      function *program() {
        yield Store.dispatch({ type: 'Yo', payload: { a: 'b' } });
        yield Store.dispatch({ type: 'Broo', payload: { c: 'd' } });
        yield Store.dispatch({ type: 'Done' });
      }

      const reducer = (state, action) => {
        switch(action.type) {
        case 'Yo':
          return expect(action.payload).toEqual({ a: 'b' });
        case 'Bro':
          return expect(action.payload).toEqual({ c: 'd' });
        case 'Done':
          return done();
        }
      };

      Store.of(createStore(reducer))
        .run(program)
        .fork(done, () => {});
    });
  });

  describe('.getState', () => {

    it('should get the state from the redux store', done => {
      function *program() {
        const before = yield Store.getState();
        yield Store.dispatch({ type: '++' });
        yield Store.dispatch({ type: '++' });
        yield Store.dispatch({ type: '++' });
        yield Store.dispatch({ type: '++' });
        yield Store.dispatch({ type: '--' });
        const after = yield Store.getState();
        yield Store.dispatch({ type: 'Done', payload: { before, after } });
      }

      const reducer = (state = 0, action) => {
        switch(action.type) {
        case '++': return state + 1;
        case '--': return state - 1;
        case 'Done':
          expect(state).toBe(3);
          expect(action.payload).toEqual({ before: 0, after: 3 });
          return done();
        default: return state;
        }
      };

      Store.of(createStore(reducer))
        .run(program)
        .fork(done, () => {});
    });
  });

  describe('.selectState', () => {

    it('should select the required value from the state', done => {
      function *program() {
        const before = yield Store.selectState(state => state.count);
        yield Store.dispatch({ type: '++' });
        yield Store.dispatch({ type: '++' });
        yield Store.dispatch({ type: '++' });
        yield Store.dispatch({ type: '++' });
        yield Store.dispatch({ type: '--' });
        const after = yield Store.selectState();
        yield Store.dispatch({ type: 'Done', payload: { before, after } });
      }

      const reducer = (state = { count: 0 }, action) => {
        switch(action.type) {
        case '++': return { count: state.count + 1 };
        case '--': return { count: state.count - 1 };
        case 'Done':
          expect(state).toEqual({ count: 3 });
          expect(action.payload).toEqual({ before: 0, after: { count: 3 } });
          return done();
        default: return state;
        }
      };

      Store.of(createStore(reducer))
        .run(program)
        .fork(done, () => {});
    });
  });
});
