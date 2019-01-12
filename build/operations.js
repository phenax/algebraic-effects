"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.awaitPromise = exports.sleep = void 0;

var _utils = require("./utils");

// * :: Operation
var sleep = (0, _utils.Operation)('sleep');
exports.sleep = sleep;
var awaitPromise = (0, _utils.Operation)('awaitPromise');
exports.awaitPromise = awaitPromise;
var _default = {
  sleep: function sleep(resume) {
    return function (duration) {
      return setTimeout(resume, duration);
    };
  },
  awaitPromise: function awaitPromise(resume, _, throwE) {
    return function (promise) {
      return promise.then(resume).catch(throwE);
    };
  }
};
exports.default = _default;