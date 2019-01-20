"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

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
}; // Task (constructor) :: ((RejectFn, ResolveFn) -> ()) -> Task e a


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

    var cleanup = taskFn(guard(onFailure), guard(onSuccess)) || identity;
    return compose(globalCleanup, cleanup);
  }; // fold :: (e -> b, a -> b) -> Task () b


  var fold = function fold(mapErr, mapVal) {
    return Task(function (_, res) {
      return fork(compose(res, mapErr), compose(res, mapVal));
    });
  }; // bimap :: (e -> e', a -> a') -> Task e' a'


  var bimap = function bimap(mapErr, mapVal) {
    return Task(function (rej, res) {
      return fork(compose(rej, mapErr), compose(res, mapVal));
    });
  }; // chain :: (a -> Task a') -> Task e a'


  var chain = function chain(fn) {
    return Task(function (reject, resolve) {
      return fork(reject, function (b) {
        return fn(b).fork(reject, resolve);
      });
    });
  }; // map :: (a -> a') -> Task e a'


  var map = function map(fn) {
    return bimap(identity, fn);
  }; // mapRejected :: (e -> e') -> Task e' a


  var mapRejected = function mapRejected(fn) {
    return bimap(fn, identity);
  };

  return {
    fork: fork,
    map: map,
    mapRejected: mapRejected,
    bimap: bimap,
    fold: fold,
    chain: chain,
    resolveWith: Task.resolved,
    rejectWith: Task.rejected,
    empty: Task.empty,
    // toPromise :: () -> Promise e a
    toPromise: function toPromise() {
      return new Promise(function (res, rej) {
        return fork(rej, res);
      });
    }
  };
}; // Task.empty :: () -> Task


Task.empty = function () {
  return Task(function () {});
}; // Task.resolved :: a -> Task () a


Task.resolved = function (data) {
  return Task(function (_, resolve) {
    return resolve(data);
  });
}; // Task.rejected :: e -> Task e ()


Task.rejected = function (data) {
  return Task(function (reject) {
    return reject(data);
  });
}; // Task.of :: e -> Task e ()


Task.of = Task.resolved; // Task.fromPromise :: (() -> Promise e a) -> Task e a

Task.fromPromise = function (factory) {
  return Task(function (rej, res) {
    return factory().then(res).catch(rej);
  });
}; // Task.race :: [Task e a] -> Task e a


Task.race = function (tasks) {
  return Task(function (rej, res) {
    return tasks.forEach(function (t) {
      return t.fork(rej, res);
    });
  });
};

Task.series = function (tasks) {
  return tasks.reduce(function (task, t) {
    return task.chain(function (d) {
      return t.map(function (x) {
        return [].concat(_toConsumableArray(d), [x]);
      });
    });
  }, Task.resolved([]));
};

Task.parallel = function (tasks) {
  return Task(function (reject, resolve) {
    var cummulatedData = [];

    var onResolve = function onResolve(index) {
      return function (data) {
        cummulatedData[index] = {
          data: data
        };
        if (cummulatedData.filter(Boolean).length === tasks.length) resolve(cummulatedData.map(function (d) {
          return d.data;
        }));
      };
    };

    tasks.forEach(function (task, index) {
      return task.fork(reject, onResolve(index));
    });
  });
};

var _default = Task;
exports.default = _default;