"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _utils = require("@algebraic-effects/utils");

var _pointfree = require("./pointfree");

;
;

var Task = function Task(taskFn) {
  var forkTask = function forkTask() {
    var isCancelled = false;
    var isDone = false;
    var args = arguments;

    function parseOptions() {
      if (args.length === 1 && args[0] && (args[0].Resolved || args[0].Rejected || args[0].Cancelled)) {
        return args[0];
      }

      return {
        Rejected: args[0],
        Resolved: args[1],
        Cancelled: args[2]
      };
    }

    function guardOptns(o) {
      function guard(cb) {
        return function () {
          isCancelled || isDone || !cb ? null : cb.apply(void 0, arguments);
          isDone = true;
        };
      }

      return {
        Rejected: guard(o.Rejected),
        Resolved: guard(o.Resolved),
        Cancelled: guard(o.Cancelled)
      };
    }

    var optns = guardOptns(parseOptions());
    var cleanup = taskFn(optns.Rejected, optns.Resolved, cancelTask);

    function cancelTask() {
      cleanup && cleanup.apply(null, arguments);
      optns.Cancelled.apply(null, arguments);
      isCancelled = true;
    }

    return cancelTask;
  };

  var fold = function fold(mapErr, mapVal) {
    return Task(function (_, res) {
      return forkTask((0, _utils.compose2)(res, mapErr), (0, _utils.compose2)(res, mapVal));
    });
  };

  var foldRejected = function foldRejected(mapErr, mapVal) {
    return Task(function (rej) {
      return forkTask((0, _utils.compose2)(rej, mapErr), (0, _utils.compose2)(rej, mapVal));
    });
  };

  var bimap = function bimap(mapErr, mapVal) {
    return Task(function (rej, res) {
      return forkTask((0, _utils.compose2)(rej, mapErr), (0, _utils.compose2)(res, mapVal));
    });
  };

  var chain = function chain(fn) {
    return Task(function (rej, res) {
      return forkTask(rej, (0, _utils.compose2)((0, _pointfree.fork)(rej, res), fn));
    });
  };

  return {
    fork: forkTask,
    chain: chain,
    bimap: bimap,
    map: function map(fn) {
      return bimap(_utils.identity, fn);
    },
    mapRejected: function mapRejected(fn) {
      return bimap(fn, _utils.identity);
    },
    fold: fold,
    foldRejected: foldRejected,
    resolveWith: function resolveWith(value) {
      return fold((0, _utils.constant)(value), (0, _utils.constant)(value));
    },
    rejectWith: function rejectWith(err) {
      return foldRejected((0, _utils.constant)(err), (0, _utils.constant)(err));
    },
    empty: Task.Empty,
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

Task.Rejected = function (err) {
  return Task(function (reject) {
    return reject(err);
  });
};

Task.of = Task.Resolved;

Task.fromPromise = function (factory) {
  var args = arguments;
  return Task(function (rej, res) {
    return factory.apply(null, [].slice.call(args, 1)).then(res)["catch"](rej);
  });
};

var _default = Task;
exports["default"] = _default;