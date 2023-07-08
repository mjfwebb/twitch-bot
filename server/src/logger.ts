import pc from 'picocolors';
import Config from './config';
import { isError } from './utils/isError';

export const logLevels = ['error', 'warn', 'info', 'debug'];

export type LogLevel = typeof logLevels[number];

const logLevelsMap: Record<LogLevel, number> = {
  error: 0,
  warn: 1,
  info: 2,
  debug: 3,
} as const;

export const logger = {
  error: (error: unknown) => {
    if (isError(error)) {
      console.error(`${pc.red('Error:')} ${error.message}`);
    } else if (typeof error === 'string') {
      console.error(`${pc.red('Error:')} ${error}`);
    }
  },
  warn: (message: string) => {
    if (logLevelsMap[Config.logLevel] >= logLevelsMap['warn']) {
      console.warn(`${pc.yellow('Warn:')} ${message}`);
    }
  },
  info: (message: string) => {
    if (logLevelsMap[Config.logLevel] >= logLevelsMap['info']) {
      console.info(`${pc.cyan('Info:')} ${message}`);
    }
  },
  debug: (message: string) => {
    if (logLevelsMap[Config.logLevel] >= logLevelsMap['debug']) {
      console.debug(`${pc.magenta('Debug:')} ${message}`);
    }
  },
};
