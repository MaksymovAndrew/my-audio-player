import { useCallback, useState, type DragEvent } from 'react';
import type { DragAndDropProps } from '../../types/component.types';
import styles from './DragAndDrop.module.scss';

function DragAndDrop({ onFileSelect }: DragAndDropProps) {
    const [isDragging, setIsDragging] = useState(false);

    const handleDragOver = useCallback(
        (event: DragEvent<HTMLDivElement>) => {
            event.preventDefault();
            event.stopPropagation();
            setIsDragging(true);
        },
        []
    );

    const handleDragLeave = useCallback(
        (event: DragEvent<HTMLDivElement>) => {
            event.preventDefault();
            event.stopPropagation();
            setIsDragging(false);
        },
        []
    );

    const handleDrop = useCallback(
        (event: DragEvent<HTMLDivElement>) => {
            event.preventDefault();
            event.stopPropagation();
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
        [onFileSelect]
    );

    return (
        <div
            className={`${styles.dragAndDrop} ${isDragging ? styles.dragging : ''}`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
        >
            <div className={styles.placeholder}>Drag and drop audio Files</div>
        </div>
    );
}

export default DragAndDrop;
