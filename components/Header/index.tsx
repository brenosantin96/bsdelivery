import { useState } from 'react'
import styles from './styles.module.css'
import BackIcon from './backIcon.svg';
import { useAppContext } from '@/contexts/AppContext';
import Link from 'next/link';

type Props = {
    backHref: string;
    color: string;
    title?: string
    subtitle?: string
}

export const Header = ({ backHref, color, title, subtitle }: Props) => {

    const { tenant } = useAppContext();


    return (
        <div className={styles.container}>
            <div className={styles.leftSide}>
                <Link href={backHref}>
                    <BackIcon className={styles.svgBackIcon} color={color} />
                </Link>
            </div>
            <div className={styles.centerSide}>
                {title && <div className={styles.title}>{title}</div>}
                {subtitle && <div className={styles.subTitle}>{subtitle}</div>}
            </div>
            <div className={styles.rightSide}></div>
        </div>
    )
}