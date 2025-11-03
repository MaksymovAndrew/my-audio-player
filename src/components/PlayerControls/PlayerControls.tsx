interface PlayerControlsProps {
    onPlay: () => void;
    onPause: () => void;
    onStop: () => void;
}

function PlayerControls({ onPlay, onPause, onStop }: PlayerControlsProps) {
    return (
        <>
            <button
                type="button"
                onClick={onPlay}
            >
                Play
            </button>

            <button
                type="button"
                onClick={onPause}
            >
                Pause
            </button>

            <button
                type="button"
                onClick={onStop}
            >
                Stop
            </button>
        </>
    );
}

export default PlayerControls;
