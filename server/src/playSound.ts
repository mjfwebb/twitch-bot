import player from 'play-sound';
import type { SOUNDS } from './constants';
import ffmpegPath from 'ffmpeg-static';
import type { ExecException } from 'child_process';
import { execFile } from 'child_process';

type SoundEffect = typeof SOUNDS[number];

type SoundFileType = 'wav' | 'mp3';

type Sound = {
  file: string;
  duration: number;
};

const soundQueue: Sound[] = [];
let workingQueue = false;

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

function addSoundToQueue(sound: Sound) {
  soundQueue.push(sound);
}

async function workQueue() {
  while (soundQueue.length > 0 && workingQueue === false) {
    workingQueue = true;
    const soundToPlay = soundQueue[0];

    player().play(soundToPlay.file, function (err) {
      if (err) {
        console.error(err);
      }
    });

    await new Promise(function (resolve) {
      setTimeout(resolve, soundToPlay.duration);
    });

    soundQueue.splice(0, 1);
    workingQueue = false;
  }
}

export async function playSound<T extends string>(sound: T): Promise<void>;
export async function playSound<T extends SoundEffect | string>(sound: T, fileType?: SoundFileType): Promise<void> {
  const fileExtension: string = fileType || 'wav';

  let file: string = sound;
  if (!sound.startsWith('..')) {
    file = `../sounds/${sound}.${fileExtension}`;
  }
  const duration = await getDuration(file);

  if (duration === 0) {
    console.log('duration');
    return;
  }

  addSoundToQueue({
    file,
    duration,
  });
  await workQueue();
}
