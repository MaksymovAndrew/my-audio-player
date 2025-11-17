import { useCallback, useState, useRef, useEffect, type ChangeEvent } from 'react';
import { useAudio } from '../../context/AudioContext';
import SoundDriver from './SoundDriver/SoundDriver';
import LoadingMessage from '../LoadingMessage/LoadingMessage';
import PlayerControls from '../PlayerControls/PlayerControls';
import VolumeControl from '../VolumeControl/VolumeControl';
import WaveformContainer from '../WaveformContainer/WaveformContainer';
import TrackInfo from '../TrackInfo/TrackInfo';
import styles from './Player.module.scss';

function Player() {
    const soundController = useRef<undefined | SoundDriver>(undefined);
    const isInitializing = useRef(false);
    const [loading, setLoading] = useState(false);
    const { audioFile, setAudioFile } = useAudio();

    const loadAudioFile = useCallback(async (file: File) => {
        if (isInitializing.current) {
            return;
        }

        isInitializing.current = true;
        setLoading(true);

        soundController.current?.destroy(); //kill previous audio (just in case)

        const waveContainer = document.getElementById('waveContainer');
        if (!waveContainer) {
            throw new Error('Wave container not found');
        }

        const soundInstance = new SoundDriver(file);
        try {
            await soundInstance.init(waveContainer);
            soundController.current = soundInstance;

            soundInstance.drawChart();
        } catch (err) {
            console.error('Failed to load audio:', err);
        } finally {
            setLoading(false);
            isInitializing.current = false;
        }
    }, []);

    useEffect(() => {
        if (audioFile && !soundController.current && !isInitializing.current) {
            loadAudioFile(audioFile);
        }
    }, [audioFile, loadAudioFile]);

    const handlePlay = useCallback(async () => {
        await soundController.current?.play();
    }, []);

    const handlePause = useCallback(async () => {
        await soundController.current?.pause();
    }, []);

    const handleStop = useCallback(async () => {
        await soundController.current?.pause(true);
    }, []);

    const onVolumeChange = useCallback((event: ChangeEvent<HTMLInputElement>) => {
        soundController.current?.changeVolume(Number(event.target.value));
    }, []);

    const handleReset = useCallback(() => {
        soundController.current?.destroy();
        soundController.current = undefined;
        setAudioFile(null);
        isInitializing.current = false;
    }, [setAudioFile]);

    useEffect(() => {
        return () => {
            soundController.current?.destroy();
        };
    }, []);

    return (
        <div className={styles.player}>
            {loading && <LoadingMessage />}

            <WaveformContainer loading={loading} />

            {!loading && soundController.current && (
                <>
                    <div className={styles.header}>
                        <TrackInfo
                            duration={soundController.current.getDuration()}
                            fileName={audioFile?.name}
                        />
                    </div>

                    <div className={styles.soundEditor}>
                        <PlayerControls
                            onPlay={handlePlay}
                            onPause={handlePause}
                            onStop={handleStop}
                            onReset={handleReset}
                        />

                        <VolumeControl onChange={onVolumeChange} />
                    </div>
                </>
            )}
        </div>
    );
}

export default Player;
