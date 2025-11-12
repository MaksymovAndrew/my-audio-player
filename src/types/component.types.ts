import type { ChangeEvent } from 'react';

export interface FileUploadProps {
    onFileSelect: (file: File) => void;
}

export interface DragAndDropProps {
    onFileSelect: (file: File) => void;
}

export interface PlayerControlsProps {
    onPlay: () => void;
    onPause: () => void;
    onStop: () => void;
}

export interface VolumeControlProps {
    onChange: (event: ChangeEvent<HTMLInputElement>) => void;
}

export interface ResetButtonProps {
    onReset: () => void;
}

export interface TrackInfoProps {
    duration: number;
    fileName?: string;
}
