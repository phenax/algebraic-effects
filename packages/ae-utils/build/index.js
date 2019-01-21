"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.identity = exports.compose = exports.pointfreeMethod = void 0;

// pointfreeMethod :: String -> (...a) -> Object(with methodName :: ...a -> b) -> b
var pointfreeMethod = function pointfreeMethod(methodName) {
  return function () {
    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return function (x) {
      return x[methodName].apply(x, args);
    };
  };
}; // compose :: (...Function) -> Function


exports.pointfreeMethod = pointfreeMethod;

var compose = function compose() {
  return Array.prototype.slice.call(arguments).reduce(function (a, b) {
    return function () {
      return a(b.apply(void 0, arguments));
    };
  });
}; // identity :: a -> a


exports.compose = compose;

var identity = function identity(x) {
  return x;
};

exports.identity = identity;