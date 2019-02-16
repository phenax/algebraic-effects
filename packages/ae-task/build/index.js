"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _utils = require("@algebraic-effects/utils");

var _pointfree = require("./pointfree");

var Task = function Task(taskFn) {
  var forkTask = function forkTask(onFailure, onSuccess) {
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
  };

  var fold = function fold(mapErr, mapVal) {
    return Task(function (_, res) {
      return forkTask((0, _utils.compose)(res, mapErr), (0, _utils.compose)(res, mapVal));
    });
  };

  var bimap = function bimap(mapErr, mapVal) {
    return Task(function (rej, res) {
      return forkTask((0, _utils.compose)(rej, mapErr), (0, _utils.compose)(res, mapVal));
    });
  };

  var chain = function chain(fn) {
    return Task(function (rej, res) {
      return forkTask(rej, (0, _utils.compose)((0, _pointfree.fork)(rej, res), fn));
    });
  };

  return {
    fork: forkTask,
    bimap: bimap,
    fold: fold,
    chain: chain,
    resolveWith: Task.Resolved,
    rejectWith: Task.Rejected,
    empty: Task.Empty,
    map: function map(fn) {
      return bimap(_utils.identity, fn);
    },
    mapRejected: function mapRejected(fn) {
      return bimap(fn, _utils.identity);
    },
    toPromise: function toPromise() {
      return new Promise(function (res, rej) {
        return forkTask(rej, res);
      });
    }
  };
};

Task.Empty = function () {
  return Task(function () {});
};

Task.Resolved = function (data) {
  return Task(function (_, resolve) {
    return resolve(data);
  });
};

Task.Rejected = function (data) {
  return Task(function (reject) {
    return reject(data);
  });
};

Task.of = Task.Resolved;

Task.fromPromise = function (factory) {
  var _arguments = arguments;
  return Task(function (rej, res) {
    return factory.apply(null, Array.prototype.slice.call(_arguments, 1)).then(res).catch(rej);
  });
};

var _default = Task;
exports.default = _default;