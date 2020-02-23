"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = exports.createGenericEffect = exports.background = exports.parallel = exports.race = exports.callMulti = exports.call = exports.runTask = exports.awaitPromise = exports.cancel = exports.resolve = exports.sleep = void 0;

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
  sleep: function sleep(o) {
    return function (duration) {
      return setTimeout(o.resume, duration);
    };
  },
  awaitPromise: function awaitPromise(o) {
    return o.promise;
  },
  runTask: function runTask(o) {
    return function (t) {
      return t.fork(o.throwError, o.resume);
    };
  },
  call: handleTask(function (o) {
    return o.call;
  }),
  callMulti: handleTask(function (o) {
    return o.callMulti;
  }),
  resolve: function resolve(o) {
    return o.end;
  },
  cancel: function cancel(o) {
    return o.cancel;
  },
  race: handleTask(function (o) {
    return function (programs) {
      return (0, _fns.race)(programs.map(function (p) {
        return o.call(p);
      }));
    };
  }),
  parallel: handleTask(function (o) {
    return function (programs) {
      return (0, _fns.parallel)(programs.map(function (p) {
        return o.call(p);
      }));
    };
  }),
  background: function background(o) {
    return function () {
      var args = arguments;
      return o.resume(o.call.apply(null, args).fork(_utils.identity, _utils.identity));
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
exports["default"] = _default;