import fs from 'fs';
import { logger } from '../logger';

export function createTTSDirectory() {
  const ttsDirectory = '../tts';
  if (!fs.existsSync(ttsDirectory)) {
    logger.info(`Creating TTS directory: ${ttsDirectory}`);
    fs.mkdirSync(ttsDirectory);
  }
}
