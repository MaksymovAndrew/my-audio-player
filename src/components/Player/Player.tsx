import React, { useCallback, useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAudio } from '../../context/AudioContext';
import SoundDriver from './SoundDriver/SoundDriver';
import LoadingMessage from '../LoadingMessage/LoadingMessage';
import PlayerControls from '../PlayerControls/PlayerControls';
import VolumeControl from '../VolumeControl/VolumeControl';
import ResetButton from '../ResetButton/ResetButton';
import WaveformContainer from '../WaveformContainer/WaveformContainer';
import TrackInfo from '../TrackInfo/TrackInfo';
import styles from './Player.module.scss';

function Player() {
    const soundController = useRef<undefined | SoundDriver>(undefined);
    const isInitializing = useRef(false);
    const [loading, setLoading] = useState(false);
    const { audioFile, setAudioFile } = useAudio();
    const navigate = useNavigate();

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

    const togglePlayer = useCallback(
        (type: string) => async () => {
            if (type === 'play') {
                await soundController.current?.play();
            } else if (type === 'stop') {
                await soundController.current?.pause(true);
            } else {
                await soundController.current?.pause();
            }
        },
        []
    );

    const onVolumeChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
        soundController.current?.changeVolume(Number(event.target.value));
    }, []);

    const handleReset = useCallback(() => {
        soundController.current?.destroy();
        soundController.current = undefined;
        setAudioFile(null);
        isInitializing.current = false;
        navigate('/');
    }, [navigate, setAudioFile]);

    useEffect(() => {
        return () => {
            soundController.current?.destroy();
        };
    }, []);

    return (
        <div className={styles.player}>
            {loading && <LoadingMessage />}

            {!loading && soundController.current && (
                <div className={styles.header}>
                    <ResetButton onReset={handleReset} />
                    <TrackInfo
                        duration={soundController.current.getDuration()}
                        fileName={audioFile?.name}
                    />
                </div>
            )}

            <WaveformContainer />

            {!loading && soundController.current && (
                <div className={styles.soundEditor}>
                    <PlayerControls
                        onPlay={togglePlayer('play')}
                        onPause={togglePlayer('pause')}
                        onStop={togglePlayer('stop')}
                    />

                    <VolumeControl onChange={onVolumeChange} />
                </div>
            )}
        </div>
    );
}

export default Player;
