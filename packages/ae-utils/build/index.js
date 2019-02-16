"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.identity = exports.compose = exports.pointfree = exports.isGenerator = exports.createSymbol = exports.createSymbolObject = void 0;
var symbolObjectPool = {};

var createSymbolObject = function createSymbolObject(name) {
  if (symbolObjectPool[name]) return symbolObjectPool[name];
  symbolObjectPool[name] = {
    name: name
  };
  return symbolObjectPool[name];
};

exports.createSymbolObject = createSymbolObject;

var createSymbol = function createSymbol(key) {
  return typeof Symbol === 'function' ? Symbol.for(key) : createSymbolObject(key);
};

exports.createSymbol = createSymbol;

var isGenerator = function isGenerator(p) {
  return p.constructor === regeneratorRuntime.mark(function _callee() {
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
          case "end":
            return _context.stop();
        }
      }
    }, _callee, this);
  })().constructor;
};

exports.isGenerator = isGenerator;

var pointfree = function pointfree(methodName) {
  return function () {
    var _arguments = arguments;
    return function (x) {
      return x[methodName].apply(x, _arguments);
    };
  };
};

exports.pointfree = pointfree;

var compose = function compose() {
  return Array.prototype.slice.call(arguments).reduce(function (a, b) {
    return function () {
      return a(b.apply(void 0, arguments));
    };
  });
};

exports.compose = compose;

var identity = function identity(x) {
  return x;
};

exports.identity = identity;