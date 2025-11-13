import type { ReactNode } from 'react';
import styles from './Button.module.scss';

interface ButtonProps {
    className?: string;
    onClick?: () => void;
    children: ReactNode;
    type?: 'button' | 'submit' | 'reset';
    disabled?: boolean;
}

function Button({ className, onClick, children, type = 'button', disabled = false }: ButtonProps) {
    const buttonClass = className ? `${styles.button} ${className}` : styles.button;

    return (
        <button
            type={type}
            className={buttonClass}
            onClick={onClick}
            disabled={disabled}
        >
            {children}
        </button>
    );
}

export default Button;
