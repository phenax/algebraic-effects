"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.composeHandlers = composeHandlers;
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
exports.run = exports.createEffect = void 0;

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

function runProgram(program) {
  var args = [].slice.call(arguments, 1);
  var p = program.constructor.name === 'GeneratorFunction' ? program.apply(null, args) : program;
  if (!(0, _utils.isGenerator)(p)) throw new Error('Not a valid program. You need to pass either a generator function or a generator instance');
  return p;
}

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

var createHandler = function createHandler(_handlers, options) {
  _handlers = _handlers || {};

  var _ref = options || {},
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
        resolve = _ref3.resolve,
        _ref3$mapResult = _ref3.mapResult,
        mapResult = _ref3$mapResult === void 0 ? _utils.identity : _ref3$mapResult,
        cancelTask = _ref3.cancelTask;

    var throwError = function throwError(e) {
      return program.throw(e);
    };

    var end = function end() {
      var value = mapResult.apply(void 0, arguments);
      program.return(value);
      !task.isCancelled && resolve(value);
    };

    var cancel = function cancel(x) {
      program.return(x);
      cancelTask(x);
    };

    return {
      throwError: throwError,
      end: end,
      cancel: cancel
    };
  };

  var FlowOps = function FlowOps(o) {
    var call = effectHandlerInstance.run;
    var callMulti = effectHandlerInstance.runMulti;

    var promise = function promise(_promise) {
      return _promise.then(o.resume).catch(o.throwError);
    };

    return {
      resume: o.resume,
      end: o.end,
      throwError: o.throwError,
      cancel: o.cancel,
      call: call,
      callMulti: callMulti,
      promise: promise
    };
  };

  function effectHandlerInstance() {
    var args = arguments;
    var task = (0, _task.default)(function (reject, resolve, cancelTask) {
      var program = runProgram.apply(null, args);
      var termination = getTerminationOps({
        program: program,
        task: task,
        reject: reject,
        resolve: resolve,
        cancelTask: cancelTask
      });

      var resume = function resume(x) {
        if (task.isCancelled) return program.return(null);
        var isResumed = false;

        var resumeOperation = function resumeOperation(x) {
          if (task.isCancelled) return program.return(null);
          !isResumed && resume(x);
          isResumed = true;
        };

        var onError = function onError(e) {
          return tryNextValue(function () {
            return termination.throwError(e);
          });
        };

        var flowOperators = FlowOps({
          resume: resumeOperation,
          throwError: onError,
          end: termination.end,
          cancel: termination.cancel
        });

        var tryNextValue = function tryNextValue(getValue) {
          try {
            var value = getValue();
            value && evaluateYieldedValue(value, flowOperators);
          } catch (e) {
            !task.isCancelled && reject(e);
          }
        };

        tryNextValue(function () {
          return getNextValue(program, x);
        });
      };

      setTimeout(resume, 0);
      return function () {
        return task.isCancelled = true;
      };
    });
    task.isCancelled = false;
    return task;
  }

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

  effectHandlerInstance.runMulti = function () {
    var args = arguments;

    var runInstance = function runInstance(value, stateCache) {
      stateCache = stateCache || [];
      var task = (0, _task.default)(function (reject, resolve) {
        var program = runProgram.apply(null, args);

        var cleanup = function cleanup() {};

        var results = [];
        stateCache.forEach(function (x) {
          return program.next(x);
        });

        function mapResult() {
          return [].concat(_toConsumableArray(results), Array.prototype.slice.call(arguments));
        }

        var _getTerminationOps = getTerminationOps({
          program: program,
          task: task,
          reject: reject,
          resolve: resolve,
          mapResult: mapResult
        }),
            end = _getTerminationOps.end,
            throwError = _getTerminationOps.throwError;

        var resume = function resume(x) {
          if (task.isCancelled) return program.return(null);
          stateCache = [].concat(_toConsumableArray(stateCache), [x]);
          var flowOperators = {};
          var iterationValue = {};
          var isResumed = false;
          var pendingTasks = [];

          var resumeOperation = function resumeOperation(v) {
            if (task.isCancelled) return program.return(null);

            if ((0, _utils2.isOperation)(iterationValue.value) && iterationValue.value.isMulti) {
              if (isResumed) {
                pendingTasks.push(v);
              } else {
                isResumed = true;
                var cancelFn = runInstance(v, stateCache).fork(flowOperators.throwError, function (result) {
                  results = [].concat(_toConsumableArray(results), _toConsumableArray(result));
                  var tasks = pendingTasks.map(function (val) {
                    return runInstance(val, stateCache);
                  });
                  var cancelFn = (0, _fns.series)(tasks).fork(flowOperators.throwError, function (r) {
                    var _flowOperators;

                    isResumed = false;

                    (_flowOperators = flowOperators).end.apply(_flowOperators, _toConsumableArray((0, _utils.flatten)(r)));
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

          function onError() {
            var args = arguments;
            tryNextValue(function () {
              return throwError.apply(null, args);
            });
          }

          flowOperators = FlowOps({
            resume: resumeOperation,
            end: end,
            throwError: onError
          });

          var tryNextValue = function tryNextValue(getValue) {
            try {
              var _value = getValue();

              _value && evaluateYieldedValue(_value, flowOperators);
            } catch (e) {
              !task.isCancelled && reject(e);
            }
          };

          tryNextValue(function () {
            return iterationValue = getNextValue(program, x);
          });
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

function composeHandlers() {
  return [].slice.call(arguments).reduce(function (a, b) {
    return a.concat(b);
  });
}

var run = createHandler();
exports.run = run;