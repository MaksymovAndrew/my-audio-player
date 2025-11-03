import React, { useCallback, useState, useRef } from 'react';
import SoundDriver from './SoundDriver';
import DragAndDrop from '../DragAndDrop/DragAndDrop';
import FileUpload from '../FileUpload/FileUpload';
import LoadingMessage from '../Loading/LoadingMessage';
import PlayerControls from '../PlayerControls/PlayerControls';
import VolumeControl from '../VolumeControl/VolumeControl';

function Player() {
    const soundController = useRef<undefined | SoundDriver>(undefined);
    const [loading, setLoading] = useState(false);

    const loadAudioFile = useCallback(async (audioFile: File) => {
        setLoading(true);

        const soundInstance = new SoundDriver(audioFile);
        try {
            await soundInstance.init(document.getElementById('waveContainer'));
            soundController.current = soundInstance;
            soundInstance.drawChart();
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

    return (
        <div style={{ width: '100%' }}>
            {loading && <LoadingMessage />}

            <FileUpload
                onFileSelect={loadAudioFile}
                isDisabled={!!soundController.current || loading}
            />

            <DragAndDrop
                onFileSelect={loadAudioFile}
                isDisabled={!!soundController.current || loading}
            />

            {!loading && soundController.current && (
                <div id="soundEditor">
                    <div id="controllPanel">
                        <VolumeControl onChange={onVolumeChange} />

                        <PlayerControls
                            onPlay={togglePlayer('play')}
                            onPause={togglePlayer('pause')}
                            onStop={togglePlayer('stop')}
                        />
                    </div>
                </div>
            )}
        </div>
    );
}

export default Player;
