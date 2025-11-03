import React, { useCallback, useRef } from 'react';
import styles from './FileUpload.module.scss';

interface FileUploadProps {
    onFileSelect: (file: File) => void;
    isDisabled: boolean;
}

function FileUpload({ onFileSelect, isDisabled }: FileUploadProps) {
    const inputRef = useRef<HTMLInputElement>(null);

    const handleChange = useCallback(
        (event: React.ChangeEvent<HTMLInputElement>) => {
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

    if (isDisabled) {
        return null;
    }

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
