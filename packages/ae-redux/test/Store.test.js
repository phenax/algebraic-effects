import { createStore } from 'redux';
import Store from '../src/Store';

describe('Store effect', () => {

  beforeEach(() => {
    global.jasmine.DEFAULT_TIMEOUT_INTERVAL = 500;
  });

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

      Store.of({ store: createStore(reducer) })
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

      Store.of({ store: createStore(reducer) })
        .run(program)
        .fork(done, () => {});
    });
  });

  describe('.getAction', () => {

    it('should select the required value from the state', done => {
      function *program() {
        const action = yield Store.getAction();
        yield Store.dispatch({ type: 'Done', payload: action });
      }

      const reducer = (state, action) => {
        switch(action.type) {
        case 'Done':
          expect(action.payload.type).toEqual('Hello world');
          return done();
        default: return state;
        }
      };

      const dispatch = action =>
        Store.of({ store: createStore(reducer), action })
          .run(program)
          .fork(done, () => {});

      dispatch({ type: 'Hello world' });
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

      Store.of({ store: createStore(reducer) })
        .run(program)
        .fork(done, () => {});
    });
  });

  describe('.waitFor', () => {

    function *program() {
      yield Store.waitFor('Hello');
      yield Store.dispatch({ type: 'Done', payload: 'World' });
    }

    const getStore = (done) => {
      const reducer = (state = 0, action) => {
        switch(action.type) {
        case 'Hello': return state;
        case 'Done':
          expect(action.payload).toBe('World');
          return done();
        default: return state;
        }
      };
  
      return createStore(reducer);
    };

    it('should only execute the rest of the program if the action type matches', done => {
      const store = getStore(done);
      const dispatch = action => {
        Store.of({ store, action })
          .run(program)
          .fork(done, () => {});
      };
      
      dispatch({ type: 'Hello' });
    });

    it('should skip the rest of the program if action type doesnt match', done => {
      const store = getStore(done);
      const dispatch = action => {
        Store.of({ store, action })
          .run(program)
          .fork(done, x => {
            expect(x.type).toBe('NotHello');
            done();
          });
      };

      dispatch({ type: 'NotHello' });
    });

    describe('with function filter', () => {
      function *program() {
        yield Store.waitFor(x => x.type === 'Hello');
        yield Store.dispatch({ type: 'Done', payload: 'World' });
      }

      it('should only execute the rest of the program if the action type matches', done => {
        const store = getStore(done);
        const dispatch = action => {
          Store.of({ store, action })
            .run(program)
            .fork(done, () => {});
        };
        
        dispatch({ type: 'Hello' });
      });
  
      it('should skip the rest of the program if action type doesnt match', done => {
        const store = getStore(done);
        const dispatch = action => {
          Store.of({ store, action })
            .run(program)
            .fork(done, x => {
              expect(x.type).toBe('NotHello');
              done();
            });
        };
  
        dispatch({ type: 'NotHello' });
      });
    });
  });
});
