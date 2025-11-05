import { createContext, useContext, useState, type ReactNode } from 'react';

interface AudioContextType {
    audioFile: File | null;
    setAudioFile: (file: File | null) => void;
}

const AudioContext = createContext<AudioContextType | undefined>(undefined);

export function AudioProvider({ children }: { children: ReactNode }) {
    const [audioFile, setAudioFile] = useState<File | null>(null);

    return (
        <AudioContext.Provider value={{ audioFile, setAudioFile }}>
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
