"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _2 = require(".");

// Exception :: Effect
var Exception = (0, _2.createEffect)('Exception', {
  throw: [] // NOTE: Unneccassary api

}); // Exception.try :: Runner

Exception.try = Exception.handler({
  throw: function _throw(_, __, throwE) {
    return function (e) {
      return throwE(e);
    };
  }
});
var _default = Exception;
exports.default = _default;