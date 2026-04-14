import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Бушидо — доставка роллов, суши и пиццы',
    short_name: 'Бушидо',
    description: 'Доставка японской кухни и пиццы в Туапсе. Заказ от 500₽. Быстро, вкусно, по-самурайски!',
    start_url: '/',
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: '#e60000',
    icons: [
      {
        src: '/icons/android-chrome-192x192.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: '/icons/android-chrome-512x512.png',
        sizes: '512x512',
        type: 'image/png',
      },
    ],
  };
}
