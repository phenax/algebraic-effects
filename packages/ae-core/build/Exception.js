"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _ = require(".");

// Exception :: Effect
var Exception = (0, _.createEffect)('Exception', {
  throw: (0, _.func)(['error'])
}); // Exception.try :: Runner

Exception.try = Exception.handler({
  throw: function _throw(_ref) {
    var throwError = _ref.throwError;
    return function (e) {
      return throwError(e);
    };
  }
});
var _default = Exception;
exports.default = _default;