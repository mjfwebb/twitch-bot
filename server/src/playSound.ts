import player from 'play-sound';
import type { SOUNDS } from './constants';

type SoundEffect = typeof SOUNDS[number];

type SoundFileType = 'wav' | 'mp3';

type Sound = {
  fileName: string;
  fileType: string;
  duration: number;
};

const soundQueue: Sound[] = [];
let workingQueue = false;

function addSoundToQueue(sound: Sound) {
  soundQueue.push(sound);
}

async function workQueue() {
  while (soundQueue.length > 0 && workingQueue === false) {
    workingQueue = true;
    const soundToPlay = soundQueue[0];

    player().play(`../tts/${soundToPlay.fileName}.${soundToPlay.fileType}`, function (err) {
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

export function playSound(sound: SoundEffect, fileType: SoundFileType = 'wav'): void {
  player().play(`../sounds/${sound}.${fileType}`, function (err) {
    if (err) {
      console.error(err);
    }
  });
}

export async function playTTS(fileName: string, fileType: SoundFileType = 'wav', duration: number): Promise<void> {
  addSoundToQueue({
    fileName,
    fileType,
    duration,
  });
  await workQueue();

  // player().play(`../tts/${fileName}.${fileType}`, function (err) {
  //   if (err) {
  //     console.error(err);
  //   }
  // });
}
