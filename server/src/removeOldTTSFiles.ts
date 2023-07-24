import { readdir, unlink } from 'fs';
import path from 'path';
import pc from 'picocolors';
import { logger } from './logger';

export function removeOldTTSFiles() {
  // Delete all the files in the ../tts folder
  const ttsFolder = '../tts';
  readdir(ttsFolder, (err, files) => {
    if (files.length === 0) {
      return;
    }
    if (err) {
      throw err;
    }
    logger.info(`Deleting ${pc.green(`${files.length}`)} sound files in ${pc.green(`${ttsFolder}`)}`);

    for (const file of files) {
      unlink(path.join(ttsFolder, file), (err) => {
        if (err) {
          throw err;
        }
      });
    }
  });
}
