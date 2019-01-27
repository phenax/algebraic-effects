# The street lingo
Ya need to kno da lingo to be talkin wid us yo. So letz get yaz up ta speed.


## Program
A program is a generator that calls an effects. This is where all your core logic exists free from the implementation details. All effects by design have a consistent api so dont worry about any of the outside world.

```js
// program :: Program<IOEffect, ConsoleEffect> String ()
const program = function *(greetText) {
  const name = yield IOEffect.getInput('What is your name?');
  yield ConsoleEffect.log('>> Name', name);
  yield IOEffect.showMessage(`Hello, ${name}! ${greetText}`);
};
```


## Operation
An operation is basically something to do. An operation is technically just an instruction with no behavior implementation. So you can use an operation in your program without worrying about anything other than the operation signature.
In the above example `IOEffect.getInput`, `ConsoleEffect.log` and `IOEffect.showMessage` are operations being run.


## Effect
An effect is a group of operations.
In the above example `IOEffect` and `ConsoleEffect` are effects. This package comes with a few built in effects like State, Exception, etc.


## Handler
A handler is a set of curried functions that decides how the program flows when the given operation is called

```js
const io = IOEffect.handler({
  getInput: ({ resume }) => label => showModal({ label, onSubmit: resume }),
  showMessage: ({ resume }) => /* whatever */,
});
```

## Runner
`.handler` method call returns a function. You can use that function to call your program. This function is called the runner.
I like the `with*` prefix for my runners.
It accepts a program and its arguments.

```js
io(program, 'Hello world'); // Program, ...arguments
```

Alternatively you can call the .run method on it.

```js
io.run(program, 'Hello world'); // Program, ...arguments
```
