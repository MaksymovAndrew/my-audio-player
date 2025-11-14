export type ThrottledFunction<Args extends unknown[]> = {
    (this: unknown, ...args: Args): void;
    cancel: () => void;
};

export function throttle<Args extends unknown[]>(
    func: (...args: Args) => void,
    interval: number
): ThrottledFunction<Args> {
    let inThrottle: boolean = false;
    let timeoutId: ReturnType<typeof setTimeout> | null = null;

    const throttled = function (this: unknown, ...args: Args) {
        if (!inThrottle) {
            func.apply(this, args);
            inThrottle = true;

            timeoutId = setTimeout(() => {
                inThrottle = false;
                timeoutId = null;
            }, interval);
        }
    } as ThrottledFunction<Args>;

    throttled.cancel = () => {
        if (timeoutId !== null) {
            clearTimeout(timeoutId);
            timeoutId = null;
        }
        inThrottle = false;
    };

    return throttled;
}
