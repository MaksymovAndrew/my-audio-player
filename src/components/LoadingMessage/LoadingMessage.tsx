import styles from './LoadingMessage.module.scss';

function LoadingMessage() {
    return <div className={styles.loading}>Loading, please wait...</div>;
}

export default LoadingMessage;