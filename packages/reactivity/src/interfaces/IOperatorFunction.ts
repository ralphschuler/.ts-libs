import { IObservable } from './IObservable';

/**
 * Represents a function that transforms an observable sequence.
 * @template T - The input type of the operator.
 * @template R - The output type of the operator.
 */
export interface IOperatorFunction<T, R> {
  (source: IObservable<T>): IObservable<R>;
}
