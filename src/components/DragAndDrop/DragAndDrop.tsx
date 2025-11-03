import React, { useCallback, useState } from 'react';
import styles from './DragAndDrop.module.scss';

interface DragAndDropProps {
    onFileSelect: (file: File) => void;
    isDisabled: boolean;
}

function DragAndDrop({ onFileSelect, isDisabled }: DragAndDropProps) {
    const [isDragging, setIsDragging] = useState(false);

    const handleDragOver = useCallback(
        (event: React.DragEvent<HTMLDivElement>) => {
            event.preventDefault();
            event.stopPropagation();

            if (isDisabled) {
                return;
            }

            setIsDragging(true);
        },
        [isDisabled]
    );

    const handleDragLeave = useCallback(
        (event: React.DragEvent<HTMLDivElement>) => {
            event.preventDefault();
            event.stopPropagation();

            if (isDisabled) {
                return;
            }

            setIsDragging(false);
        },
        [isDisabled]
    );

    const handleDrop = useCallback(
        (event: React.DragEvent<HTMLDivElement>) => {
            event.preventDefault();
            event.stopPropagation();

            if (isDisabled) {
                return;
            }

            setIsDragging(false);

            const { files } = event.dataTransfer;
            if (files && files.length > 0) {
                const file = files[0];
                if (file.type.includes('audio')) {
                    onFileSelect(file);
                } else {
                    alert('Please drop an audio file');
                }
            }
        },
        [isDisabled, onFileSelect]
    );

    return (
        <div
            className={`${styles.dragAndDrop} ${isDragging ? styles.dragging : ''} ${
                isDisabled ? styles.disabled : ''
            }`}
            id="waveContainer"
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
        >
            {!isDisabled && (
                <div className={styles.placeholder}>Drag and drop audio files to get started</div>
            )}
        </div>
    );
}

export default DragAndDrop;
