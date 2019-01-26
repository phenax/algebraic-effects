"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.identity = exports.compose = exports.pointfree = void 0;

// pointfree :: String -> (...a) -> Object(with methodName :: ...a -> b) -> b
var pointfree = function pointfree(methodName) {
  return function () {
    var _arguments = arguments;
    return function (x) {
      return x[methodName].apply(x, _arguments);
    };
  };
}; // compose :: (...Function) -> Function


exports.pointfree = pointfree;

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