import type { ResetButtonProps } from '../../types/component.types';
import styles from './ResetButton.module.scss';

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
