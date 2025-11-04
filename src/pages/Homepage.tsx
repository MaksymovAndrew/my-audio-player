import Player from '../components/Player/Player';
import styles from './Homepage.module.scss';

export default function HomePage() {
    return (
        <div className={styles.container}>
            <Player />
        </div>
    );
}
