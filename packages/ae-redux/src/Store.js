import { createEffect, func } from '@algebraic-effects/core';
import { call as callProgram } from '@algebraic-effects/core/generic';
import { compose, identity } from '@algebraic-effects/utils';

const Store = createEffect('Store', {
  dispatch: func(['action']),
  getState: func([], 'state'),
  selectState: func(['?state -> a'], 'a'),
  take: func(['actionType | Action -> Boolean']),
  // takeEvery: func(['actionType | Action -> Boolean', 'program', '...args']),
});

Store.of = ({ store: { dispatch, getState }, action }) => Store.handler({
  dispatch: ({ resume }) => compose(resume, dispatch),
  getState: ({ resume }) => compose(resume, getState),
  selectState: ({ resume }) => fn => compose(resume, fn || identity, getState)(),
  take: ({ resume, end }) => filter => {
    const isMatch = () => {
      if (!action) return false;
      if (typeof filter === 'string') return filter === action.type;
      if (typeof filter === 'function') return filter(action);
      return false;
    };

    return isMatch() ? resume(action) : end(action);
  },
  // takeEvery: ({ resume, call }) => (filter, program, ...args) => {
  //   call(function*() {
  //     yield Store.take(filter);
  //     yield callProgram(program, ...args);
  //   }).fork(() => {}, () => {});
  //   resume();
  // },
});

export default Store;
