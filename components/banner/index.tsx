import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay } from "swiper";
import 'swiper/css';
import styles from './styles.module.css'



export const Banner = () => {
    return (
        <div className={styles.container}>

            <Swiper className={styles.swiper}
                slidesPerView={1}
                loop={true}
                autoplay={{
                    delay: 2500,
                    disableOnInteraction: true,
                }}
                navigation={false}
                modules={[Autoplay]}
            >
                <SwiperSlide className={styles.slider}><img src='/tmp/banner1.png' /></SwiperSlide>
                <SwiperSlide className={styles.slider}><img src='/tmp/banner2.png' /></SwiperSlide>
            </Swiper>

        </div>
    )
}