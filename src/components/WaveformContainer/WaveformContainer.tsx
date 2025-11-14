import { memo } from 'react';
import styles from './WaveformContainer.module.scss';

const WaveformContainer = memo(() => {
    return <div id="waveContainer" className={styles.waveformContainer}></div>;
});

export default WaveformContainer;
