"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = exports.tryCatch = void 0;

var _core = require("@algebraic-effects/core");

var Exception = (0, _core.createEffect)('Exception', {
  "throw": (0, _core.func)(['error'])
});
var tryCatch = Exception.handler({
  "throw": function _throw(o) {
    return o.throwError;
  }
});
exports.tryCatch = tryCatch;
var _default = Exception;
exports["default"] = _default;