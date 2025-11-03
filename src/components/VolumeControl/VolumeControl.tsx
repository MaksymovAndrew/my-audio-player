import React from 'react';

interface VolumeControlProps {
    onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

function VolumeControl({ onChange }: VolumeControlProps) {
    return (
        <input
            type="range"
            onChange={onChange}
            defaultValue={1}
            min={-1}
            max={1}
            step={0.01}
        />
    );
}

export default VolumeControl;
