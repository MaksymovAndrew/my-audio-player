import { useNavigate } from 'react-router-dom';
import { useAudio } from '../../context/AudioContext';
import DragAndDrop from '../../components/DragAndDrop/DragAndDrop';
import FileUpload from '../../components/FileUpload/FileUpload';
import styles from './HomePage.module.scss';

function HomePage() {
    const { setAudioFile } = useAudio();
    const navigate = useNavigate();

    const handleFileSelect = (file: File) => {
        setAudioFile(file);
        navigate('/player');
    };

    return (
        <div className={styles.container}>
            <FileUpload onFileSelect={handleFileSelect} />
            <DragAndDrop onFileSelect={handleFileSelect} />
        </div>
    );
}

export default HomePage;
