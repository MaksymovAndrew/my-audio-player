import { memo } from 'react';
import Button from '../Button/Button';
import Card from '../Card/Card';
import styles from './PlayerControls.module.scss';

interface PlayerControlsProps {
    onPlay: () => void;
    onPause: () => void;
    onStop: () => void;
}

const PlayerControls = memo(({ onPlay, onPause, onStop }: PlayerControlsProps) => {
    return (
        <Card className={styles.controls}>
            <Button
                className={`${styles.button} ${styles.playButton}`}
                onClick={onPlay}
            >
                Play
            </Button>

            <Button
                className={`${styles.button} ${styles.pauseButton}`}
                onClick={onPause}
            >
                Pause
            </Button>

            <Button
                className={`${styles.button} ${styles.stopButton}`}
                onClick={onStop}
            >
                Stop
            </Button>
        </Card>
    );
});

export default PlayerControls;
