'use client';

import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination } from 'swiper/modules';

import { JSX } from 'react';
import { SwiperClientProps } from '@/components/carousel/swiper-client/swiper-client.props';
import Image from 'next/image';

/**
 * SwiperClient component.
 *
 * Renders an autoplaying and looping image slider using the Swiper library.
 * Accepts an array of image URLs and displays them with responsive settings.
 * Includes pagination and accessibility features.
 *
 * ---
 * Компонент `SwiperClient`.
 *
 * Отображает автоматически переключаемую и зацикленную карусель изображений
 * с использованием библиотеки Swiper. Принимает массив URL-адресов изображений.
 * Поддерживает пагинацию и доступность.
 */
export const SwiperClient = ({ items }: SwiperClientProps): JSX.Element => {
  return (
    <Swiper
      a11y={{
        paginationBulletMessage: 'Перейти к слайду {{index}}',
      }}
      slidesPerView="auto"
      centeredSlides
      spaceBetween={10}
      loop
      autoplay={{ delay: 5000, disableOnInteraction: false }}
      pagination={{ clickable: true }}
      modules={[Autoplay, Pagination]}
    >
      {items.map(
        (item, index): JSX.Element => (
          <SwiperSlide key={index}>
            {<Image src={item} alt={item} fill sizes="(max-width: 440px) 100vw" priority={index === 0} />}
          </SwiperSlide>
        ),
      )}
    </Swiper>
  );
};
