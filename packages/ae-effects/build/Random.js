"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _core = require("@algebraic-effects/core");

var Random = (0, _core.createEffect)('Random', {
  number: (0, _core.func)(['?times'], 'number', {
    isMulti: true
  }),
  getInt: (0, _core.func)(['number', 'number', '?times'], 'number', {
    isMulti: true
  }),
  fromArray: (0, _core.func)(['array a', '?times'], 'a', {
    isMulti: true
  }),
  flipCoin: (0, _core.func)(['?times'], 'bool', {
    isMulti: true
  })
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

  var pickFromList = function pickFromList(list) {
    return list[getRandomInt(0, list.length - 1)];
  };

  var flipCoin = function flipCoin() {
    return !!(getRandomInt(0, 100) % 2);
  };

  var wrapMulti = function wrapMulti(fn) {
    return function (o) {
      return function () {
        var _arguments = arguments;
        var argLength = fn.length;
        var times = typeof arguments[argLength] !== 'undefined' ? arguments[argLength] : 1;
        Array(times).fill(null).forEach(function () {
          return o.resume(fn.apply(null, _arguments));
        });
      };
    };
  };

  return Random.handler({
    number: wrapMulti(random),
    getInt: wrapMulti(getRandomInt),
    fromArray: wrapMulti(pickFromList),
    flipCoin: wrapMulti(flipCoin)
  });
};

Random.random = Random.seed(Math.random() * 10);
var _default = Random;
exports.default = _default;