import { useCallback, useRef, type ChangeEvent } from 'react';
import type { FileUploadProps } from '../../types/component.types';
import styles from './FileUpload.module.scss';

function FileUpload({ onFileSelect }: FileUploadProps) {
    const inputRef = useRef<HTMLInputElement>(null);

    const handleChange = useCallback(
        (event: ChangeEvent<HTMLInputElement>) => {
            const { files } = event.target;
            if (files && files.length > 0) {
                const file = files[0];
                if (file.type.includes('audio')) {
                    onFileSelect(file);
                } else {
                    alert('Please select an audio file');
                }
            }
        },
        [onFileSelect]
    );

    const handleButtonClick = useCallback(() => {
        inputRef.current?.click();
    }, []);

    return (
        <>
            <button
                type="button"
                className={styles.uploadButton}
                onClick={handleButtonClick}
            >
                Choose Audio File
            </button>
            <input
                ref={inputRef}
                type="file"
                name="sound"
                onChange={handleChange}
                accept="audio/*"
                className={styles.hiddenInput}
            />
        </>
    );
}

export default FileUpload;
