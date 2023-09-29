import { SimpleObservable } from '../SimpleObservable';

export const filter = (predicate) => (observable) => {
    return new SimpleObservable((observer) => {
        return observable.subscribe({
            next: (value) => {
                if (predicate(value)) {
                    observer.next(value);
                }
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
