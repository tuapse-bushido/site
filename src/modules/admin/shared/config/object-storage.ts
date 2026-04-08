import { S3 } from '@aws-sdk/client-s3';

export const s3 = new S3({
  credentials: {
    accessKeyId: process.env.ACCESS_KEY_ID as string,
    secretAccessKey: process.env.SECRET_KEY_ID as string,
  },

  endpoint: process.env.ENDPOINT!,
  forcePathStyle: true,
  region: 'ru-1',
});
