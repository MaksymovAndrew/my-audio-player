import styles from './ResetButton.module.scss';

interface ResetButtonProps {
    onReset: () => void;
}

function ResetButton({ onReset }: ResetButtonProps) {
    return (
        <button
            type="button"
            className={styles.resetButton}
            onClick={onReset}
        >
            Choose New Audio
        </button>
    );
}

export default ResetButton;
