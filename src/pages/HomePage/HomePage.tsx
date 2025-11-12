import { useAudio } from '../../context/AudioContext';
import DragAndDrop from '../../components/DragAndDrop/DragAndDrop';
import FileUpload from '../../components/FileUpload/FileUpload';
import styles from './HomePage.module.scss';

function HomePage() {
    const { setAudioFile } = useAudio();

    return (
        <div className={styles.container}>
            <FileUpload onFileSelect={setAudioFile} />
            <DragAndDrop onFileSelect={setAudioFile} />
        </div>
    );
}

export default HomePage;
