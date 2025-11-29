import { createContext, useContext, useState, useMemo, type ReactNode } from 'react';
import type { AudioContextType } from '../types/contextTypes';

const AudioContext = createContext<AudioContextType | undefined>(undefined);

export function AudioProvider({ children }: { children: ReactNode }) {
    const [audioFile, setAudioFile] = useState<File | null>(null);

    const value = useMemo(() => ({ audioFile, setAudioFile }), [audioFile]);

    return (
        <AudioContext.Provider value={value}>
            {children}
        </AudioContext.Provider>
    );
}

export function useAudio() {
    const context = useContext(AudioContext);
    if (context === undefined) {
        throw new Error('useAudio must be used within an AudioProvider');
    }
    return context;
}
