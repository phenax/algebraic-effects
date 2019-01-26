"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.addGlobalOperation = exports.background = exports.parallel = exports.race = exports.call = exports.runTask = exports.awaitPromise = exports.resolve = exports.sleep = void 0;

var _fns = require("@algebraic-effects/task/fns");

var _utils = require("@algebraic-effects/utils");

var _utils2 = require("./utils");

// handleTask :: (...a -> Task e b) -> FlowOperators -> (...a) -> CancelFunction
var handleTask = function handleTask(fn) {
  return function (o) {
    return function () {
      return fn(o).apply(void 0, arguments).fork(o.throwError, o.resume);
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
  awaitPromise: function awaitPromise(_ref2) {
    var resume = _ref2.resume,
        throwError = _ref2.throwError;
    return function (promise) {
      return promise.then(resume).catch(throwError);
    };
  },
  runTask: function runTask(_ref3) {
    var resume = _ref3.resume,
        throwError = _ref3.throwError;
    return function (t) {
      return t.fork(throwError, resume);
    };
  },
  call: handleTask(function (_ref4) {
    var call = _ref4.call;
    return function (p) {
      for (var _len = arguments.length, a = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
        a[_key - 1] = arguments[_key];
      }

      return call.apply(void 0, [p].concat(a));
    };
  }),
  resolve: function resolve(_ref5) {
    var end = _ref5.end;
    return function (v) {
      return end(v);
    };
  },
  race: handleTask(function (_ref6) {
    var call = _ref6.call;
    return function (programs) {
      return (0, _fns.race)(programs.map(function (p) {
        return call(p);
      }));
    };
  }),
  parallel: handleTask(function (_ref7) {
    var call = _ref7.call;
    return function (programs) {
      return (0, _fns.parallel)(programs.map(function (p) {
        return call(p);
      }));
    };
  }),
  background: function background(_ref8) {
    var call = _ref8.call,
        resume = _ref8.resume;
    return function (p) {
      for (var _len2 = arguments.length, a = new Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
        a[_key2 - 1] = arguments[_key2];
      }

      return resume(call.apply(void 0, [p].concat(a)).fork(_utils.identity, _utils.identity));
    };
  }
}; // * :: Operation

var sleep = (0, _utils2.Operation)('sleep', (0, _utils2.func)(['duration']));
exports.sleep = sleep;
var resolve = (0, _utils2.Operation)('resolve', (0, _utils2.func)(['*']));
exports.resolve = resolve;
var awaitPromise = (0, _utils2.Operation)('awaitPromise', (0, _utils2.func)(['promise e a'], 'a'));
exports.awaitPromise = awaitPromise;
var runTask = (0, _utils2.Operation)('runTask', (0, _utils2.func)(['task e a'], 'a'));
exports.runTask = runTask;
var call = (0, _utils2.Operation)('call', (0, _utils2.func)(['generator ...a b', '...a'], 'b'));
exports.call = call;
var race = (0, _utils2.Operation)('race', (0, _utils2.func)(['...(generator ...a b)'], 'b'));
exports.race = race;
var parallel = (0, _utils2.Operation)('parallel', (0, _utils2.func)(['...(generator ...a b)'], '[b]'));
exports.parallel = parallel;
var background = (0, _utils2.Operation)('background', (0, _utils2.func)(['...(generator ...a b)'], '[b]')); // addGlobalOperation :: (String, Function, Runner) -> Operation

exports.background = background;

var addGlobalOperation = function addGlobalOperation(name, signature, handler) {
  globalOpHandlers[name] = handler;
  return (0, _utils2.Operation)(name, signature);
};

exports.addGlobalOperation = addGlobalOperation;
var _default = globalOpHandlers;
exports.default = _default;