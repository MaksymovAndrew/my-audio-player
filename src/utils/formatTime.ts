export function formatTime(timeInSeconds: number): string {
    const minutesStr = Math.floor((timeInSeconds % 3600) / 60)
        .toString()
        .padStart(2, '0'); // 00:00 format, push 0 if needed

    const secondsStr = Math.floor(timeInSeconds % 60)
        .toString()
        .padStart(2, '0');

    if (timeInSeconds >= 3600) {
        const hoursStr = Math.floor(timeInSeconds / 3600)
            .toString()
            .padStart(2, '0');
        return `${hoursStr}:${minutesStr}:${secondsStr}`;
    }

    return `${minutesStr}:${secondsStr}`;
}
