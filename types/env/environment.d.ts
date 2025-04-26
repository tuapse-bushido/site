/* eslint-disable @typescript-eslint/consistent-type-definitions */
declare global {
  namespace NodeJS {
    interface ProcessEnv {
      NEXT_PUBLIC_IMAGES_DOMAIN: string;
      DB_HOST: string;
      DB_PORT: number;
      DB_DATABASE: string;
      DB_USER: string;
      DB_PASSWORD: string;
      ACCESS_KEY_ID: string;
      SECRET_KEY_ID: string;
      ENDPOINT: string;
      BUCKET: string;
      SMS_SEND: string;
    }
  }
}

export {};
