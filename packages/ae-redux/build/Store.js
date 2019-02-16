"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _core = require("@algebraic-effects/core");

var _generic = require("@algebraic-effects/core/generic");

var _utils = require("@algebraic-effects/utils");

var Store = (0, _core.createEffect)('Store', {
  dispatch: (0, _core.func)(['action']),
  getState: (0, _core.func)([], 'state'),
  selectState: (0, _core.func)(['?state -> a'], 'a'),
  take: (0, _core.func)(['actionType | Action -> Boolean'])
});

Store.of = function (_ref) {
  var _ref$store = _ref.store,
      _dispatch = _ref$store.dispatch,
      _getState = _ref$store.getState,
      action = _ref.action;
  return Store.handler({
    dispatch: function dispatch(_ref2) {
      var resume = _ref2.resume;
      return (0, _utils.compose)(resume, _dispatch);
    },
    getState: function getState(_ref3) {
      var resume = _ref3.resume;
      return (0, _utils.compose)(resume, _getState);
    },
    selectState: function selectState(_ref4) {
      var resume = _ref4.resume;
      return function (fn) {
        return (0, _utils.compose)(resume, fn || _utils.identity, _getState)();
      };
    },
    take: function take(_ref5) {
      var resume = _ref5.resume,
          end = _ref5.end;
      return function (filter) {
        var isMatch = function isMatch() {
          if (!action) return false;
          if (typeof filter === 'string') return filter === action.type;
          if (typeof filter === 'function') return filter(action);
          return false;
        };

        return isMatch() ? resume(action) : end(action);
      };
    }
  });
};

var _default = Store;
exports.default = _default;