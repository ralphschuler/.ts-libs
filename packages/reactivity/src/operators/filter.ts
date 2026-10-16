import { SimpleObservable } from "../SimpleObservable.js";

export const filter =
  (predicate: (value: any) => boolean) => (observable: any) => {
    return new SimpleObservable((observer) => {
      return observable.subscribe({
        next: (value: any) => {
          if (predicate(value)) {
            observer.next(value);
          }
        },
        error: (error: any) => {
          observer.error(error);
        },
        complete: () => {
          observer.complete();
        },
      });
    });
  };
