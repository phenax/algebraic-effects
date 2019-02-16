"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _core = require("@algebraic-effects/core");

var _utils = require("@algebraic-effects/utils");

var Random = (0, _core.createEffect)('Random', {
  number: (0, _core.func)([], 'number'),
  getInt: (0, _core.func)(['number', 'number'], 'number'),
  fromArray: (0, _core.func)(['array a'], 'a')
});

Random.seed = function (seed) {
  var random = function random() {
    var x = Math.sin(seed) * 10000;
    seed = seed + 1;
    return x - Math.floor(x);
  };

  var getRandomInt = function getRandomInt(min, max) {
    return Math.floor(random() * (max - min + 1)) + min;
  };

  return Random.handler({
    number: function number(_ref) {
      var resume = _ref.resume;
      return (0, _utils.compose)(resume, random);
    },
    getInt: function getInt(_ref2) {
      var resume = _ref2.resume;
      return (0, _utils.compose)(resume, getRandomInt);
    },
    fromArray: function fromArray(_ref3) {
      var resume = _ref3.resume;
      return function (array) {
        return resume(array[getRandomInt(0, array.length - 1)]);
      };
    }
  });
};

Random.random = Random.seed(Math.random() * 10);
var _default = Random;
exports.default = _default;