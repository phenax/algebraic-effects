"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.func = exports.Operation = exports.isOperation = exports.VALUE_HANDLER = exports.HANDLER = exports.OPERATION = void 0;

var _utils = require("@algebraic-effects/utils");

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function _iterableToArrayLimit(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

var OPERATION = (0, _utils.createSymbol)('algebraic-effects/operation');
exports.OPERATION = OPERATION;
var HANDLER = (0, _utils.createSymbol)('algebraic-effects/handler');
exports.HANDLER = HANDLER;

var VALUE_HANDLER = function VALUE_HANDLER(_ref) {
  var end = _ref.end;
  return function (x) {
    return end(x);
  };
};

exports.VALUE_HANDLER = VALUE_HANDLER;

var isOperation = function isOperation(x) {
  return x && x.$$type === OPERATION;
};

exports.isOperation = isOperation;

var validateArguments = function validateArguments(args, values) {
  if (!args) return true;
  var dynamicArgs = args.filter(function (a) {
    return /^(\.{3}|\?)/.test(a);
  });
  if (dynamicArgs.length) return args.length - dynamicArgs.length <= values.length;
  return args.length === values.length;
};

var Operation = function Operation(name, _ref2) {
  var _ref3 = _slicedToArray(_ref2, 3),
      args = _ref3[0],
      returnType = _ref3[1],
      _ref3$ = _ref3[2];

  _ref3$ = _ref3$ === void 0 ? {} : _ref3$;
  var _ref3$$isMulti = _ref3$.isMulti,
      isMulti = _ref3$$isMulti === void 0 ? false : _ref3$$isMulti;

  var op = function op() {
    for (var _len = arguments.length, payload = new Array(_len), _key = 0; _key < _len; _key++) {
      payload[_key] = arguments[_key];
    }

    if (!validateArguments(args, payload)) throw new Error("ArgumentError. The operation ".concat(name, " expected ").concat(args.length, " arguments, but got ").concat(payload.length, " arguments"));
    return {
      name: name,
      payload: payload,
      isMulti: isMulti,
      $$type: OPERATION,
      toString: toString
    };
  };

  op.toString = function () {
    return "func ".concat(name, "(").concat(args.join(', '), ") -> ").concat(returnType);
  };

  return op;
};

exports.Operation = Operation;

var func = function func(args, ret, options) {
  return [args, ret, options];
};

exports.func = func;