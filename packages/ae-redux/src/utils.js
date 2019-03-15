
import { createSymbol } from '@algebraic-effects/utils';

export const AE_REDUX_ACTION = createSymbol('algebraic-effects/redux-action');

export const decorateAction = action => {
  action && (action.$$type = AE_REDUX_ACTION);
  return action;
};

export const isEffectfulAction = action => action ? action.$$type === AE_REDUX_ACTION : false;

export const filterAction = (filter, action) => {
  if (!action) return false;
  if (isEffectfulAction(action)) return false;
  if (typeof filter === 'string') return filter === action.type;
  if (typeof filter === 'function') return filter(action);
  return false;
};
