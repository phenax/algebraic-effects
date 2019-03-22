"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "Operation", {
  enumerable: true,
  get: function get() {
    return _utils2.Operation;
  }
});
Object.defineProperty(exports, "func", {
  enumerable: true,
  get: function get() {
    return _utils2.func;
  }
});
Object.defineProperty(exports, "createGenericEffect", {
  enumerable: true,
  get: function get() {
    return _generic.createGenericEffect;
  }
});
exports.run = exports.composeHandlers = exports.createEffect = void 0;

var _task = _interopRequireDefault(require("@algebraic-effects/task"));

var _fns = require("@algebraic-effects/task/fns");

var _utils = require("@algebraic-effects/utils");

var _utils2 = require("./utils");

var _generic = _interopRequireWildcard(require("./generic"));

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var runProgram = function runProgram(program) {
  for (var _len = arguments.length, args = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
    args[_key - 1] = arguments[_key];
  }

  var p = program.constructor.name === 'GeneratorFunction' ? program.apply(void 0, args) : program;
  if (!(0, _utils.isGenerator)(p)) throw new Error('Not a valid program. You need to pass either a generator function or a generator instance');
  return p;
};

var operationName = function operationName(effect, op) {
  return effect ? "".concat(effect, "[").concat(op, "]") : op;
};

var getNextValue = function getNextValue(program, nextVal) {
  try {
    return program.next(nextVal);
  } catch (e) {
    return {
      done: true,
      error: e
    };
  }
};

var createHandler = function createHandler() {
  var _handlers = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

  var _ref = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},
      _ref$effect = _ref.effect,
      effect = _ref$effect === void 0 ? 'GenericEffect' : _ref$effect,
      _ref$isComposed = _ref.isComposed,
      isComposed = _ref$isComposed === void 0 ? false : _ref$isComposed;

  var valueHandler = _handlers._ || _utils2.VALUE_HANDLER;
  var handlers = isComposed ? _handlers : Object.keys(_handlers).reduce(function (acc, key) {
    return _objectSpread({}, acc, _defineProperty({}, operationName(effect, key), _handlers[key]));
  }, {});

  var evaluateYieldedValue = function evaluateYieldedValue(_ref2, flowOperators) {
    var value = _ref2.value,
        done = _ref2.done,
        error = _ref2.error;
    if (error) return flowOperators.throwError(error);
    if (done) return valueHandler(flowOperators)(value);

    if ((0, _utils2.isOperation)(value)) {
      var runOp = handlers[value.name] || _generic.default[value.name];

      if (!runOp) {
        flowOperators.throwError(new Error("Invalid operation executed. The handler for operation \"".concat(value.name, "\", was not provided")));
        return;
      }

      runOp(flowOperators).apply(void 0, _toConsumableArray(value.payload));
    } else {
      valueHandler(flowOperators)(value);
    }
  };

  var getTerminationOps = function getTerminationOps(_ref3) {
    var program = _ref3.program,
        task = _ref3.task,
        reject = _ref3.reject,
        resolve = _ref3.resolve,
        _ref3$mapResult = _ref3.mapResult,
        mapResult = _ref3$mapResult === void 0 ? _utils.identity : _ref3$mapResult;

    var throwError = function throwError(x) {
      program.return(x);
      !task.isCancelled && reject(x);
    };

    var end = function end() {
      var value = mapResult.apply(void 0, arguments);
      program.return(value);
      !task.isCancelled && resolve(value);
    };

    return {
      throwError: throwError,
      end: end
    };
  };

  var FlowOps = function FlowOps(_ref4) {
    var resume = _ref4.resume,
        end = _ref4.end,
        throwError = _ref4.throwError;

    var call = function call(p) {
      for (var _len2 = arguments.length, a = new Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
        a[_key2 - 1] = arguments[_key2];
      }

      return effectHandlerInstance.run.apply(effectHandlerInstance, [p].concat(a));
    };

    var callMulti = function callMulti(p) {
      for (var _len3 = arguments.length, a = new Array(_len3 > 1 ? _len3 - 1 : 0), _key3 = 1; _key3 < _len3; _key3++) {
        a[_key3 - 1] = arguments[_key3];
      }

      return effectHandlerInstance.runMulti.apply(effectHandlerInstance, [p].concat(a));
    };

    var promise = function promise(_promise) {
      return _promise.then(resume).catch(throwError);
    };

    return {
      resume: resume,
      end: end,
      throwError: throwError,
      call: call,
      callMulti: callMulti,
      promise: promise
    };
  };

  var effectHandlerInstance = function effectHandlerInstance(p) {
    for (var _len4 = arguments.length, args = new Array(_len4 > 1 ? _len4 - 1 : 0), _key4 = 1; _key4 < _len4; _key4++) {
      args[_key4 - 1] = arguments[_key4];
    }

    var task = (0, _task.default)(function (reject, resolve) {
      var program = runProgram.apply(void 0, [p].concat(args));

      var _getTerminationOps = getTerminationOps({
        program: program,
        task: task,
        reject: reject,
        resolve: resolve
      }),
          end = _getTerminationOps.end,
          throwError = _getTerminationOps.throwError;

      var resume = function resume(x) {
        if (task.isCancelled) return program.return(null);
        var isResumed = false;

        var resumeOperation = function resumeOperation() {
          if (task.isCancelled) return program.return(null);
          !isResumed && resume.apply(void 0, arguments);
          isResumed = true;
        };

        var flowOperators = FlowOps({
          resume: resumeOperation,
          end: end,
          throwError: throwError
        });
        evaluateYieldedValue(getNextValue(program, x), flowOperators);
      };

      setTimeout(resume, 0);
      return function () {
        return task.isCancelled = true;
      };
    });
    task.isCancelled = false;
    return task;
  };

  effectHandlerInstance.$$type = _utils2.HANDLER;
  effectHandlerInstance.effectName = effect;
  effectHandlerInstance.handlers = handlers;

  effectHandlerInstance.concat = function (run1) {
    return createHandler(_objectSpread({}, handlers, run1.handlers), {
      effect: "".concat(effectHandlerInstance.effectName, ".").concat(run1.effectName),
      isComposed: true
    });
  };

  effectHandlerInstance.with = function (runner) {
    return effectHandlerInstance.concat(runner.$$type === _utils2.HANDLER ? runner : createHandler(runner, {
      effect: ''
    }));
  };

  effectHandlerInstance.run = effectHandlerInstance;

  effectHandlerInstance.runMulti = function (p) {
    for (var _len5 = arguments.length, args = new Array(_len5 > 1 ? _len5 - 1 : 0), _key5 = 1; _key5 < _len5; _key5++) {
      args[_key5 - 1] = arguments[_key5];
    }

    var runInstance = function runInstance() {
      var value = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;
      var stateCache = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];
      var task = (0, _task.default)(function (reject, resolve) {
        var program = runProgram.apply(void 0, [p].concat(args));

        var cleanup = function cleanup() {};

        var results = [];
        stateCache.forEach(function (x) {
          return program.next(x);
        });

        var _getTerminationOps2 = getTerminationOps({
          program: program,
          task: task,
          reject: reject,
          resolve: resolve,
          mapResult: function mapResult() {
            for (var _len6 = arguments.length, x = new Array(_len6), _key6 = 0; _key6 < _len6; _key6++) {
              x[_key6] = arguments[_key6];
            }

            return [].concat(_toConsumableArray(results), x);
          }
        }),
            end = _getTerminationOps2.end,
            throwError = _getTerminationOps2.throwError;

        var resume = function resume(x) {
          if (task.isCancelled) return program.return(null);
          stateCache = [].concat(_toConsumableArray(stateCache), [x]);
          var iterationValue = getNextValue(program, x);
          var value = iterationValue.value;
          var isResumed = false;
          var pendingTasks = [];

          var resumeOperation = function resumeOperation(v) {
            if (task.isCancelled) return program.return(null);

            if ((0, _utils2.isOperation)(value) && value.isMulti) {
              if (isResumed) {
                pendingTasks.push(v);
              } else {
                isResumed = true;
                var cancelFn = runInstance(v, stateCache).fork(throwError, function (result) {
                  results = [].concat(_toConsumableArray(results), _toConsumableArray(result));
                  var tasks = pendingTasks.map(function (val) {
                    return runInstance(val, stateCache);
                  });
                  var cancelFn = (0, _fns.series)(tasks).fork(throwError, function (r) {
                    isResumed = false;
                    end.apply(void 0, _toConsumableArray((0, _utils.flatten)(r)));
                  });
                  cleanup = (0, _utils.compose)(cleanup, cancelFn);
                });
                cleanup = (0, _utils.compose)(cleanup, cancelFn);
              }
            } else if (!isResumed) {
              isResumed = true;
              resume(v);
            }
          };

          var flowOperators = FlowOps({
            resume: resumeOperation,
            end: end,
            throwError: throwError
          });
          evaluateYieldedValue(iterationValue, flowOperators);
        };

        setTimeout(resume, 0, value);
        return function () {
          task.isCancelled = true;
          cleanup();
        };
      });
      task.isCancelled = false;
      return task;
    };

    return runInstance();
  };

  return effectHandlerInstance;
};

var createEffect = function createEffect(name, operations) {
  return _objectSpread({
    name: name,
    operations: operations,
    handler: function handler(handlers) {
      return createHandler(handlers, {
        effect: name
      });
    },
    extendAs: function extendAs(newName, newOps) {
      return createEffect(newName, _objectSpread({}, operations, newOps));
    }
  }, Object.keys(operations).reduce(function (acc, opName) {
    return _objectSpread({}, acc, _defineProperty({}, opName, (0, _utils2.Operation)(operationName(name, opName), operations[opName])));
  }, {}));
};

exports.createEffect = createEffect;

var composeHandlers = function composeHandlers() {
  for (var _len7 = arguments.length, runners = new Array(_len7), _key7 = 0; _key7 < _len7; _key7++) {
    runners[_key7] = arguments[_key7];
  }

  return runners.reduce(function (a, b) {
    return a.concat(b);
  });
};

exports.composeHandlers = composeHandlers;
var run = createHandler();
exports.run = run;