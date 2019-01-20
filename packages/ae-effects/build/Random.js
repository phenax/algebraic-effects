"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _core = require("@algebraic-effects/core");

// Including min and max i.e. [min, max]
// getRandomInt :: (Number, Number) -> Number
var getRandomInt = function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}; // Random :: Effect


var Random = (0, _core.createEffect)('Random', {
  getInt: (0, _core.func)(['number', 'number'], 'number'),
  fromArray: (0, _core.func)(['array a'], 'a')
}); // Random.effect :: Runner

Random.effect = Random.handler({
  getInt: function getInt(_ref) {
    var resume = _ref.resume;
    return function (min, max) {
      return resume(getRandomInt(min, max));
    };
  },
  fromArray: function fromArray(_ref2) {
    var resume = _ref2.resume;
    return function (array) {
      return resume(array[getRandomInt(0, array.length - 1)]);
    };
  }
});
var _default = Random;
exports.default = _default;