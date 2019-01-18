"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "func", {
  enumerable: true,
  get: function get() {
    return _utils.func;
  }
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

// type Program = GeneratorFunction
// type Runner = (Program, ...a) -> Promise
// createRunner :: (Object Function, { effect :: String }) -> Runner
var createRunner = function createRunner() {
  var handlers = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

  var _ref = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},
      effect = _ref.effect;

  var valueHandler = handlers._ || _utils.VALUE_HANDLER;

  var effectRunner = function effectRunner(program) {
    for (var _len = arguments.length, args = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
      args[_key - 1] = arguments[_key];
    }

    return new Promise(function (resolve, reject) {
      var g = program.apply(void 0, args);
      effectRunner.isCancelled = false; // throwError :: * -> ()

      var throwError = function throwError(x) {
        g.return(x);
        !effectRunner.isCancelled && reject(x);
      }; // end  :: * -> ()


      var end = function end(x) {
        g.return(x);
        !effectRunner.isCancelled && resolve(x);
      }; // resume :: * -> ()


      var resume = function resume(x) {
        if (effectRunner.isCancelled) return g.return(null);

        var call = function call() {
          return effectRunner.apply(void 0, arguments).then(resume).catch(throwError);
        };

        var flowOperators = {
          resume: resume,
          end: end,
          throwError: throwError,
          call: call
        };

        var _g$next = g.next(x),
            value = _g$next.value,
            done = _g$next.done;

        if (done) return valueHandler(flowOperators)(value);

        if ((0, _utils.isOperation)(value)) {
          var runOp = handlers[value.name] || _operations.default[value.name];

          if (!runOp) {
            throwError(new Error("Invalid operation executed. The handler for operation \"".concat(value.name, "\", was not provided")));
            return;
          }

          runOp(flowOperators).apply(void 0, _toConsumableArray(value.payload));
        } else {
          valueHandler(flowOperators)(value);
        }
      };

      return resume();
    });
  };

  effectRunner.isCancelled = false;
  effectRunner.effectName = effect || 'Unknown';
  effectRunner.handlers = handlers; // concat, with :: Runner -> Runner

  effectRunner.concat = function (run1) {
    return createRunner(_objectSpread({}, handlers, run1.handlers), {
      effect: "".concat(effectRunner.effectName, ".").concat(run1.effectName)
    });
  };

  effectRunner.with = effectRunner.concat; // run :: Runner

  effectRunner.run = effectRunner; // cancel :: () -> ()

  effectRunner.cancel = function () {
    return effectRunner.isCancelled = true;
  };

  return effectRunner;
}; // createEffect :: (String, Object *) -> Effect


var createEffect = function createEffect(name, operations) {
  return _objectSpread({
    name: name,
    operations: operations,
    handler: function handler(handlers) {
      return createRunner(handlers, {
        effect: name
      });
    }
  }, Object.keys(operations).reduce(function (acc, name) {
    return _objectSpread({}, acc, _defineProperty({}, name, (0, _utils.Operation)(name, operations[name])));
  }, {}));
}; // composeEffects :: ...Effect -> Effect


exports.createEffect = createEffect;

var composeEffects = function composeEffects() {
  for (var _len2 = arguments.length, effects = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
    effects[_key2] = arguments[_key2];
  }

  var name = effects.map(function (_ref2) {
    var name = _ref2.name;
    return "".concat(name).replace('.', '_');
  }).join('.');
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

  return runners.reduce(function (a, b) {
    return a.concat(b);
  });
}; // run :: Runner


exports.composeHandlers = composeHandlers;
var run = createRunner({}, {
  effect: 'GlobalRunner'
});
exports.run = run;