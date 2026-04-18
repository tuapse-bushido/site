import pino from 'pino';
import fs from 'fs';
import path from 'path';
import * as rfs from 'rotating-file-stream';
import pretty from 'pino-pretty';

const isProduction = process.env.NODE_ENV === 'production';
const logFile = process.env.LOG_FILE_PATH || './logs/app.log';
const logDirectory = path.dirname(logFile);

if (isProduction && !fs.existsSync(logDirectory)) {
  fs.mkdirSync(logDirectory, { recursive: true });
}

const streams: pino.StreamEntry[] = [];

if (isProduction) {
  streams.push({ level: 'info', stream: process.stdout });

  streams.push({
    level: 'info',
    stream: rfs.createStream(path.basename(logFile), {
      interval: '1d',
      path: logDirectory,
      maxFiles: 14,
      compress: 'gzip',
    }),
  });

  streams.push({
    level: 'error',
    stream: rfs.createStream('error.log', {
      interval: '1d',
      path: logDirectory,
      maxFiles: 30,
      compress: 'gzip',
    }),
  });
} else {
  streams.push({
    stream: pretty({
      colorize: true,
      translateTime: 'SYS:standard',
      messageFormat: '{levelLabel} | {event} | {msg}',
      customColors: 'info:blue,warn:yellow,error:red,fatal:bgRed',
    }),
  });
}

export const logger = pino(
  {
    level: 'info',
    base: isProduction ? { env: 'prod' } : null,
  },
  pino.multistream(streams),
);
