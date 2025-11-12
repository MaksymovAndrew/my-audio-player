import Player from '../../components/Player/Player';
import styles from './PlayerPage.module.scss';

function PlayerPage() {
    return (
        <div className={styles.container}>
            <Player />
        </div>
    );
}

export default PlayerPage;
