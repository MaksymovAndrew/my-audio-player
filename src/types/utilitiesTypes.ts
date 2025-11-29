export type ThrottledFunction<Args extends unknown[]> = {
    (...args: Args): void;
    cancel: () => void;
};
