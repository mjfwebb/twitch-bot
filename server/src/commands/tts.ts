import { writeFileSync } from "fs";
import { VOICES } from "../constants";
import { ttsStreamElementsHandler } from "../handlers/streamelements/ttsStreamElementsHandler";
import { ttsTikTokHandler } from "../handlers/tiktok/ttsTikTokHandler";
import { playSound } from "../playSound";
import type { BotCommand } from "../types";

type Voice = {
  name: string;
  id: string;
  api: string;
};

async function getVoiceBuffer(
  voice: Voice,
  text: string
): Promise<ArrayBuffer | null> {
  switch (voice.api) {
    case "streamelements": {
      const buffer = await ttsStreamElementsHandler(voice.id, text);
      return buffer;
    }
    case "tiktok": {
      const buffer = await ttsTikTokHandler(voice.id, text);
      return buffer;
    }
    default:
      return null;
  }
}

export const runTTS = async (
  message: string,
  voice: Voice = {
    name: "Brian",
    id: "Brian",
    api: "streamelements",
  }
) => {
  const words = message.split(" ");
  // Set the default voice to Brian from StreamElements
  let nextVoice: Voice = voice;
  let currentMessage = "";
  let buffer: Uint8Array = new Uint8Array([]);

  for (const word of words) {
    let skip = false;

    // If the word ends with a colon, it's a voice change
    if (word.endsWith(":")) {
      const voice = word.slice(0, -1);
      const voiceLowerCase = voice.toLowerCase();

      // Find the voice
      for (const voice of VOICES) {
        if (voice.name.toLowerCase() === voiceLowerCase) {
          // If there's a current message, get the buffer and concat it
          if (currentMessage.length > 0) {
            const result = await getVoiceBuffer(nextVoice, currentMessage);
            if (result && result.byteLength > 0) {
              // buffer = Buffer.concat([buffer, result]);
              buffer = new Uint8Array([...buffer, ...new Uint8Array(result)]);
            }
          }
          skip = true;
          nextVoice = voice;
          currentMessage = "";
          break;
        }
      }
    }
    if (!skip) {
      currentMessage += `${word} `;
    }
  }

  // If there's a current message, get the buffer and concat it,
  // this is for the last voice and the remaining message
  if (currentMessage.length > 0) {
    const result = await getVoiceBuffer(nextVoice, currentMessage);
    if (result) {
      buffer = new Uint8Array([...buffer, ...new Uint8Array(result)]);
    }
  }

  // For some reason (probably an API error), the buffer was empty,
  // so we don't need to write it to a file
  if (buffer.byteLength === 0) {
    return;
  }

  // Generate a random id for the file name
  const id = Math.random().toString(36).substring(2, 15);
  // Write the buffer to a file
  writeFileSync(`../tts/${id}.mp3`, buffer);
  // Play the file
  await playSound(`../tts/${id}.mp3`);
};

export const tts: BotCommand = {
  command: "tts",
  id: "tts",
  description: "Make your message audible! Used like !tts hello stream!",
  callback: async (_, parsedCommand) => {
    const params = parsedCommand.parsedMessage.command?.botCommandParams;
    if (params) {
      await runTTS(params);
    }
  },
};
