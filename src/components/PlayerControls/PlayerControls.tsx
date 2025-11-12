import type { PlayerControlsProps } from '../../types/component.types';
import styles from './PlayerControls.module.scss';

function PlayerControls({ onPlay, onPause, onStop }: PlayerControlsProps) {
    return (
        <div className={styles.controls}>
            <button
                type="button"
                className={`${styles.button} ${styles.playButton}`}
                onClick={onPlay}
            >
                Play
            </button>

            <button
                type="button"
                className={`${styles.button} ${styles.pauseButton}`}
                onClick={onPause}
            >
                Pause
            </button>

            <button
                type="button"
                className={`${styles.button} ${styles.stopButton}`}
                onClick={onStop}
            >
                Stop
            </button>
        </div>
    );
}

export default PlayerControls;
