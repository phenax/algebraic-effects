"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _utils = require("@algebraic-effects/utils");

// Task (constructor) :: ((RejectFn, ResolveFn) -> ()) -> Task e a
var Task = function Task(taskFn) {
  // fork :: (e -> (), b -> ()) -> CancelFunction
  var fork = function fork(onFailure, onSuccess) {
    var isCancelled = false;
    var isDone = false;

    var guard = function guard(cb) {
      return function (a) {
        isCancelled || isDone ? null : cb(a);
        isDone = true;
      };
    };

    var globalCleanup = function globalCleanup() {
      return isCancelled = true;
    };

    var cleanup = taskFn(guard(onFailure), guard(onSuccess)) || _utils.identity;

    return (0, _utils.compose)(globalCleanup, cleanup);
  }; // fold :: (e -> b, a -> b) -> Task () b


  var fold = function fold(mapErr, mapVal) {
    return Task(function (_, res) {
      return fork((0, _utils.compose)(res, mapErr), (0, _utils.compose)(res, mapVal));
    });
  }; // bimap :: (e -> e', a -> a') -> Task e' a'


  var bimap = function bimap(mapErr, mapVal) {
    return Task(function (rej, res) {
      return fork((0, _utils.compose)(rej, mapErr), (0, _utils.compose)(res, mapVal));
    });
  }; // chain :: (a -> Task a') -> Task e a'


  var chain = function chain(fn) {
    return Task(function (reject, resolve) {
      return fork(reject, function (b) {
        return fn(b).fork(reject, resolve);
      });
    });
  };

  return {
    fork: fork,
    bimap: bimap,
    fold: fold,
    chain: chain,
    resolveWith: Task.Resolved,
    // TODO: Fix this to reolve/reject after the previous operations
    rejectWith: Task.Rejected,
    empty: Task.Empty,
    // map :: (a -> a') -> Task e a'
    map: function map(fn) {
      return bimap(_utils.identity, fn);
    },
    // mapRejected :: (e -> e') -> Task e' a
    mapRejected: function mapRejected(fn) {
      return bimap(fn, _utils.identity);
    },
    // toPromise :: () -> Promise e a
    toPromise: function toPromise() {
      return new Promise(function (res, rej) {
        return fork(rej, res);
      });
    },
    // toString :: () -> String
    toString: function toString() {
      return 'Task e a';
    }
  };
}; // Task.Empty :: () -> Task


Task.Empty = function () {
  return Task(function () {});
}; // Task.Resolved :: a -> Task () a


Task.Resolved = function (data) {
  return Task(function (_, resolve) {
    return resolve(data);
  });
}; // Task.Rejected :: e -> Task e ()


Task.Rejected = function (data) {
  return Task(function (reject) {
    return reject(data);
  });
}; // Task.of :: e -> Task e ()


Task.of = Task.Resolved; // Task.fromPromise :: ((...*) -> Promise e a, ...*) -> Task e a

Task.fromPromise = function (factory) {
  var _arguments = arguments;
  return Task(function (rej, res) {
    return factory.apply(null, Array.prototype.slice.call(_arguments, 1)).then(res).catch(rej);
  });
};

var _default = Task;
exports.default = _default;