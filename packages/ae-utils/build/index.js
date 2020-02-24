"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.maybe = exports.constant = exports.identity = exports.flatten = exports.isArray = exports.compose2 = exports.compose = exports.pointfree = exports.isGenerator = exports.createSymbol = exports.createSymbolObject = void 0;
var symbolObjectPool = {};

var createSymbolObject = function createSymbolObject(name) {
  symbolObjectPool[name] = symbolObjectPool[name] || {
    name: name
  };
  return symbolObjectPool[name];
};

exports.createSymbolObject = createSymbolObject;

var createSymbol = function createSymbol(key) {
  return typeof Symbol === 'function' ? Symbol["for"](key) : createSymbolObject(key);
};

exports.createSymbol = createSymbol;

var isGenerator = function isGenerator(p) {
  return p && p.constructor && (p.constructor.name + '').indexOf('GeneratorFunction') !== -1;
};

exports.isGenerator = isGenerator;

var pointfree = function pointfree(methodName) {
  return function () {
    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return function (x) {
      return x[methodName].apply(x, args);
    };
  };
};

exports.pointfree = pointfree;

var compose = function compose() {
  for (var _len2 = arguments.length, args = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
    args[_key2] = arguments[_key2];
  }

  return args.reduce(function (a, b) {
    return function (x) {
      return a(b(x));
    };
  });
};

exports.compose = compose;

var compose2 = function compose2(a, b) {
  return compose(a, b);
};

exports.compose2 = compose2;

var isArray = Array.isArray || function (a) {
  return {}.toString.call(a) == '[object Array]';
};

exports.isArray = isArray;

var flatten = function flatten(arr) {
  return arr.reduce(function (list, item) {
    return list.concat(isArray(item) ? item : [item]);
  }, []);
};

exports.flatten = flatten;

var identity = function identity(x) {
  return x;
};

exports.identity = identity;

var constant = function constant(x) {
  return function () {
    return x;
  };
};

exports.constant = constant;
;
var maybe = {
  just: function just(x) {
    return {
      map: function map(fn) {
        return maybe.just(fn(x));
      },
      fold: function fold(_, m) {
        return m(x);
      }
    };
  },
  nothing: function nothing() {
    return {
      map: function map(_) {
        return maybe.nothing();
      },
      fold: function fold(j, _) {
        return j();
      }
    };
  }
};
exports.maybe = maybe;