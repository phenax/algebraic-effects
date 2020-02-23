"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "compose", {
  enumerable: true,
  get: function get() {
    return _utils.compose;
  }
});
exports.toPromise = exports.fork = exports.bimap = exports.foldReject = exports.fold = exports.mapRejected = exports.map = exports.chain = void 0;

var _utils = require("@algebraic-effects/utils");

var chain = (0, _utils.pointfree)('chain');
exports.chain = chain;
var map = (0, _utils.pointfree)('map');
exports.map = map;
var mapRejected = (0, _utils.pointfree)('mapRejected');
exports.mapRejected = mapRejected;
var fold = (0, _utils.pointfree)('fold');
exports.fold = fold;
var foldReject = (0, _utils.pointfree)('foldReject');
exports.foldReject = foldReject;
var bimap = (0, _utils.pointfree)('bimap');
exports.bimap = bimap;
var fork = (0, _utils.pointfree)('fork');
exports.fork = fork;
var toPromise = (0, _utils.pointfree)('toPromise')();
exports.toPromise = toPromise;