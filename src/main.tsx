import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { AudioProvider } from './context/AudioContext';
import './index.css';
import App from './App.tsx';

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <AudioProvider>
            <App />
        </AudioProvider>
    </StrictMode>
);
