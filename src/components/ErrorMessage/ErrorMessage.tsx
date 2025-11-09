import { useNavigate } from 'react-router-dom';
import styles from './ErrorMessage.module.scss';

function ErrorMessage() {
    const navigate = useNavigate();

    return (
        <div className={styles.error}>
            <div className={styles.message}>Something went wrong...</div>
            <button
                type="button"
                className={styles.button}
                onClick={() => navigate('/')}
            >
                Go to Home
            </button>
        </div>
    );
}

export default ErrorMessage;
