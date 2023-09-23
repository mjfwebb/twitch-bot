import type { ExecException } from 'child_process';
import { execFile } from 'child_process';
import ffmpegPath from 'ffmpeg-static';
import player from 'play-sound';
import type { SOUNDS } from './constants';
import { skipCurrentCommand } from './handlers/botCommandHandler';

type SoundEffect = (typeof SOUNDS)[number];

type SoundFileType = 'wav' | 'mp3';

type Sound = {
  file: string;
  duration: number;
};

const soundQueue: Sound[] = [];
let workingQueue = false;

let playSoundTimeout: NodeJS.Timeout | undefined = undefined;
let timeOutResolve: undefined | ((value: unknown) => void) = undefined;

/**
 * Clears the current sound by cancelling the timeout and playing a silence sound.
 */
export const clearCurrentSound = () => {
  if (timeOutResolve && playSoundTimeout) {
    clearTimeout(playSoundTimeout);
    timeOutResolve(null);
    player().play('../sounds/silence.mp3');
  }
};

/**
 * Retrieves the duration of a process in milliseconds from the stderr output.
 * @param stderr - The stderr output of the process.
 * @returns The duration in milliseconds, or 0 if the duration cannot be extracted.
 */
function getDurationMilliseconds(stderr: string): number {
  const durationInSeconds = /Duration: (\d{2}:\d{2}:\d{2}\.\d{2})/g.exec(stderr);
  if (Array.isArray(durationInSeconds) && durationInSeconds.length > 1) {
    const durationString = durationInSeconds[1];
    const durationParts = durationString.split(':').map(Number);
    const durationInMilliseconds = (durationParts[0] * 3600 + durationParts[1] * 60 + durationParts[2]) * 1000;
    return durationInMilliseconds;
  }

  return 0;
}

/**
 * Retrieves the duration of a sound file using FFmpeg.
 * @param soundFile - The path to the sound file.
 * @returns A Promise that resolves to the duration of the sound file in milliseconds.
 * @throws Error if FFmpeg is not found or an error occurs during the execution.
 */
export async function getDuration(soundFile: string): Promise<number> {
  const args = ['-i', soundFile, '-f', 'null', '-'];

  return await new Promise((resolve, reject) => {
    if (!ffmpegPath) {
      return reject('ffmpeg not found');
    }
    execFile(ffmpegPath, args, (error: ExecException | null, _stdout: string, stderr: string): void => {
      if (error) {
        return reject(error);
      }
      resolve(getDurationMilliseconds(stderr));
    });
  });
}

/**
 * Adds a sound to the sound queue.
 * @param sound - The sound to add to the queue.
 */
function addSoundToQueue(sound: Sound) {
  soundQueue.push(sound);
}

/**
 * Processes the sound queue, playing each sound in sequence.
 * Waits for the duration of each sound to complete before processing the next sound in the queue.
 */
async function workQueue() {
  while (soundQueue.length > 0 && workingQueue === false) {
    workingQueue = true;
    const soundToPlay = soundQueue[0];

    player().play(soundToPlay.file, function (err) {
      if (err) {
        console.error(err);
      }
    });

    soundQueue.splice(0, 1);

    await new Promise(function (resolve) {
      timeOutResolve = resolve;
      playSoundTimeout = setTimeout(resolve, soundToPlay.duration);
    });

    workingQueue = false;
  }
}

/**
 * Plays a sound.
 * @param sound - The sound to play.
 * @returns A Promise that resolves once the sound has finished playing.
 * @remarks Supports both predefined sound effects and custom sound files.
 */
export async function playSound<T extends SoundEffect | string>(sound: T, fileType?: SoundFileType): Promise<void> {
  const fileExtension: string = fileType || 'wav';

  let file: string = sound;
  if (!sound.startsWith('..')) {
    file = `../sounds/${sound}.${fileExtension}`;
  }
  const duration = await getDuration(file);

  if (duration === 0) {
    return;
  }

  skipCurrentCommand();

  addSoundToQueue({
    file,
    duration,
  });
  await workQueue();
}
