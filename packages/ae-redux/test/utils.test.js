
import { decorateAction, AE_REDUX_ACTION, isEffectfulAction} from '../src/utils';

describe('decorateAction', () => {
  it('should attach a $$type property to given action', () => {

    const action = decorateAction({ type: 'wow', payload: { wow: 'wow' } });
    expect(action.$$type).toBe(AE_REDUX_ACTION);
  });

  it('should attach a $$type property for null or undefined cases, return as is', () => {
    expect(decorateAction(null)).toBe(null);
    expect(decorateAction(undefined)).toBe(undefined);
    expect(decorateAction(0)).toBe(0);
    expect(decorateAction('')).toBe('');
  });
});

describe('isEffectfulAction', () => {
  it('should return true for decorated actions, else false', () => {
    const action = { type: 'Hello', payload: 'World' };
    expect(isEffectfulAction(action)).toBe(false);
    expect(isEffectfulAction(decorateAction(action))).toBe(true);
  });

  it('should return false for empty values', () => {
    expect(isEffectfulAction(null)).toBe(false);
    expect(isEffectfulAction(undefined)).toBe(false);
    expect(isEffectfulAction(false)).toBe(false);
    expect(isEffectfulAction('')).toBe(false);
  });
});

