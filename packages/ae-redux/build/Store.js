"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _core = require("@algebraic-effects/core");

var _utils = require("@algebraic-effects/utils");

var Store = (0, _core.createEffect)('Store', {
  dispatch: (0, _core.func)(['action']),
  getState: (0, _core.func)([], 'state'),
  selectState: (0, _core.func)(['?state -> a'], 'a'),
  waitFor: (0, _core.func)(['actionType'])
});

Store.of = function (_ref) {
  var subscribe = _ref.subscribe,
      _dispatch = _ref.dispatch,
      _getState = _ref.getState;
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
    waitFor: function waitFor(_ref5) {
      var resume = _ref5.resume,
          end = _ref5.end;
      return function (type) {};
    }
  });
};

var _default = Store;
exports.default = _default;