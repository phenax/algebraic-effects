
# Exception Effect
Exception effect allows you to create a throw operation to break out of the flow of your program.

## API

### Functions

* `Exception.try`
It accepts a program (generator with effects) and returns a promise
```haskell
try :: (Program ...a b, ...a) -> Promise b
```


### Operations

* throw
Throw operation models the behavior of breaking out of the flow of the program.



## Usage examples

### Using Exception effect
You can use the Exception effect to handle error flows in your application. This gives you more control of the flow of the program than the traditional throw with `try/catch`.

```js
import Exception from 'algebraic-effects/Exception';

const divide = function *(a, b) {
  if (b === 0) yield Exception.throw(new Error('Invalid operation'));
  yield a / b;
};

Exception.try(divide, 5, 2)
  .then(result => console.log('5 / 2 ===', result));

Exception.try(divide, 5, 0)
  .catch(e => console.error(e));
```



### Custom handler for Exception effect (toEither)

```js
import Exception from 'algebraic-effects/Exception';
import Either from 'crocks/Either'; // Using Either from crocks

// divide :: Program<Exception> (Number, Number) Number
const divide = function *(a, b) {
  if (b === 0) yield Exception.throw(new Error('Invalid operation'));
  yield a / b;
};

// toEither :: (Program<Exception> (...a)  b, ...a) -> Promise (Either Error b)
const toEither = Exception.handler({
  throw: ({ end }) => error => end(Either.Left(error.message)),
  _: ({ end }) => value => end(Either.Right(value)),
});

await toEither(divide, 5, 2); // Either.Right 2.5
await toEither(divide, 5, 0); // Either.Left 'Invalid operation'
```
