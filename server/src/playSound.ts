import player from 'play-sound';
import type { SOUNDS } from './constants';

type SoundEffect = typeof SOUNDS[number];

export function playSound(sound: SoundEffect): void {
  player().play(`../sounds/${sound}.wav`, function (err) {
    if (err) throw err;
  });
}
