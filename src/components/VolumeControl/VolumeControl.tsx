import { useState, type ChangeEvent } from 'react';
import styles from './VolumeControl.module.scss';

interface VolumeControlProps {
    onChange: (event: ChangeEvent<HTMLInputElement>) => void;
}

function VolumeControl({ onChange }: VolumeControlProps) {
    const [volume, setVolume] = useState(1);

    const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
        const value = Number(event.target.value);
        setVolume(value);
        onChange(event);
    };

    const volumePercent = Math.round(volume * 100);

    return (
        <div className={styles.volumeContainer}>
            <label className={styles.label}>Volume:</label>
            <input
                type="range"
                className={styles.slider}
                onChange={handleChange}
                defaultValue={1}
                min={0}
                max={1}
                step={0.01}
            />
            <span className={styles.value}>{volumePercent}</span>
        </div>
    );
}

export default VolumeControl;
