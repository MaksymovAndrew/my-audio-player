import Button from '../Button/Button';
import styles from './ResetButton.module.scss';

interface ResetButtonProps {
    onReset: () => void;
}

function ResetButton({ onReset }: ResetButtonProps) {
    return (
        <Button className={styles.resetButton} onClick={onReset}>
            Choose New Audio
        </Button>
    );
}

export default ResetButton;
