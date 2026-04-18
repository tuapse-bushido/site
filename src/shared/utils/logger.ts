import pino from 'pino';
import path from 'path';

const isProduction = process.env.NODE_ENV === 'production';
const logDirectory = './logs';

export const logger = pino(
  {
    level: 'info',
  },
  pino.transport({
    targets: [
      {
        target: 'pino-pretty',
        options: {
          destination: 1,
          colorize: !isProduction,
          translateTime: 'SYS:standard',
        },
        level: 'info',
      },
      ...(isProduction
        ? [
            {
              target: 'pino-roll',
              options: {
                file: path.join(logDirectory, 'app'),
                frequency: 'daily',
                extension: '.log',
                mkdir: true,
                limit: {
                  count: 14,
                },
              },
              level: 'info',
            },
          ]
        : []),
    ],
  }),
);
