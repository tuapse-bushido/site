'use client';

import Image from 'next/image';
import { Box, Button } from '@mui/material';
import styles from './picked-image.module.scss';
import { PickedImageProps } from './picked-image.props';
import { ChangeEvent, JSX, useRef, useState } from 'react';

export const PickedImage = ({ imageLink, altImage }: PickedImageProps): JSX.Element => {
  const link = imageLink
    ? `${process.env.NEXT_PUBLIC_IMAGES_DOMAIN}/${imageLink}`
    : `${process.env.NEXT_PUBLIC_IMAGES_DOMAIN}/no_image.png`;

  const inputRef = useRef<HTMLInputElement>(null);

  const [pickedImage, setPickedImage] = useState<string>(link);

  const handleAddImage = (e: ChangeEvent<HTMLInputElement>): void => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();

    reader.onload = (): void => {
      if (typeof reader.result === 'string') {
        setPickedImage(reader.result);
      }
    };

    reader.readAsDataURL(file);
  };

  return (
    <Box display="flex" flexDirection="column">
      <Box className={styles.imageWrapper}>
        <Image
          src={pickedImage}
          alt={altImage ?? 'Изображение отсутствует'}
          width={100}
          height={100}
          sizes="(max-width: 1439px) 25vw"
          priority
        />
      </Box>

      <input
        ref={inputRef}
        name="image_file"
        type="file"
        accept="image/jpeg, image/png, image/webp"
        hidden
        onChange={handleAddImage}
      />

      <input name="current_image" defaultValue={imageLink ?? 'no_image.png'} hidden />

      <Button variant="outlined" size="small" onClick={(): void => inputRef.current?.click()}>
        Загрузить изображение
      </Button>
    </Box>
  );
};
