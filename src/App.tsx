import { Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage/HomePage';
import PlayerPage from './pages/PlayerPage/PlayerPage';
import './App.css';

function App() {
    return (
        <div className="App">
            <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/player" element={<PlayerPage />} />
            </Routes>
        </div>
    );
}

export default App;
