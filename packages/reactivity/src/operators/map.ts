import { SimpleObservable } from '../SimpleObservable.js';

export const map = (project: any) => (observable: any) => {
  return new SimpleObservable((observer: any) => {
    return observable.subscribe({
      next: (value: any) => {
        observer.next(project(value));
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
