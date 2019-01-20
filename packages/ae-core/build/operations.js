"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.addGlobalOperation = exports.background = exports.parallel = exports.race = exports.call = exports.awaitPromise = exports.resolve = exports.sleep = void 0;

var _utils = require("./utils");

// handlePromise :: (...a -> Promise b) -> FlowOperators -> (...a) -> Promise b
var handlePromise = function handlePromise(fn) {
  return function (o) {
    return function () {
      return fn(o).apply(void 0, arguments).then(o.resume).catch(o.throwError);
    };
  };
};

var globalOpHandlers = {
  sleep: function sleep(_ref) {
    var resume = _ref.resume;
    return function (duration) {
      return setTimeout(resume, duration);
    };
  },
  awaitPromise: handlePromise(function () {
    return function (x) {
      return x;
    };
  }),
  call: handlePromise(function (_ref2) {
    var call = _ref2.call;
    return function (p) {
      for (var _len = arguments.length, a = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
        a[_key - 1] = arguments[_key];
      }

      return call.apply(void 0, [p].concat(a));
    };
  }),
  resolve: function resolve(_ref3) {
    var end = _ref3.end;
    return function (v) {
      return end(v);
    };
  },
  race: handlePromise(function (_ref4) {
    var call = _ref4.call;
    return function (programs) {
      return Promise.race(programs.map(function (p) {
        return call(p);
      }));
    };
  }),
  parallel: handlePromise(function (_ref5) {
    var call = _ref5.call;
    return function (programs) {
      return Promise.all(programs.map(function (p) {
        return call(p);
      }));
    };
  }),
  background: function background(_ref6) {
    var call = _ref6.call,
        resume = _ref6.resume;
    return function (p) {
      for (var _len2 = arguments.length, a = new Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
        a[_key2 - 1] = arguments[_key2];
      }

      return resume(call.apply(void 0, [p].concat(a)));
    };
  }
}; // * :: Operation

var sleep = (0, _utils.Operation)('sleep', (0, _utils.func)(['duration']));
exports.sleep = sleep;
var resolve = (0, _utils.Operation)('resolve', (0, _utils.func)(['*']));
exports.resolve = resolve;
var awaitPromise = (0, _utils.Operation)('awaitPromise', (0, _utils.func)(['promise a'], 'a'));
exports.awaitPromise = awaitPromise;
var call = (0, _utils.Operation)('call', (0, _utils.func)(['generator ...a b', '...a'], 'b'));
exports.call = call;
var race = (0, _utils.Operation)('race', (0, _utils.func)(['...(generator ...a b)'], 'b'));
exports.race = race;
var parallel = (0, _utils.Operation)('parallel', (0, _utils.func)(['...(generator ...a b)'], '[b]'));
exports.parallel = parallel;
var background = (0, _utils.Operation)('background', (0, _utils.func)(['...(generator ...a b)'], '[b]')); // addGlobalOperation :: (String, Function, Runner) -> Operation

exports.background = background;

var addGlobalOperation = function addGlobalOperation(name, signature, handler) {
  globalOpHandlers[name] = handler;
  return (0, _utils.Operation)(name, signature);
};

exports.addGlobalOperation = addGlobalOperation;
var _default = globalOpHandlers;
exports.default = _default;