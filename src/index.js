
import { Operation, isOperation, VALUE_HANDLER, func } from './utils';
import globalHandlers from './operations';

// type Program = GeneratorFunction
// type Runner = (Program, ...a) -> Promise

const isIterator = p => !!p[Symbol.iterator];

const runProgram = (program, ...args) => {
  const p = program.constructor.name === 'GeneratorFunction' ? program(...args) : program;
  if (!isIterator(p))
    throw new Error('Cant run program. Invalid generator');
  return p;
};

// createRunner :: (Object Function, { effect :: String }) -> Runner
const createRunner = (handlers = {}, { effect } = {}) => {
  const valueHandler = handlers._ || VALUE_HANDLER;

  const effectRunner = (program_, ...args) => new Promise((resolve, reject) => {
    const program = runProgram(program_, ...args);

    effectRunner.isCancelled = false;

    // throwError :: * -> ()
    const throwError = x => {
      program.return(x);
      !effectRunner.isCancelled && reject(x);
    };

    // end  :: * -> ()
    const end = x => {
      program.return(x);
      !effectRunner.isCancelled && resolve(x);
    };

    // resume :: * -> ()
    const resume = x => {
      if(effectRunner.isCancelled) return program.return(null);

      const call = (...a) => effectRunner(...a).then(resume).catch(throwError);
      const flowOperators = { resume, end, throwError, call };
      
      const { value, done } = program.next(x);
      if (done) return valueHandler(flowOperators)(value);

      if (isOperation(value)) {
        const runOp = handlers[value.name] || globalHandlers[value.name];

        if (!runOp) {
          throwError(new Error(`Invalid operation executed. The handler for operation "${value.name}", was not provided`));
          return;
        }

        runOp(flowOperators)(...value.payload);
      } else {
        valueHandler(flowOperators)(value);
      }
    };

    return resume();
  });

  effectRunner.isCancelled = false;
  effectRunner.effectName = effect || 'Unknown';
  effectRunner.handlers = handlers;

  // concat, with :: Runner -> Runner
  effectRunner.concat = run1 => createRunner(
    { ...handlers, ...run1.handlers },
    { effect: `${effectRunner.effectName}.${run1.effectName}` },
  );
  effectRunner.with = effectRunner.concat;

  // run :: Runner
  effectRunner.run = effectRunner;

  // cancel :: () -> ()
  effectRunner.cancel = () => (effectRunner.isCancelled = true);

  return effectRunner;
};

// createEffect :: (String, Object *) -> Effect
export const createEffect = (name, operations) => ({
  name,
  operations,
  handler: handlers => createRunner(handlers, { effect: name }),
  ...Object.keys(operations).reduce((acc, name) => ({
    ...acc,
    [name]: Operation(name, operations[name]),
  }), {})
});

// composeEffects :: ...Effect -> Effect
export const composeEffects = (...effects) => {
  const name = effects.map(({ name }) => `${name}`.replace('.', '_')).join('.');
  const operations = effects.reduce((acc, eff) => ({ ...acc, ...eff.operations }), {});
  return createEffect(name, operations);
};

// composeHandlers :: ...Runner -> Runner
export const composeHandlers = (...runners) => runners.reduce((a, b) => a.concat(b));

// run :: Runner
export const run = createRunner({}, { effect: 'GlobalRunner' });

export { func };
