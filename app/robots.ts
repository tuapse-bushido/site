import type { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const baseUrl = 'https://bushido-tuapse.ru';

  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/cart', '/checkout', '/admin', '/api'],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
