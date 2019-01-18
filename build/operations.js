"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.addGlobalOperation = exports.race = exports.resolve = exports.call = exports.awaitPromise = exports.sleep = exports.default = void 0;

var _utils = require("./utils");

// handlePromise :: (...a -> Promise b) -> FlowOperators -> (...a) -> Promise b
var handlePromise = function handlePromise(fn) {
  return function (o) {
    return function () {
      return fn(o).apply(void 0, arguments).then(o.resume).catch(o.throwError);
    };
  };
};

var globalOperations = {
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
  call: function call(_ref2) {
    var _call = _ref2.call;
    return _call;
  },
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
  })
};
var _default = globalOperations; // * :: Operation

exports.default = _default;
var sleep = (0, _utils.Operation)('sleep', (0, _utils.func)(['duration']));
exports.sleep = sleep;
var awaitPromise = (0, _utils.Operation)('awaitPromise', (0, _utils.func)(['promise a'], 'a'));
exports.awaitPromise = awaitPromise;
var call = (0, _utils.Operation)('call', (0, _utils.func)(['generator ...a b', '...a'], 'b'));
exports.call = call;
var resolve = (0, _utils.Operation)('resolve', (0, _utils.func)(['*']));
exports.resolve = resolve;
var race = (0, _utils.Operation)('race', (0, _utils.func)(['*'])); // addGlobalOperation :: (String, Function, Runner) -> Operation

exports.race = race;

var addGlobalOperation = function addGlobalOperation(name, signature, handler) {
  globalOperations[name] = handler;
  return (0, _utils.Operation)(name, signature);
};

exports.addGlobalOperation = addGlobalOperation;