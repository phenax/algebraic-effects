"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = exports.scheduler = void 0;

var _core = require("@algebraic-effects/core");

var raf = window.requestAnimationFrame || function (fn) {
  return setTimeout(fn, 16);
};

var getRic = function getRic() {
  return window.requestIdleCallback || raf;
};

;
var Scheduler = (0, _core.createEffect)('Scheduler', {
  waitForNextFrame: (0, _core.func)(),
  waitForIdle: (0, _core.func)(['?options']),
  waitFor: (0, _core.func)(['delay'])
});
var scheduler = Scheduler.handler({
  waitForNextFrame: function waitForNextFrame(o) {
    return function () {
      return raf(o.resume);
    };
  },
  waitForIdle: function waitForIdle(o) {
    return function (options) {
      return getRic()(o.resume, options);
    };
  },
  waitFor: function waitFor(o) {
    return function (time) {
      return setTimeout(o.resume, time);
    };
  }
});
exports.scheduler = scheduler;
var _default = Scheduler;
exports["default"] = _default;