"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _core = require("@algebraic-effects/core");

var raf = function raf() {
  return window.requestAnimationFrame || function (fn) {
    return setTimeout(fn, 16);
  };
};

var ric = function ric() {
  return window.requestIdleCallback || raf;
};

var Scheduler = (0, _core.createEffect)('Scheduler', {
  waitForNextFrame: (0, _core.func)(),
  waitForIdle: (0, _core.func)(['?options']),
  waitFor: (0, _core.func)(['delay'])
});
Scheduler.scheduler = Scheduler.handler({
  waitForNextFrame: function waitForNextFrame(_ref) {
    var resume = _ref.resume;
    return function () {
      return raf()(resume);
    };
  },
  waitForIdle: function waitForIdle(_ref2) {
    var resume = _ref2.resume;
    return function (options) {
      return ric()(resume, options);
    };
  },
  waitFor: function waitFor(_ref3) {
    var resume = _ref3.resume;
    return function (time) {
      return setTimeout(resume, time);
    };
  }
});
var _default = Scheduler;
exports.default = _default;