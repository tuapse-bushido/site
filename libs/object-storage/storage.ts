import { S3 } from '@aws-sdk/client-s3';
import path from 'node:path';
import { transliterate } from '@/utils';

export const s3 = new S3({
  credentials: {
    accessKeyId: process.env.ACCESS_KEY_ID,
    secretAccessKey: process.env.SECRET_KEY_ID,
  },
  endpoint: process.env.ENDPOINT,
  forcePathStyle: true,
  region: 'ru-1',
  apiVersion: 'latest',
});

export const uploadImage = async (file: File, dishTitle: string): Promise<string> => {
  const extension = path.extname(file.name).toLowerCase().replace('.', '');
  const contentType = file.type;

  const bufferedImage = await file.arrayBuffer();
  const fileName = `${transliterate(dishTitle)}_${Date.now()}.${extension}`;

  await s3.putObject({
    Bucket: process.env.BUCKET,
    Key: fileName,
    Body: Buffer.from(bufferedImage),
    ContentType: contentType,
  });

  return fileName;
};
