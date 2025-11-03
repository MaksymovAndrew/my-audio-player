import React, { useCallback, useState, useRef } from 'react';
import SoundDriver from './SoundDriver';
import DragAndDrop from '../DragAndDrop/DragAndDrop';
import FileUpload from '../FileUpload/FileUpload';
import LoadingMessage from '../Loading/LoadingMessage';
import PlayerControls from '../PlayerControls/PlayerControls';
import VolumeControl from '../VolumeControl/VolumeControl';
import ResetButton from '../ResetButton/ResetButton';

function Player() {
    const soundController = useRef<undefined | SoundDriver>(undefined);
    const [loading, setLoading] = useState(false);
    const [hasAudio, setHasAudio] = useState(false);

    const loadAudioFile = useCallback(async (audioFile: File) => {
        setLoading(true);

        const soundInstance = new SoundDriver(audioFile);
        try {
            await soundInstance.init(document.getElementById('waveContainer'));
            soundController.current = soundInstance;
            soundInstance.drawChart();
            setHasAudio(true);
        } catch (err) {
            console.error('Failed to load audio:', err);
        } finally {
            setLoading(false);
        }
    }, []);

    const togglePlayer = useCallback(
        (type: string) => () => {
            if (type === 'play') {
                soundController.current?.play();
            } else if (type === 'stop') {
                soundController.current?.pause(true);
            } else {
                soundController.current?.pause();
            }
        },
        []
    );

    const onVolumeChange = useCallback(
        (event: React.ChangeEvent<HTMLInputElement>) => {
            soundController.current?.changeVolume(Number(event.target.value));
        },
        [soundController]
    );

    const handleReset = useCallback(() => {
        soundController.current?.pause(true);
        soundController.current = undefined;
        setHasAudio(false);
        const waveContainer = document.getElementById('waveContainer');
        if (waveContainer) {
            waveContainer.innerHTML = '';
        }
    }, []);

    return (
        <div style={{ width: '100%', height: '100%', position: 'relative' }}>
            {loading && <LoadingMessage />}

            <FileUpload
                onFileSelect={loadAudioFile}
                isDisabled={hasAudio || loading}
            />

            <DragAndDrop
                onFileSelect={loadAudioFile}
                isDisabled={hasAudio || loading}
            />

            {!loading && hasAudio && (
                <div id="soundEditor">
                    <ResetButton onReset={handleReset} />

                    <div id="controllPanel">
                        <PlayerControls
                            onPlay={togglePlayer('play')}
                            onPause={togglePlayer('pause')}
                            onStop={togglePlayer('stop')}
                        />

                        <VolumeControl onChange={onVolumeChange} />
                    </div>
                </div>
            )}
        </div>
    );
}

export default Player;
