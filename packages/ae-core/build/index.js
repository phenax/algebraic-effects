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

var _task = _interopRequireDefault(require("@algebraic-effects/task"));

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
var isIterator = function isIterator(p) {
  return !!p[Symbol.iterator];
}; // runProgram :: (Program, ...a) -> Iterator


var runProgram = function runProgram(program) {
  for (var _len = arguments.length, args = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
    args[_key - 1] = arguments[_key];
  }

  var p = program.constructor.name === 'GeneratorFunction' ? program.apply(void 0, args) : program;
  if (!isIterator(p)) throw new Error('Cant run program. Invalid generator');
  return p;
}; // createRunner :: (Object Function, { effect :: String }) -> Runner


var createRunner = function createRunner() {
  var handlers = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

  var _ref = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},
      effect = _ref.effect;

  var valueHandler = handlers._ || _utils.VALUE_HANDLER;

  var effectRunner = function effectRunner(p) {
    for (var _len2 = arguments.length, args = new Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
      args[_key2 - 1] = arguments[_key2];
    }

    var resultPromise = (0, _task.default)(function (reject, resolve) {
      var program = runProgram.apply(void 0, [p].concat(args)); // throwError :: * -> ()

      var throwError = function throwError(x) {
        program.return(x);
        !resultPromise.isCancelled && reject(x);
      }; // end  :: * -> ()


      var end = function end(x) {
        program.return(x);
        !resultPromise.isCancelled && resolve(x);
      }; // nextValue :: (Program, *) -> { value :: *, done :: Boolean }


      var nextValue = function nextValue(program, returnVal) {
        try {
          return program.next(returnVal);
        } catch (e) {
          throwError(e);
          return {
            done: true
          };
        }
      }; // resume :: * -> ()


      var resume = function resume(x) {
        if (resultPromise.isCancelled) return program.return(null);

        var call = function call(p) {
          for (var _len3 = arguments.length, a = new Array(_len3 > 1 ? _len3 - 1 : 0), _key3 = 1; _key3 < _len3; _key3++) {
            a[_key3 - 1] = arguments[_key3];
          }

          return effectRunner.apply(void 0, [p].concat(a));
        };

        var promise = function promise(_promise) {
          return _promise.then(resume).catch(throwError);
        };

        var flowOperators = {
          resume: resume,
          end: end,
          throwError: throwError,
          call: call,
          promise: promise
        };

        var _nextValue = nextValue(program, x),
            value = _nextValue.value,
            done = _nextValue.done;

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

      setTimeout(resume, 0);
      return function () {
        return resultPromise.isCancelled = true;
      };
    });
    resultPromise.isCancelled = false;
    return resultPromise;
  };

  effectRunner.effectName = effect || 'GlobalEffect';
  effectRunner.handlers = handlers; // concat, with :: Runner -> Runner

  effectRunner.concat = function (run1) {
    return createRunner(_objectSpread({}, handlers, run1.handlers), {
      effect: "".concat(effectRunner.effectName, ".").concat(run1.effectName)
    });
  };

  effectRunner.with = effectRunner.concat; // run :: Runner

  effectRunner.run = effectRunner;
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
  for (var _len4 = arguments.length, effects = new Array(_len4), _key4 = 0; _key4 < _len4; _key4++) {
    effects[_key4] = arguments[_key4];
  }

  var name = effects.map(function (_ref2) {
    var name = _ref2.name;
    return "".concat(name);
  }).join('.');
  var operations = effects.reduce(function (acc, eff) {
    return _objectSpread({}, acc, eff.operations);
  }, {});
  return createEffect(name, operations);
}; // composeHandlers :: ...Runner -> Runner


exports.composeEffects = composeEffects;

var composeHandlers = function composeHandlers() {
  for (var _len5 = arguments.length, runners = new Array(_len5), _key5 = 0; _key5 < _len5; _key5++) {
    runners[_key5] = arguments[_key5];
  }

  return runners.reduce(function (a, b) {
    return a.concat(b);
  });
}; // run :: Runner


exports.composeHandlers = composeHandlers;
var run = createRunner();
exports.run = run;