import { useAppContext } from '@/contexts/AppContext';
import { Product } from '@/types/Product'
import Link from 'next/link';
import styles from './styles.module.css'

type PropsProductItem = {
    data: Product;
}

export const ProductItem = ({ data }: PropsProductItem) => {

    const {tenant} = useAppContext();

    return (
        <Link legacyBehavior href={`/${tenant?.slug}/product/${data.id}`}>
            <a className={styles.container}>
                <div className={styles.head} style={{ backgroundColor: tenant?.secondColor }}></div>
                <div className={styles.info}>
                    <div className={styles.img}>
                        <img src={data.image} alt="" />
                    </div>
                    <div className={styles.catName}>{data.categoryName}</div>
                    <div className={styles.name}>{data.name}</div>
                    <div className={styles.price} style={{ color: tenant?.mainColor }}>{data.price}</div>
                </div>
            </a>
        </Link>
    )
}