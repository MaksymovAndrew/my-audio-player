import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAudio } from '../../context/AudioContext';
import Player from '../../components/Player/Player';
import styles from './PlayerPage.module.scss';

function PlayerPage() {
    const { audioFile } = useAudio();
    const navigate = useNavigate();

    useEffect(() => {
        if (!audioFile) {
            navigate('/');
        }
    }, [audioFile, navigate]);

    if (!audioFile) {
        return null;
    }

    return (
        <div className={styles.container}>
            <Player />
        </div>
    );
}

export default PlayerPage;
