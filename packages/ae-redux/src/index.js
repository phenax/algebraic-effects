import Store from './Store';

export { Store };

export const createEffectsMiddleware = (program, handler) => {
  const middleware = store => next => action => {
    Store.of({ store, action })
      .with(handler)
      .run(program)
      .fork(console.error, console.log);
    return next(action);
  };

  return middleware;
};
