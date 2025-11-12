import { useAudio } from './context/AudioContext';
import HomePage from './pages/HomePage/HomePage';
import PlayerPage from './pages/PlayerPage/PlayerPage';
import './App.css';

function App() {
    const { audioFile } = useAudio();

    return (
        <div className="App">
            {audioFile ? <PlayerPage /> : <HomePage />}
        </div>
    );
}

export default App;
