import { createEffect, func } from '@algebraic-effects/core';
import { compose, identity } from '@algebraic-effects/utils';
import { decorateAction, filterAction } from './utils';

const Store = createEffect('Store', {
  dispatch: func(['action']),
  getState: func([], 'state'),
  selectState: func(['?state -> a'], 'a'),
  getAction: func([], 'action'),
  waitFor: func(['actionType | Action -> Boolean']),
});

Store.of = ({ store: { dispatch, getState }, action }) => Store.handler({
  dispatch: ({ resume }) => compose(resume, dispatch, decorateAction),
  getState: ({ resume }) => compose(resume, getState),
  selectState: ({ resume }) => fn => compose(resume, fn || identity, getState)(),
  getAction: ({ resume }) => () => resume(action),
  waitFor: ({ resume, end }) => filter => filterAction(filter, action) ? resume(action) : end(action),
});

export default Store;
