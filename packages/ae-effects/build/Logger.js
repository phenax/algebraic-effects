"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _core = require("@algebraic-effects/core");

var Logger = (0, _core.createEffect)('Logger', {
  log: (0, _core.func)(['label', 'data'], 'data'),
  message: (0, _core.func)(['...msg']),
  info: (0, _core.func)(['info']),
  error: (0, _core.func)(['e']),
  warn: (0, _core.func)(['e'])
});

Logger.from = function (loggerInterface) {
  var noop = function noop() {};

  var logger = loggerInterface || {
    log: function log(_, d) {
      return d;
    },
    error: noop,
    warn: noop,
    info: noop
  };
  return Logger.handler({
    log: function log(o) {
      return function (label, data) {
        logger.log(label, data);
        o.resume(data);
      };
    },
    message: function message(o) {
      return function () {
        return o.resume(logger.log.apply(logger, arguments));
      };
    },
    info: function info(o) {
      return function (str) {
        return o.resume(logger.info(str));
      };
    },
    error: function error(o) {
      return function (e) {
        return o.resume(logger.error(e));
      };
    },
    warn: function warn(o) {
      return function (e) {
        return o.resume(logger.warn(e));
      };
    }
  });
};

var _default = Logger;
exports.default = _default;