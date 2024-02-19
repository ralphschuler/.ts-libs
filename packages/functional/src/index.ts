/**
 * Represents the absence of a value.
 */
interface None {
  readonly _tag: "None";
}

/**
 * Wraps a value to indicate its presence.
 * @template T The type of the wrapped value.
 */
interface Some<T> {
  readonly _tag: "Some";
  readonly value: T;
}

/**
 * Represents an optional value: a value that might be present (`Some`) or absent (`None`).
 * @template T The type of the value that might be present.
 */
type Option<T> = None | Some<T>;

/**
 * Represents a successful operation.
 * @template T The type of the result value.
 */
interface Ok<T> {
  readonly _tag: "Ok";
  readonly value: T;
}

/**
 * Represents a failed operation.
 * @template E The type of the error.
 */
interface Err<E> {
  readonly _tag: "Err";
  readonly error: E;
}

/**
 * Represents the result of an operation that can either succeed (`Ok`) or fail (`Err`).
 * @template T The type of the result value in case of success.
 * @template E The type of the error in case of failure.
 */
type Result<T, E> = Ok<T> | Err<E>;

/**
 * Represents a Promise that resolves to a Result, encapsulating asynchronous operations that can fail.
 * @template T The type of the result value in case of success.
 * @template E The type of the error in case of failure.
 */
type AsyncResult<T, E> = Promise<Result<T, E>>;

/**
 * Type for synchronous functions that return a Result.
 * @template T The input type.
 * @template R The result type on success.
 * @template E The error type on failure.
 */
type SyncFunc<T, R, E> = (arg: T) => Result<R, E>;

/**
 * Type for asynchronous functions that return a Promise resolving to a Result.
 * @template T The input type.
 * @template R The result type on success.
 * @template E The error type on failure.
 */
type AsyncFunc<T, R, E> = (arg: T) => AsyncResult<R, E>;

/**
 * Union type for both synchronous and asynchronous functions that return a Result or a Promise of a Result.
 * @template T The input type.
 * @template R The result type on success.
 * @template E The error type on failure.
 */
type Func<T, R, E> = SyncFunc<T, R, E> | AsyncFunc<T, R, E>;

/**
 * Utility function to create a `None` value.
 * @returns {None} The None value.
 * @example
 * const option = None();
 */
const None: () => None = () => Object.freeze({ _tag: "None" });

/**
 * Utility function to create a `Some` value.
 * @template T The type of the value to wrap.
 * @param {T} value The value to wrap.
 * @returns {Some<T>} The Some value wrapping the given value.
 * @example
 * const option = Some(5);
 */
const Some: <T>(value: T) => Some<T> = (value) =>
  Object.freeze({ _tag: "Some", value });

/**
 * Utility function to create an `Ok` result.
 * @template T The type of the result value.
 * @param {T} value The result value.
 * @returns {Ok<T>} The Ok result wrapping the given value.
 * @example
 * const result = Ok("success");
 */
const Ok: <T>(value: T) => Ok<T> = (value) =>
  Object.freeze({ _tag: "Ok", value });

/**
 * Utility function to create an `Err` result.
 * @template E The type of the error.
 * @param {E} error The error value.
 * @returns {Err<E>} The Err result containing the given error.
 * @example
 * const result = Err(new Error("failure"));
 */
const Err: <E>(error: E) => Err<E> = (error) =>
  Object.freeze({ _tag: "Err", error });

/**
 * Type guard for `None` values.
 * @template T The optional value type.
 * @param {Option<T>} option The option to check.
 * @returns {boolean} True if the option is None, otherwise false.
 * @example
 * if (isNone(option)) {
 *   console.log("No value");
 * }
 */
function isNone<T>(option: Option<T>): option is None {
  return option._tag === "None";
}

/**
 * Type guard for `Some` values.
 * @template T The optional value type.
 * @param {Option<T>} option The option to check.
 * @returns {boolean} True if the option is Some, otherwise false.
 * @example
 * if (isSome(option)) {
 *   console.log("Has value", option.value);
 * }
 */
function isSome<T>(option: Option<T>): option is Some<T> {
  return option._tag === "Some";
}

/**
 * Type guard for `Ok` results.
 * @template T The result value type.
 * @template E The error type.
 * @param {Result<T, E>} result The result to check.
 * @returns {boolean} True if the result is Ok, otherwise false.
 * @example
 * if (isOk(result)) {
 *   console.log("Success", result.value);
 * }
 */
function isOk<T, E>(result: Result<T, E>): result is Ok<T> {
  return result._tag === "Ok";
}

/**
 * Type guard for `Err` results.
 * @template T The result value type.
 * @template E The error type.
 * @param {Result<T, E>} result The result to check.
 * @returns {boolean} True if the result is Err, otherwise false.
 * @example
 * if (isErr(result)) {
 *   console.log("Failure", result.error);
 * }
 */
function isErr<T, E>(result: Result<T, E>): result is Err<E> {
  return result._tag === "Err";
}

/**
 * A utility function for pattern matching on `Option` and `Result` types.
 * It allows handling different cases with specific functions.
 * @template T The input type for Some or Ok.
 * @template R The return type for the matcher functions.
 * @template E The error type for Err.
 * @param {Option<T> | Result<T, E>} optionOrResult The Option or Result to match against.
 * @param {Object} matchers An object with functions to handle each case.
 * @returns {R} The return value of the matched case.
 * @example
 * const result = match(option, {
 *   None: () => "No value",
 *   Some: (value) => `Value is ${value}`,
 * });
 */
function match<T, R, E>(
  optionOrResult: Option<T> | Result<T, E>,
  matchers: {
    None?: () => R;
    Some?: (value: T) => R;
    Ok?: (value: T) => R;
    Err?: (error: E) => R;
    _: () => R;
  },
): R {
  switch (optionOrResult._tag) {
    case "None":
      if (matchers.None) {
        return matchers.None();
      }
      break;
    case "Some":
      if (matchers.Some) {
        return matchers.Some(optionOrResult.value);
      }
      break;
    case "Ok":
      if (matchers.Ok) {
        return matchers.Ok(optionOrResult.value);
      }
      break;
    case "Err":
      if (matchers.Err) {
        return matchers.Err(optionOrResult.error);
      }
      break;
    default:
      if (matchers._) {
        return matchers._();
      }
      break;
  }

  if (matchers._) {
    return matchers._();
  }

  throw new Error(`Invalid type or missing wildcard (_) matcher.`);
}
