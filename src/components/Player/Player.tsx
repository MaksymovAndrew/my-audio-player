import React, { useCallback, useState, useEffect } from 'react';
import SoundDriver from './SoundDriver';
import DragAndDrop from '../DragAndDrop/DragAndDrop';
import WaveformContainer from '../WaveformContainer/WaveformContainer';
import FileUpload from '../FileUpload/FileUpload';
import LoadingMessage from '../Loading/LoadingMessage';
import PlayerControls from '../PlayerControls/PlayerControls';
import VolumeControl from '../VolumeControl/VolumeControl';
import ResetButton from '../ResetButton/ResetButton';
import styles from './Player.module.scss';

function Player() {
    const [soundDriver, setSoundDriver] = useState<SoundDriver | null>(null);
    const [loading, setLoading] = useState(false);
    const [pendingFile, setPendingFile] = useState<File | null>(null);

    useEffect(() => {
        if (!pendingFile) return;

        let currentDriver: SoundDriver | null = null;

        const initAudio = async () => {
            const soundInstance = new SoundDriver(pendingFile);
            try {
                await soundInstance.init(document.getElementById('waveContainer'));
                soundInstance.drawChart();
                currentDriver = soundInstance;
                setSoundDriver(soundInstance);
            } catch (err) {
                console.error('Failed to load audio:', err);
            } finally {
                setLoading(false);
                setPendingFile(null);
            }
        };

        initAudio();

        return () => {
            if (currentDriver?.isRunning) {
                currentDriver.pause(true);
            }
        };
    }, [pendingFile]);

    const loadAudioFile = useCallback((audioFile: File) => {
        setLoading(true);
        setPendingFile(audioFile);
    }, []);

    const togglePlayer = useCallback(
        (type: string) => () => {
            if (type === 'play') {
                soundDriver?.play();
            } else if (type === 'stop') {
                soundDriver?.pause(true);
            } else {
                soundDriver?.pause();
            }
        },
        [soundDriver]
    );

    const onVolumeChange = useCallback(
        (event: React.ChangeEvent<HTMLInputElement>) => {
            soundDriver?.changeVolume(Number(event.target.value));
        },
        [soundDriver]
    );

    const handleReset = useCallback(() => {
        soundDriver?.pause(true);
        setSoundDriver(null);
        const waveContainer = document.getElementById('waveContainer');
        if (waveContainer) {
            waveContainer.innerHTML = '';
        }
    }, [soundDriver]);

    return (
        <div className={styles.player}>
            {loading && <LoadingMessage />}

            <FileUpload
                onFileSelect={loadAudioFile}
                isDisabled={soundDriver !== null || loading}
            />

            {!soundDriver && !pendingFile ? (
                <DragAndDrop
                    onFileSelect={loadAudioFile}
                    isDisabled={loading}
                />
            ) : (
                <WaveformContainer />
            )}

            {!loading && soundDriver && (
                <div className={styles.soundEditor}>
                    <ResetButton onReset={handleReset} />

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
