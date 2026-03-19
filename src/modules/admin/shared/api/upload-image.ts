import path from 'path';
import { s3 } from 'modules/admin/shared/config/object-storage';
import { transliterate } from 'modules/admin/shared/utils/transliterate.utils';

export const uploadImage = async (file: File, title: string): Promise<string> => {
  const extension = path.extname(file.name).toLowerCase().replace('.', '');
  const contentType = file.type;

  const bufferedImage = await file.arrayBuffer();
  const fileName = `${transliterate(title)}_${Date.now()}.${extension}`;

  await s3.putObject({
    Bucket: process.env.BUCKET,
    Key: fileName,
    Body: Buffer.from(bufferedImage),
    ContentType: contentType,
  });

  return fileName;
};
