'use client';

import { ChangeEvent, JSX, useRef, useState } from 'react';
import Image from 'next/image';
import styles from './picked-image.module.scss';
import { PickedImageProps } from './picked-image.props';

export const PickedImage = ({ imageLink, altImage }: PickedImageProps): JSX.Element => {
  const imageInput = useRef<HTMLInputElement>(null);

  const [pickedImage, setPickedImage] = useState<string | null>((): string => {
    if (imageLink) {
      return `${process.env.NEXT_PUBLIC_IMAGES_DOMAIN}/${imageLink}`;
    }
    return `${process.env.NEXT_PUBLIC_IMAGES_DOMAIN}/no_image.png`;
  });

  const handleAddImage = (e: ChangeEvent<HTMLInputElement>): void => {
    const file = e.target.files?.item(0);
    if (!file) return;

    const fileReader = new FileReader();

    fileReader.onload = (): void => {
      if (typeof fileReader.result === 'string') {
        setPickedImage(fileReader.result); // update ok
      }
    };

    fileReader.readAsDataURL(file);
  };

  return (
    <>
      <div className={styles.imageWrapper}>
        {pickedImage && (
          <Image
            src={pickedImage}
            alt={altImage ?? 'Изображение отсутствует'}
            width={100}
            height={100}
            sizes="(max-width: 1439px) 25vw"
            priority
          />
        )}
      </div>

      <input
        ref={imageInput}
        accept="image/png, image/jpg, image/jpeg"
        type="file"
        name="image_file"
        onChange={handleAddImage}
      />

      <button type="button" title="Загрузить фото" />
    </>
  );
};
