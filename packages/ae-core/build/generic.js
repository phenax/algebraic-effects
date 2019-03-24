"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.createGenericEffect = exports.background = exports.parallel = exports.race = exports.callMulti = exports.call = exports.runTask = exports.awaitPromise = exports.cancel = exports.resolve = exports.sleep = void 0;

var _fns = require("@algebraic-effects/task/fns");

var _utils = require("@algebraic-effects/utils");

var _utils2 = require("./utils");

var handleTask = function handleTask(fn) {
  return function (o) {
    return function () {
      return fn(o).apply(void 0, arguments).fork(o.throwError, o.resume);
    };
  };
};

var genericOpHandlers = {
  sleep: function sleep(_ref) {
    var resume = _ref.resume;
    return function (duration) {
      return setTimeout(resume, duration);
    };
  },
  awaitPromise: function awaitPromise(_ref2) {
    var promise = _ref2.promise;
    return promise;
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
    return call;
  }),
  callMulti: handleTask(function (_ref5) {
    var callMulti = _ref5.callMulti;
    return callMulti;
  }),
  resolve: function resolve(_ref6) {
    var end = _ref6.end;
    return end;
  },
  cancel: function cancel(_ref7) {
    var _cancel = _ref7.cancel;
    return _cancel;
  },
  race: handleTask(function (_ref8) {
    var call = _ref8.call;
    return function (programs) {
      return (0, _fns.race)(programs.map(function (p) {
        return call(p);
      }));
    };
  }),
  parallel: handleTask(function (_ref9) {
    var call = _ref9.call;
    return function (programs) {
      return (0, _fns.parallel)(programs.map(function (p) {
        return call(p);
      }));
    };
  }),
  background: function background(_ref10) {
    var call = _ref10.call,
        resume = _ref10.resume;
    return function (p) {
      for (var _len = arguments.length, a = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
        a[_key - 1] = arguments[_key];
      }

      return resume(call.apply(void 0, [p].concat(a)).fork(_utils.identity, _utils.identity));
    };
  }
};
var sleep = (0, _utils2.Operation)('sleep', (0, _utils2.func)(['duration']));
exports.sleep = sleep;
var resolve = (0, _utils2.Operation)('resolve', (0, _utils2.func)(['*']));
exports.resolve = resolve;
var cancel = (0, _utils2.Operation)('cancel', (0, _utils2.func)(['*']));
exports.cancel = cancel;
var awaitPromise = (0, _utils2.Operation)('awaitPromise', (0, _utils2.func)(['promise e a'], 'a'));
exports.awaitPromise = awaitPromise;
var runTask = (0, _utils2.Operation)('runTask', (0, _utils2.func)(['task e a'], 'a'));
exports.runTask = runTask;
var call = (0, _utils2.Operation)('call', (0, _utils2.func)(['generator ...a b', '...a'], 'b'));
exports.call = call;
var callMulti = (0, _utils2.Operation)('callMulti', (0, _utils2.func)(['generator ...a b', '...a'], 'b', {
  isMulti: true
}));
exports.callMulti = callMulti;
var race = (0, _utils2.Operation)('race', (0, _utils2.func)(['...(generator ...a b)'], 'b', {
  isMulti: true
}));
exports.race = race;
var parallel = (0, _utils2.Operation)('parallel', (0, _utils2.func)(['...(generator ...a b)'], '[b]', {
  isMulti: true
}));
exports.parallel = parallel;
var background = (0, _utils2.Operation)('background', (0, _utils2.func)(['...(generator ...a b)'], '[b]', {
  isMulti: true
}));
exports.background = background;

var createGenericEffect = function createGenericEffect(name, signature, handler) {
  genericOpHandlers[name] = handler;
  return (0, _utils2.Operation)(name, signature);
};

exports.createGenericEffect = createGenericEffect;
var _default = genericOpHandlers;
exports.default = _default;