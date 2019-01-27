
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
