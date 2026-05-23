'use client';

import Image from 'next/image';
import { PickedImageProps } from './picked-image.props';
import { ChangeEvent, JSX, useRef, useState } from 'react';
import { MuiBox, MuiButton, MuiStack } from 'modules/admin/shared/ui/mui';

export const PickedImage = ({ imageLink, altImage }: PickedImageProps): JSX.Element => {
  const link = imageLink
    ? process.env.NEXT_PUBLIC_IMAGES_DOMAIN + imageLink
    : process.env.NEXT_PUBLIC_IMAGES_DOMAIN + 'no-image.png';

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
    <MuiStack display="flex" flexDirection="column" gap={2} sx={{ width: '100%', height: '100%' }}>
      <MuiBox sx={{ position: 'relative', width: '100%', flexGrow: 1, overflow: 'hidden' }}>
        <Image
          src={pickedImage}
          alt={altImage ?? 'Изображение отсутствует'}
          sizes="(max-width: 599.95px) 100vw, 500px"
          priority
          fill
          style={{ objectFit: 'contain' }}
        />
      </MuiBox>

      <input
        ref={inputRef}
        name="image_file"
        type="file"
        accept="image/jpeg, image/png, image/webp"
        hidden
        onChange={handleAddImage}
      />

      <input name="current_image" defaultValue={imageLink ?? 'no-image.png'} hidden />

      <MuiButton variant="outlined" size="medium" onClick={(): void => inputRef.current?.click()}>
        Загрузить изображение
      </MuiButton>
    </MuiStack>
  );
};
