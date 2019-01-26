"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
var _exportNames = {
  rejectAfter: true,
  resolveAfter: true,
  race: true,
  series: true,
  parallel: true
};
exports.parallel = exports.series = exports.race = exports.resolveAfter = exports.rejectAfter = void 0;

var _2 = _interopRequireDefault(require("."));

var _pointfree = require("./pointfree");

Object.keys(_pointfree).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _pointfree[key];
    }
  });
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// rejectAfter :: (Number, e) -> Task.Rejected e
var rejectAfter = function rejectAfter(duration, value) {
  return (0, _2.default)(function (rej) {
    var timer = setTimeout(rej, duration, value);
    return function () {
      return clearTimeout(timer);
    };
  });
}; // resolveAfter :: (Number, a) -> Task.Resolved a


exports.rejectAfter = rejectAfter;

var resolveAfter = function resolveAfter(duration, value) {
  return (0, _2.default)(function (_, res) {
    var timer = setTimeout(res, duration, value);
    return function () {
      return clearTimeout(timer);
    };
  });
}; // race :: [Task e a] -> Task e a


exports.resolveAfter = resolveAfter;

var race = function race(tasks) {
  return (0, _2.default)(function (rej, res) {
    return tasks.forEach(function (t) {
      return t.fork(rej, res);
    });
  });
}; // series :: [Task e a] -> Task e a


exports.race = race;

var series = function series(tasks) {
  return tasks.reduce(function (task, t) {
    return task.chain(function (d) {
      return t.map(function (x) {
        return d.concat([x]);
      });
    });
  }, _2.default.Resolved([]));
}; // parallel :: [Task e a] -> Task e a


exports.series = series;

var parallel = function parallel(tasks) {
  return (0, _2.default)(function (reject, resolve) {
    var resolvedCount = 0;
    var resolvedData = [];

    var onResolve = function onResolve(index, data) {
      resolvedData[index] = data;
      resolvedCount += 1;
      if (resolvedCount === tasks.length) return resolve(resolvedData);
    };

    tasks.forEach(function (task, index) {
      return task.fork(reject, onResolve.bind(null, index));
    });
  });
}; // Point-free methods


exports.parallel = parallel;