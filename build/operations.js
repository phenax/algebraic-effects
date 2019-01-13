"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.call = exports.awaitPromise = exports.sleep = void 0;

var _utils = require("./utils");

// * :: Operation
var sleep = (0, _utils.Operation)('sleep', (0, _utils.func)(['duration']));
exports.sleep = sleep;
var awaitPromise = (0, _utils.Operation)('awaitPromise', (0, _utils.func)(['promise a'], 'a'));
exports.awaitPromise = awaitPromise;
var call = (0, _utils.Operation)('call', (0, _utils.func)(['generator ...a b', '...a'], 'promise b'));
exports.call = call;
var _default = {
  sleep: function sleep(_ref) {
    var resume = _ref.resume;
    return function (duration) {
      return setTimeout(resume, duration);
    };
  },
  awaitPromise: function awaitPromise(_ref2) {
    var resume = _ref2.resume,
        throwError = _ref2.throwError;
    return function (promise) {
      return promise.then(resume).catch(throwError);
    };
  },
  call: function call(_ref3) {
    var _call = _ref3.call;
    return _call;
  }
};
exports.default = _default;