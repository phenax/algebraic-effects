"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _core = require("@algebraic-effects/core");

var _utils = require("@algebraic-effects/utils");

var _utils2 = require("./utils");

var Store = (0, _core.createEffect)('Store', {
  dispatch: (0, _core.func)(['action']),
  getState: (0, _core.func)([], 'state'),
  selectState: (0, _core.func)(['?state -> a'], 'a'),
  getAction: (0, _core.func)([], 'action'),
  waitFor: (0, _core.func)(['actionType | Action -> Boolean'])
});

Store.of = function (_ref) {
  var _ref$store = _ref.store,
      _dispatch = _ref$store.dispatch,
      _getState = _ref$store.getState,
      action = _ref.action;
  return Store.handler({
    dispatch: function dispatch(_ref2) {
      var resume = _ref2.resume;
      return (0, _utils.compose)(resume, _dispatch, _utils2.decorateAction);
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
    getAction: function getAction(_ref5) {
      var resume = _ref5.resume;
      return function () {
        return resume(action);
      };
    },
    waitFor: function waitFor(_ref6) {
      var resume = _ref6.resume,
          end = _ref6.end;
      return function (filter) {
        return (0, _utils2.filterAction)(filter, action) ? resume(action) : end(action);
      };
    }
  });
};

var _default = Store;
exports.default = _default;