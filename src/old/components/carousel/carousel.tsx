import styles from './carousel.module.scss';
import { JSX } from 'react';
import { SwiperClient } from '@/components/carousel/swiper-client/swiper-client';

/**
 * Carousel component.
 *
 * Displays a swipeable image slider using the `SwiperClient` component.
 * Currently uses a static list of image URLs, which will later be replaced
 * with a dynamic request to a database.
 *
 * ---
 * Компонент карусели.
 *
 * Отображает свайпер с изображениями через компонент `SwiperClient`.
 * Сейчас используется временный массив ссылок, который в будущем будет
 * заменён на динамический запрос к базе данных.
 */
export const Carousel = (): JSX.Element => {
  const swiper = ['/carousel/image.png', '/carousel/image1.png', '/carousel/image2.png', '/carousel/image3.png'];

  return (
    <div className={styles.sliderWrapper}>
      <SwiperClient items={swiper} />
    </div>
  );
};
