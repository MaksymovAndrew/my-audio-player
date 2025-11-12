import type { TrackInfoProps } from '../../types/component.types';
import { formatTime } from '../../utils/formatTime';
import styles from './TrackInfo.module.scss';

function TrackInfo({ duration, fileName }: TrackInfoProps) {
    return (
        <div className={styles.trackInfo}>
            {fileName && <div className={`${styles.info} ${styles.fileName}`}>{fileName}</div>}
            <div className={`${styles.info} ${styles.duration}`}>{formatTime(duration)}</div>
        </div>
    );
}

export default TrackInfo;