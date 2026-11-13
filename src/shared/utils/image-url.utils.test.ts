import { afterEach, describe, expect, it, vi } from 'vitest';
import { getImageUrl } from './image-url.utils';

afterEach((): void => vi.unstubAllEnvs());

describe('getImageUrl', (): void => {
  it('uses the storage URL when the public environment variable is missing', (): void => {
    vi.stubEnv('NEXT_PUBLIC_IMAGES_DOMAIN', undefined);
    expect(getImageUrl('products/filadelfiya.jpg')).toBe('https://s3.regru.cloud/bushido/products/filadelfiya.jpg');
  });

  it('uses the storage URL when the public environment variable is empty', (): void => {
    vi.stubEnv('NEXT_PUBLIC_IMAGES_DOMAIN', '');
    expect(getImageUrl('categories/sushi.jpg')).toBe('https://s3.regru.cloud/bushido/categories/sushi.jpg');
  });

  it.each(['https://example.com/images', 'https://example.com/images/'])(
    'joins the storage root and object key with a single slash: %s',
    (domain): void => {
      vi.stubEnv('NEXT_PUBLIC_IMAGES_DOMAIN', domain);
      expect(getImageUrl('/products/sushi.jpg')).toBe('https://example.com/images/products/sushi.jpg');
    },
  );

  it('preserves an absolute image URL', (): void => {
    expect(getImageUrl('https://example.com/products/sushi.jpg')).toBe('https://example.com/products/sushi.jpg');
  });

  it('uses the placeholder for an empty image path', (): void => {
    vi.stubEnv('NEXT_PUBLIC_IMAGES_DOMAIN', 'https://example.com/images/');
    expect(getImageUrl(null)).toBe('https://example.com/images/no-image.png');
  });
});
