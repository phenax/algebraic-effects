
// symbolObjectPool :: Object SymbolObject
const symbolObjectPool = {};

// createSymbolObject :: String -> SymbolObject
export const createSymbolObject = name => {
  if (symbolObjectPool[name]) return symbolObjectPool[name];
  symbolObjectPool[name] = { name };
  return symbolObjectPool[name];
};

// createSymbol :: String -> Symbol | SymbolObject
export const createSymbol = key => typeof Symbol === 'function'
  ? Symbol.for(key)
  : createSymbolObject(key);

// isGenerator :: Generator? -> Boolean
export const isGenerator = p => p.constructor === (function*(){}()).constructor;

// pointfree :: String -> (...a) -> Object(with methodName :: ...a -> b) -> b
export const pointfree = methodName => function() {
  return x => x[methodName].apply(x, arguments);
};

// compose :: (...Function) -> Function
export const compose = function() {
  return [...arguments].reduce((a, b) => (...args) => a(b(...args)));
};

// identity :: a -> a
export const identity = x => x;

// constant :: a -> () -> a
export const constant = x => () => x;

