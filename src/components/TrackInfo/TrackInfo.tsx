import { formatTime } from '../../utils/formatTime';
import Card from '../Card/Card';
import styles from './TrackInfo.module.scss';

interface TrackInfoProps {
    duration: number;
    fileName?: string;
}

function TrackInfo({ duration, fileName }: TrackInfoProps) {
    return (
        <Card className={styles.trackInfo}>
            {fileName && <div className={`${styles.info} ${styles.fileName}`}>{fileName}</div>}
            <div className={`${styles.info} ${styles.duration}`}>{formatTime(duration)}</div>
        </Card>
    );
}

export default TrackInfo;
