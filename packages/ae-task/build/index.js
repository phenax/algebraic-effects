"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _utils = require("@algebraic-effects/utils");

var _pointfree = require("./pointfree");

var Task = function Task(taskFn) {
  var forkTask = function forkTask() {
    var isCancelled = false;
    var isDone = false;
    var args = arguments;

    function parseOptions() {
      if (args.length === 1 && args[0] && (args[0].onSuccess || args[0].onFailure || args[0].onCancel)) {
        return args[0];
      }

      return {
        onFailure: args[0],
        onSuccess: args[1],
        onCancel: args[2]
      };
    }

    function guardOptns(_ref) {
      var onFailure = _ref.onFailure,
          onSuccess = _ref.onSuccess,
          onCancel = _ref.onCancel;

      function guard(cb) {
        return function (a) {
          isCancelled || isDone || !cb ? null : cb(a);
          isDone = true;
        };
      }

      return {
        onFailure: guard(onFailure),
        onSuccess: guard(onSuccess),
        onCancel: guard(onCancel)
      };
    }

    var _guardOptns = guardOptns(parseOptions()),
        onFailure = _guardOptns.onFailure,
        onSuccess = _guardOptns.onSuccess,
        onCancel = _guardOptns.onCancel;

    var cleanup = taskFn(onFailure, onSuccess) || _utils.identity;

    function globalCleanup() {
      isCancelled = true;
    }

    var cancelTask = (0, _utils.compose)(globalCleanup, onCancel, cleanup);
    return cancelTask;
  };

  var fold = function fold(mapErr, mapVal) {
    return Task(function (_, res) {
      return forkTask((0, _utils.compose)(res, mapErr), (0, _utils.compose)(res, mapVal));
    });
  };

  var foldReject = function foldReject(mapErr, mapVal) {
    return Task(function (rej) {
      return forkTask((0, _utils.compose)(rej, mapErr), (0, _utils.compose)(rej, mapVal));
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
    foldReject: foldReject,
    chain: chain,
    resolveWith: function resolveWith(value) {
      return fold((0, _utils.constant)(value), (0, _utils.constant)(value));
    },
    rejectWith: function rejectWith(value) {
      return foldReject((0, _utils.constant)(value), (0, _utils.constant)(value));
    },
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
  return Task((0, _utils.constant)(null));
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