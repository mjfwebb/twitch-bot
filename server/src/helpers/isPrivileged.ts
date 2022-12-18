import Config from '../config';
import type { ParsedMessage } from '../types';

export function isPrivileged(message: ParsedMessage, streamerOnly = false): boolean {
  const isStreamer = message.source?.nick === Config.twitch.account;
  if (streamerOnly) {
    return isStreamer;
  }
  const isMod = message.tags?.mod === '1' || false;
  return isStreamer || isMod;
}
