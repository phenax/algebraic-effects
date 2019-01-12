
// compose :: (...Function) -> Function
export const compose = (...fns) =>
    fns.reduce((a, b) => (...args) => a(b(...args)));

