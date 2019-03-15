"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.filterAction = exports.isEffectfulAction = exports.decorateAction = exports.AE_REDUX_ACTION = void 0;

var _utils = require("@algebraic-effects/utils");

var AE_REDUX_ACTION = (0, _utils.createSymbol)('algebraic-effects/redux-action');
exports.AE_REDUX_ACTION = AE_REDUX_ACTION;

var decorateAction = function decorateAction(action) {
  action && (action.$$type = AE_REDUX_ACTION);
  return action;
};

exports.decorateAction = decorateAction;

var isEffectfulAction = function isEffectfulAction(action) {
  return action ? action.$$type === AE_REDUX_ACTION : false;
};

exports.isEffectfulAction = isEffectfulAction;

var filterAction = function filterAction(filter, action) {
  if (!action) return false;
  if (isEffectfulAction(action)) return false;
  if (typeof filter === 'string') return filter === action.type;
  if (typeof filter === 'function') return filter(action);
  return false;
};

exports.filterAction = filterAction;