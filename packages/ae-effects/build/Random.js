"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = exports.random = exports.seeded = void 0;

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

var seeded = function seeded(seed) {
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
        for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
          args[_key] = arguments[_key];
        }

        var argLength = fn.length;
        var times = typeof args[argLength] !== 'undefined' ? args[argLength] : 1;
        Array(times).fill(null).forEach(function () {
          return o.resume(fn.apply(null, args));
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

exports.seeded = seeded;
var random = seeded(Math.random() * 10);
exports.random = random;
var _default = Random;
exports["default"] = _default;