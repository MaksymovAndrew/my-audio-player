import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { AudioProvider } from './context/AudioContext';
import './index.css';
import App from './App.tsx';

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <BrowserRouter>
            <AudioProvider>
                <App />
            </AudioProvider>
        </BrowserRouter>
    </StrictMode>
);
