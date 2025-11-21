export type ThrottledFunction<Args extends unknown[]> = {
    (...args: Args): void;
    cancel: () => void;
};

export function throttle<Args extends unknown[]>(
    func: (...args: Args) => void,
    interval: number
): ThrottledFunction<Args> {
    let inThrottle: boolean = false;
    let timeoutId: ReturnType<typeof setTimeout> | null = null;

    const throttled = (...args: Args) => {
        if (!inThrottle) {
            func(...args);
            inThrottle = true;

            timeoutId = setTimeout(() => {
                inThrottle = false;
                timeoutId = null;
            }, interval);
        }
    };

    throttled.cancel = () => {
        if (timeoutId !== null) {
            clearTimeout(timeoutId);
            timeoutId = null;
        }
        inThrottle = false;
    };

    return throttled;
}
