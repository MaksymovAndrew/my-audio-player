import type { ReactNode } from 'react';
import styles from './Card.module.scss';

interface CardProps {
    className?: string;
    children: ReactNode;
}

function Card({ className, children }: CardProps) {
    const cardClass = className ? `${styles.card} ${className}` : styles.card;

    return <div className={cardClass}>{children}</div>;
}

export default Card;
