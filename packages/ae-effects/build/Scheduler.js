"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _core = require("@algebraic-effects/core");

var raf = window.requestAnimationFrame || function (fn) {
  return setTimeout(fn, 16);
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
  waitForNextFrame: function waitForNextFrame(o) {
    return function () {
      return raf(o.resume);
    };
  },
  waitForIdle: function waitForIdle(o) {
    return function (options) {
      return ric()(o.resume, options);
    };
  },
  waitFor: function waitFor(o) {
    return function (time) {
      return setTimeout(o.resume, time);
    };
  }
});
var _default = Scheduler;
exports["default"] = _default;