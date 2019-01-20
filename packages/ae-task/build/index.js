"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

// compose :: (...Function) -> Function
var compose = function compose() {
  for (var _len = arguments.length, fns = new Array(_len), _key = 0; _key < _len; _key++) {
    fns[_key] = arguments[_key];
  }

  return fns.reduce(function (a, b) {
    return function () {
      return a(b.apply(void 0, arguments));
    };
  });
}; // identity :: a -> a


var identity = function identity(x) {
  return x;
}; // Task (constructor) :: ((RejectFn, ResolveFn) -> ()) -> Task


var Task = function Task(taskFn) {
  var isCancelled = false;

  var guard = function guard(cb) {
    return function (a) {
      return isCancelled ? null : cb(a);
    };
  };

  var globalCleanup = function globalCleanup() {
    return isCancelled = true;
  };

  var fork = function fork(onFailure, onSuccess) {
    try {
      var cleanup = taskFn(guard(onFailure), guard(onSuccess));
      return compose(globalCleanup, cleanup || identity);
    } catch (e) {
      return guard(onFailure)(e), globalCleanup;
    }
  };

  var fold = function fold(mapErr, mapVal) {
    return Task(function (_, res) {
      return fork(compose(res, mapErr), compose(res, mapVal));
    });
  };

  var bimap = function bimap(mapErr, mapVal) {
    return Task(function (rej, res) {
      return fork(compose(rej, mapErr), compose(res, mapVal));
    });
  };

  var map = function map(fn) {
    return bimap(identity, fn);
  };

  var mapRejected = function mapRejected(fn) {
    return bimap(fn, identity);
  };

  var chain = function chain(fn) {
    return Task(function (reject, resolve) {
      return fork(reject, function (b) {
        return fn(b).fork(reject, resolve);
      });
    });
  };

  var instance = {
    fork: fork,
    map: map,
    mapRejected: mapRejected,
    bimap: bimap,
    fold: fold,
    chain: chain,
    resolveWith: Task.resolve,
    rejectWith: Task.reject,
    empty: Task.empty
  };
  return instance;
};

Task.empty = function () {
  return Task(function () {});
};

Task.resolve = function (data) {
  return Task(function (_, resolve) {
    return resolve(data);
  });
};

Task.reject = function (data) {
  return Task(function (reject) {
    return reject(data);
  });
};

Task.of = Task.resolve;
var _default = Task;
exports.default = _default;