import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAudio } from '../../context/AudioContext';
import Player from '../../components/Player/Player';
import ErrorMessage from '../../components/ErrorMessage/ErrorMessage';
import styles from './PlayerPage.module.scss';

function PlayerPage() {
    const { audioFile } = useAudio();
    const navigate = useNavigate();

    useEffect(() => {
        if (!audioFile) {
            navigate('/');
        }
    }, [audioFile]);

    if (!audioFile) {
        return (
            <div className={styles.container}>
                <ErrorMessage />
            </div>
        );
    }

    return (
        <div className={styles.container}>
            <Player />
        </div>
    );
}

export default PlayerPage;
