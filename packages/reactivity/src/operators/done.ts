import { SimpleObservable } from '../SimpleObservable';

export const done = () => (observable) => {
    return new SimpleObservable((observer) => {
        return observable.subscribe({
            next: (value) => {
                observer.next(value);
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
