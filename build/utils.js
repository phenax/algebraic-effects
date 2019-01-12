"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Operation = exports.isOperation = exports.VALUE_HANDLER = exports.OPERATION = void 0;
var OPERATION = Symbol.for('algebraic-effects/operation'); // VALUE_HANDLER :: Operation

exports.OPERATION = OPERATION;

var VALUE_HANDLER = function VALUE_HANDLER(_, end) {
  return function (x) {
    return end(x);
  };
}; // isOperation :: Operation? -> Boolean


exports.VALUE_HANDLER = VALUE_HANDLER;

var isOperation = function isOperation(x) {
  return x && x.$$type === OPERATION;
}; // type Operation = ...a -> { name :: String, payload :: a }


exports.isOperation = isOperation;

var Operation = function Operation(name) {
  return function () {
    for (var _len = arguments.length, payload = new Array(_len), _key = 0; _key < _len; _key++) {
      payload[_key] = arguments[_key];
    }

    return {
      name: name,
      payload: payload,
      $$type: OPERATION
    };
  };
};

exports.Operation = Operation;