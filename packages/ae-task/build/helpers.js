"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.toPromise = exports.mapRejected = exports.fold = exports.fork = exports.bimap = exports.map = exports.parallel = exports.series = exports.race = void 0;

var _utils = require("@algebraic-effects/utils");

var _ = _interopRequireDefault(require("."));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// race :: [Task e a] -> Task e a
var race = function race(tasks) {
  return (0, _.default)(function (rej, res) {
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
  }, _.default.resolved([]));
}; // parallel :: [Task e a] -> Task e a


exports.series = series;

var parallel = function parallel(tasks) {
  return (0, _.default)(function (reject, resolve) {
    var resolvedCount = 0;
    var resolvedData = [];

    var onResolve = function onResolve(index) {
      return function (data) {
        resolvedData[index] = data;
        resolvedCount += 1;
        if (resolvedCount === tasks.length) resolve(resolvedData);
      };
    };

    tasks.forEach(function (task, index) {
      return task.fork(reject, onResolve(index));
    });
  });
}; // Point-free methods


exports.parallel = parallel;
var map = (0, _utils.pointfree)('map');
exports.map = map;
var bimap = (0, _utils.pointfree)('bimap');
exports.bimap = bimap;
var fork = (0, _utils.pointfree)('fork');
exports.fork = fork;
var fold = (0, _utils.pointfree)('fold');
exports.fold = fold;
var mapRejected = (0, _utils.pointfree)('mapRejected');
exports.mapRejected = mapRejected;
var toPromise = (0, _utils.pointfree)('toPromise')();
exports.toPromise = toPromise;