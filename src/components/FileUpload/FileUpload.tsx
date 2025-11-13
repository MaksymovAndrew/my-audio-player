import { useCallback, useRef, type ChangeEvent } from 'react';
import { validateAudioFile } from '../../utils/validateAudioFile';
import Button from '../Button/Button';
import styles from './FileUpload.module.scss';

interface FileUploadProps {
    onFileSelect: (file: File) => void;
}

function FileUpload({ onFileSelect }: FileUploadProps) {
    const inputRef = useRef<HTMLInputElement>(null);

    const handleChange = useCallback(
        (event: ChangeEvent<HTMLInputElement>) => {
            const { files } = event.target;
            if (files && files.length > 0) {
                const file = files[0];
                if (validateAudioFile(file)) {
                    onFileSelect(file);
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
            <Button
                className={styles.uploadButton}
                onClick={handleButtonClick}
            >
                Choose Audio File
            </Button>
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
