import { useCallback, useState, type DragEvent } from 'react';
import { validateAudioFile } from '../../utils/validateAudioFile';
import styles from './DragAndDrop.module.scss';

interface DragAndDropProps {
    onFileSelect: (file: File) => void;
}

function DragAndDrop({ onFileSelect }: DragAndDropProps) {
    const [isDragging, setIsDragging] = useState(false);

    const handleDragOver = useCallback((event: DragEvent<HTMLDivElement>) => {
        event.preventDefault();
        event.stopPropagation();
        setIsDragging(true);
    }, []);

    const handleDragLeave = useCallback((event: DragEvent<HTMLDivElement>) => {
        event.preventDefault();
        event.stopPropagation();
        setIsDragging(false);
    }, []);

    const handleDrop = useCallback(
        (event: DragEvent<HTMLDivElement>) => {
            event.preventDefault();
            event.stopPropagation();
            setIsDragging(false);

            const { files } = event.dataTransfer;
            if (files && files.length > 0) {
                const file = files[0];
                if (validateAudioFile(file)) {
                    onFileSelect(file);
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
