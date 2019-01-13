"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.run = exports.composeHandlers = exports.composeEffects = exports.createEffect = void 0;

var _utils = require("./utils");

var _operations = _interopRequireDefault(require("./operations"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

// type Runner = (GeneratorFunction, ...a) -> Promise
// createRunner :: (Object Function) -> Runner
var createRunner = function createRunner() {
  var handlers = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

  // TODO: Validate if all handlers are specified
  var runner = function runner(generator) {
    for (var _len = arguments.length, args = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
      args[_key - 1] = arguments[_key];
    }

    return new Promise(function (resolve, reject) {
      var g = generator.apply(void 0, args);

      var throwError = function throwError(x) {
        g.return(x);
        reject(x);
      };

      var end = function end(x) {
        g.return(x);
        resolve(x);
      };

      var resume = function resume() {
        var _g$next = g.next.apply(g, arguments),
            value = _g$next.value,
            done = _g$next.done;

        if (done) return end(value);

        if ((0, _utils.isOperation)(value)) {
          var effectHandler = handlers[value.name] || _operations.default[value.name];
          effectHandler(resume, end, throwError).apply(void 0, _toConsumableArray(value.payload));
        } else {
          var _effectHandler = handlers._ || _utils.VALUE_HANDLER;

          _effectHandler(resume, end, throwError)(value);
        }
      };

      return resume();
    });
  };

  runner.concat = function (run1) {
    return createRunner(_objectSpread({}, handlers, run1.handlers));
  };

  runner.handlers = handlers;
  runner.run = run;
  return runner;
}; // createEffect :: (String, Object *) -> Effect


var createEffect = function createEffect(name, operations) {
  var effectful = {
    name: name,
    operations: operations,
    handler: createRunner
  };
  Object.keys(operations).forEach(function (name) {
    effectful[name] = (0, _utils.Operation)(name, operations[name]);
  });
  return effectful;
}; // composeEffects :: ...Effect -> Effect


exports.createEffect = createEffect;

var composeEffects = function composeEffects() {
  for (var _len2 = arguments.length, effects = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
    effects[_key2] = arguments[_key2];
  }

  var name = "Effect(".concat(effects.map(function (_ref) {
    var name = _ref.name;
    return name;
  }).join(', '), ")");
  var operations = effects.reduce(function (acc, eff) {
    return _objectSpread({}, acc, eff.operations);
  }, {});
  return createEffect(name, operations);
}; // composeHandlers :: ...Runner -> Runner


exports.composeEffects = composeEffects;

var composeHandlers = function composeHandlers() {
  for (var _len3 = arguments.length, runners = new Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
    runners[_key3] = arguments[_key3];
  }

  return runners.reduce(function (acc, r) {
    return acc.concat(r);
  });
}; // run :: Runner


exports.composeHandlers = composeHandlers;
var run = createRunner();
exports.run = run;