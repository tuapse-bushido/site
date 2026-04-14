import path from 'path';
import { s3 } from 'modules/admin/shared/config/object-storage';
import { transliterate } from 'modules/admin/shared/utils/transliterate.utils';

const formatDate = (d: Date): string => {
  const day = String(d.getDate()).padStart(2, '0');
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const year = d.getFullYear();

  return `${day}.${month}.${year}`;
};

export const uploadImage = async (file: File, title: string, folder: 'products' | 'categories'): Promise<string> => {
  const extension = path.extname(file.name).toLowerCase().replace('.', '');
  const contentType = file.type;

  const bufferedImage = await file.arrayBuffer();

  const fileName = `${folder}/${transliterate(title)}_${formatDate(new Date())}.${extension}`;

  await s3.putObject({
    Bucket: process.env.BUCKET,
    Key: fileName,
    Body: Buffer.from(bufferedImage),
    ContentType: contentType,
  });

  return fileName;
};
