import { existsSync, readdir, unlink } from "fs";
import path from "path";
import pc from "picocolors";
import { logger } from "./logger";

export function removeOldTTSFiles() {
  const ttsFolder = "../tts";

  // Check if the folder exists
  if (!existsSync(ttsFolder)) {
    return;
  }

  readdir(ttsFolder, (err, files) => {
    // If there are no files, return
    if (files.length === 0) {
      return;
    }
    // If there is an error, throw it
    if (err) {
      throw err;
    }

    logger.info(
      `Deleting ${pc.green(`${files.length}`)} sound files in ${pc.green(
        `${ttsFolder}`,
      )}`,
    );
    // loop through all the files and delete them
    for (const file of files) {
      unlink(path.join(ttsFolder, file), (err) => {
        if (err) {
          throw err;
        }
      });
    }
  });
}
