"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "Store", {
  enumerable: true,
  get: function get() {
    return _Store.default;
  }
});
exports.createEffectsMiddleware = void 0;

var _Store = _interopRequireDefault(require("./Store"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var createEffectsMiddleware = function createEffectsMiddleware(program, handler) {
  var middleware = function middleware(store) {
    return function (next) {
      return function (action) {
        _Store.default.of(store).with(handler).run(program).fork(console.error, console.log);

        return next(action);
      };
    };
  };

  return middleware;
};

exports.createEffectsMiddleware = createEffectsMiddleware;