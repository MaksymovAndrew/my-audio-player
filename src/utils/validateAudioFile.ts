export const validateAudioFile = (file: File): boolean => {
    if (file.type.includes('audio')) {
        return true;
    }
    alert('Please select an audio file');
    return false;
};
