import { SimpleObservable } from '../SimpleObservable';

export const map = (project) => (observable) => {
  return new SimpleObservable((observer) => {
    return observable.subscribe({
      next: (value) => {
        observer.next(project(value));
      },
      error: (error) => {
        observer.error(error);
      },
      complete: () => {
        observer.complete();
      },
    });
  });
};
