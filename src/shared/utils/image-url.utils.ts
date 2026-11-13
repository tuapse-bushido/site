const DEFAULT_IMAGES_DOMAIN = 'https://s3.regru.cloud/bushido/';

export const getImageUrl = (imageLink?: string | null): string => {
  const imagePath = imageLink?.trim() || 'no-image.png';

  if (/^https?:\/\//i.test(imagePath)) return imagePath;

  const domain = process.env.NEXT_PUBLIC_IMAGES_DOMAIN?.trim() || DEFAULT_IMAGES_DOMAIN;

  return `${domain.replace(/\/+$/, '')}/${imagePath.replace(/^\/+/, '')}`;
};
