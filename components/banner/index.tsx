import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import styles from './styles.module.css'



export const Banner = () => {
    return (
        <div className={styles.container}>

            <Swiper className={styles.swiper} slidesPerView={1}>
                <SwiperSlide className={styles.slider}><img src='/tmp/banner1.png' /></SwiperSlide>
                <SwiperSlide className={styles.slider}><img src='/tmp/banner2.png' /></SwiperSlide>
            </Swiper>

        </div>
    )
}