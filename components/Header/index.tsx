import { useState } from 'react'
import styles from './styles.module.css'
import BackIcon from './backIcon.svg';
import { useAppContext } from '../../contexts/app';
import Link from 'next/link';

type Props = {
    backHref: string;
    color: string;
    title?: string
    subtitle?: string
    invert?: boolean
}

export const Header = ({ backHref, color, title, subtitle, invert }: Props) => {

    const { tenant } = useAppContext();


    return (
        <div className={styles.container}>
            <div className={styles.leftSide}>
                <Link legacyBehavior href={backHref}>
                    <a className={invert ? styles.buttonTransparent : ''}>
                        <BackIcon className={styles.svgBackIcon} color={invert ? "#FFF" : color} />
                    </a>
                </Link>
            </div>
            <div className={styles.centerSide}>
                {title && <div className={styles.title} style={{ color: invert ? "#FFF" : "#1b1b1b" }}>{title}</div>}
                {subtitle && <div className={styles.subTitle}>{subtitle}</div>}
            </div>
            <div className={styles.rightSide}></div>
        </div>
    )
}