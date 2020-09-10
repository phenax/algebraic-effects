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
exports.propagateTo = exports.subscribe = exports.filter = exports.tap = exports.map = exports.chain = void 0;

var _utils = require("@algebraic-effects/utils");

var chain = (0, _utils.pointfree)('chain');
exports.chain = chain;
var map = (0, _utils.pointfree)('map');
exports.map = map;
var tap = (0, _utils.pointfree)('tap');
exports.tap = tap;
var filter = (0, _utils.pointfree)('filter');
exports.filter = filter;
var subscribe = (0, _utils.pointfree)('subscribe');
exports.subscribe = subscribe;
var propagateTo = (0, _utils.pointfree)('propagateTo');
exports.propagateTo = propagateTo;