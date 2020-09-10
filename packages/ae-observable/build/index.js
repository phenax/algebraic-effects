"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = exports.interval = exports.range = exports.of = void 0;

var _utils = require("@algebraic-effects/utils");

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

;
;
;
;

var createObservable = function createObservable(taskFn) {
  var subscribe = function subscribe(options) {
    var isCancelled = false;
    var isComplete = false;
    var parseOptions = _utils.identity;

    function guardOptns(o) {
      function guard(cb) {
        return function () {
          return isCancelled || isComplete || !cb ? null : cb.apply(void 0, arguments);
        };
      }

      return {
        onError: guard(o.onError),
        onNext: guard(o.onNext),
        onComplete: guard(o.onComplete)
      };
    }

    var optns = guardOptns(parseOptions(options));
    var subscription = {
      get isCancelled() {
        return isCancelled;
      },

      unsubscribe: function unsubscribe() {},
      resolve: function resolve(x) {
        return (0, _utils.compose2)(subscription.complete, subscription.next)(x);
      },
      next: optns.onNext,
      throwError: optns.onError,
      complete: function complete(value) {
        optns.onComplete(subscription, value);
        isComplete = true;
      }
    };
    var cleanup = taskFn(subscription);

    function cancelTask() {
      cleanup && cleanup.apply(null, arguments);
      optns.onComplete.apply(null, arguments);
      isCancelled = true;
    }

    subscription.unsubscribe = cancelTask;
    return subscription;
  };

  var extend = function extend() {
    var fn = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : _utils.identity;
    return createObservable(function (sub) {
      return subscribe(fn({
        onNext: sub.next,
        onError: sub.throwError,
        onComplete: function onComplete(_, x) {
          return sub.complete(x);
        }
      })).unsubscribe;
    });
  };

  var map = function map(fn) {
    return extend(function (options) {
      return _objectSpread(_objectSpread({}, options), {}, {
        onNext: (0, _utils.compose2)(options.onNext, fn)
      });
    });
  };

  var merge = function merge(obs) {
    return createObservable(function (sub) {
      var completionCount = 0;

      var onComplete = function onComplete() {
        completionCount++;

        if (completionCount >= 2) {
          sub.complete();
        }
      };

      var unsub1 = subscribe({
        onNext: sub.next,
        onError: sub.throwError,
        onComplete: onComplete
      });
      var unsub2 = obs.subscribe({
        onNext: sub.next,
        onError: sub.throwError,
        onComplete: onComplete
      });
      return function () {
        unsub1();
        unsub2();
      };
    });
  };

  return {
    subscribe: subscribe,
    map: map,
    merge: merge,
    tap: function tap(fn) {
      return map(function (x) {
        fn(x);
        return x;
      });
    },
    filter: function filter(fn) {
      return extend(function (options) {
        return _objectSpread(_objectSpread({}, options), {}, {
          onNext: (0, _utils.ifElse)(fn, options.onNext, _utils.noop)
        });
      });
    },
    chain: function chain(fn) {
      return extend(function (options) {
        return _objectSpread(_objectSpread({}, options), {}, {
          onNext: (0, _utils.compose2)(function (o) {
            return o.subscribe(_objectSpread(_objectSpread({}, options), {}, {
              onNext: options.onNext,
              onComplete: _utils.noop
            }));
          }, fn)
        });
      });
    },
    propagateTo: function propagateTo(errFn, nextFn) {
      return extend(function (options) {
        return _objectSpread(_objectSpread({}, options), {}, {
          onError: (0, _utils.compose2)(options.onNext, errFn),
          onNext: (0, _utils.compose2)(options.onNext, nextFn)
        });
      });
    }
  };
};

var of = function of() {
  for (var _len = arguments.length, items = new Array(_len), _key = 0; _key < _len; _key++) {
    items[_key] = arguments[_key];
  }

  return createObservable(function (sub) {
    items.forEach(function (x) {
      return sub.next(x);
    });
    sub.complete();
  });
};

exports.of = of;

var range = function range(a, b) {
  return createObservable(function (sub) {
    Array(b - a).fill(null).forEach(function (_, index) {
      sub.next(a + index);
    });
    sub.complete();
  });
};

exports.range = range;

var interval = function interval(delay) {
  return createObservable(function (sub) {
    var timer = setInterval(sub.next, delay, null);
    return function () {
      return clearInterval(timer);
    };
  });
};

exports.interval = interval;
var _default = createObservable;
exports["default"] = _default;