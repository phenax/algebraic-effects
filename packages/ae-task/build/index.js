"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _utils = require("@algebraic-effects/utils");

var _pointfree = require("./pointfree");

// Task (constructor) :: ((RejectFn, ResolveFn) -> ()) -> Task e a
var Task = function Task(taskFn) {
  // forkTask :: (e -> (), b -> ()) -> CancelFunction
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
        return function (a) {
          isCancelled || isDone || !cb ? null : cb(a);
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
  }; // fold :: (e -> b, a -> b) -> Task () b


  var fold = function fold(mapErr, mapVal) {
    return Task(function (_, res) {
      return forkTask((0, _utils.compose)(res, mapErr), (0, _utils.compose)(res, mapVal));
    });
  }; // foldReject :: (e -> b, a -> b) -> Task () b


  var foldReject = function foldReject(mapErr, mapVal) {
    return Task(function (rej) {
      return forkTask((0, _utils.compose)(rej, mapErr), (0, _utils.compose)(rej, mapVal));
    });
  }; // bimap :: (e -> e', a -> a') -> Task e' a'


  var bimap = function bimap(mapErr, mapVal) {
    return Task(function (rej, res) {
      return forkTask((0, _utils.compose)(rej, mapErr), (0, _utils.compose)(res, mapVal));
    });
  }; // chain :: (a -> Task a') -> Task e a'


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
        return forkTask(rej, res);
      });
    }
  };
}; // Task.Empty :: () -> Task


Task.Empty = function () {
  return Task((0, _utils.constant)(null));
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
    return factory.apply(null, [].slice.call(_arguments, 1)).then(res)["catch"](rej);
  });
};

var _default = Task;
exports["default"] = _default;