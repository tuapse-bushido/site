import { S3 } from '@aws-sdk/client-s3';

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
