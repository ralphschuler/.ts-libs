import { SimpleObservable } from '../SimpleObservable.js';

export const done = () => (observable: any) => {
    return new SimpleObservable((observer) => {
        return observable.subscribe({
            next: (value: any) => {
                observer.next(value);
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
