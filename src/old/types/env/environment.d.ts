/* eslint-disable @typescript-eslint/consistent-type-definitions */
declare global {
  namespace NodeJS {
    interface ProcessEnv {
      NEXT_PUBLIC_IMAGES_DOMAIN: string;
      NEXT_PUBLIC_IMAGES_CATEGORIES: string;
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
      JWT_SECRET: string;
      REFRESH_SECRET: string;
      SMS_PILOT_API_KEY: string;
      SMS_PILOT_SEND: string;
    }
  }
}

export {};
