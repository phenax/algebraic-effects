import { createEffect, func } from '@algebraic-effects/core';
import { compose, identity } from '@algebraic-effects/utils';

const Store = createEffect('Store', {
  dispatch: func(['action']),
  getState: func([], 'state'),
  selectState: func(['?state -> a'], 'a'),
  waitFor: func(['actionType']),
});

Store.of = ({ subscribe, dispatch, getState }) => Store.handler({
  dispatch: ({ resume }) => compose(resume, dispatch),
  getState: ({ resume }) => compose(resume, getState),
  selectState: ({ resume }) => fn => compose(resume, fn || identity, getState)(),
  waitFor: ({ resume, end }) => type => {
    // subscribe()
  },
});

export default Store;
