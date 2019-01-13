"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.func = exports.Operation = exports.isOperation = exports.VALUE_HANDLER = exports.OPERATION = void 0;

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function _iterableToArrayLimit(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

var OPERATION = Symbol.for('algebraic-effects/operation'); // VALUE_HANDLER :: Operation

exports.OPERATION = OPERATION;

var VALUE_HANDLER = function VALUE_HANDLER(_ref) {
  var end = _ref.end;
  return function (x) {
    return end(x);
  };
}; // isOperation :: Operation? -> Boolean


exports.VALUE_HANDLER = VALUE_HANDLER;

var isOperation = function isOperation(x) {
  return x && x.$$type === OPERATION;
};

exports.isOperation = isOperation;

var validateArguments = function validateArguments(args, values) {
  if (!args) return true;
  var dynamicArgs = args.filter(function (a) {
    return /^(\.{3}|\?)/.test(a);
  }); // Dynamic args (...)

  if (dynamicArgs.length) return args.length - dynamicArgs.length <= values.length;
  return args.length === values.length;
}; // type Operation = ...a -> { name :: String, payload :: a }


var Operation = function Operation(name) {
  var _ref2 = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [],
      _ref3 = _slicedToArray(_ref2, 1),
      args = _ref3[0];

  return function () {
    for (var _len = arguments.length, payload = new Array(_len), _key = 0; _key < _len; _key++) {
      payload[_key] = arguments[_key];
    }

    if (!validateArguments(args, payload)) {
      throw new Error("The operation ".concat(name, " expected ").concat(args.length, " arguments, but got ").concat(payload.length, " arguments"));
    }

    return {
      name: name,
      payload: payload,
      $$type: OPERATION
    };
  };
};

exports.Operation = Operation;

var func = function func(args, ret) {
  return [args, ret];
};

exports.func = func;