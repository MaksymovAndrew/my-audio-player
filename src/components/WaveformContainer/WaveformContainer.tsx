import { memo } from 'react';
import styles from './WaveformContainer.module.scss';

interface WaveformContainerProps {
    loading?: boolean;
}

const WaveformContainer = memo(({ loading }: WaveformContainerProps) => {
    const containerClass = loading
        ? `${styles.waveformContainer} ${styles.loading}`
        : styles.waveformContainer;

    return (
        <div
            id="waveContainer"
            className={containerClass}
        ></div>
    );
});

export default WaveformContainer;
