import player from 'play-sound';
import type { SOUNDS } from './constants';

type SoundEffect = typeof SOUNDS[number];

type SoundFileType = 'wav' | 'mp3';

export function playSound(sound: SoundEffect, fileType: SoundFileType = 'wav'): void {
  player().play(`../sounds/${sound}.${fileType}`, function (err) {
    if (err) {
      console.error(err);
    }
  });
}

export function playTTS(fileName: string, fileType: SoundFileType = 'wav'): void {
  player().play(`../tts/${fileName}.${fileType}`, function (err) {
    if (err) {
      console.error(err);
    }
  });
}
