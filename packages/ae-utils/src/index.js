"use strict";
exports.__esModule = true;
var symbolObjectPool = {};
exports.createSymbolObject = function (name) {
    symbolObjectPool[name] = symbolObjectPool[name] || { name: name };
    return symbolObjectPool[name];
};
exports.createSymbol = function (key) { return typeof Symbol === 'function'
    // @ts-ignore
    ? Symbol["for"](key)
    : exports.createSymbolObject(key); };
// @ts-ignore
exports.isGenerator = function (p) { return p && p.constructor && (p.constructor.name + '').indexOf('GeneratorFunction') !== -1; };
exports.pointfree = function (methodName) { return function () {
    var args = arguments;
    // @ts-ignore
    return function (x) { return x[methodName].apply(x, args); };
}; };
exports.compose = function () {
    return [].slice.apply(arguments)
        .reduce(function (a, b) { return function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        return a(b.apply(void 0, args));
    }; });
};
exports.isArray = Array.isArray || (function (a) { return ({}).toString.call(a) == '[object Array]'; });
exports.flatten = function (arr) { return arr.reduce(function (list, item) { return list.concat(exports.isArray(item) ? item : [item]); }, []); };
exports.identity = function (x) { return x; };
exports.constant = function (x) { return function () { return x; }; };
;
exports.maybe = {
    just: function (x) { return ({
        map: function (fn) { return exports.maybe.just(fn(x)); },
        fold: function (_, m) { return m(x); }
    }); },
    nothing: function () { return ({
        map: function (_) { return exports.maybe.nothing(); },
        fold: function (j, _) { return j(); }
    }); }
};
