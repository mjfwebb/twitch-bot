import { getChatExlusionList } from '../../../chat/chatExclusionList';
import { addChatMessage } from '../../../chat/chatMessages';
import { getChatUser } from '../../../commands/helpers/findOrCreateUser';
import { runTTS } from '../../../commands/tts';
import Config from '../../../config';
import { SECOND_MS, VOICES } from '../../../constants';
import type { ParsedMessage } from '../../../types';

const REPETITION_TIMEFRAME = Config.repeatMessageHandler.timeout * SECOND_MS;

const repetitionMap = new Map<
  string,
  {
    expiry: number;
    count: number;
  }
>();

async function repeatMessageHandler(chatMessage: string) {
  const lowerCaseMessage = chatMessage.toLowerCase();

  if (lowerCaseMessage.length > Config.repeatMessageHandler.max_length) {
    return;
  }

  const repetition = repetitionMap.get(lowerCaseMessage);
  const now = Date.now();

  if (repetition && now < repetition.expiry) {
    repetition.count += 1;
    repetition.expiry = now + REPETITION_TIMEFRAME;

    if (repetition.count === Config.repeatMessageHandler.repetition_requirement) {
      repetitionMap.delete(lowerCaseMessage);

      const foundVoice = VOICES.find((voice) => voice.name.toLowerCase() === Config.repeatMessageHandler.voice.toLowerCase());
      await runTTS(chatMessage, foundVoice);
    }
  } else {
    repetitionMap.set(lowerCaseMessage, {
      expiry: now + REPETITION_TIMEFRAME,
      count: 1,
    });
  }
}

export async function messageHandler(parsedMessage: ParsedMessage): Promise<void> {
  const userId = parsedMessage.tags?.['user-id'];
  const nick = parsedMessage.source?.nick;
  const displayName = parsedMessage.tags?.['display-name'];
  const chatMessageId = parsedMessage.tags?.['id'];

  const chatExcludedUsers = getChatExlusionList();

  if (userId && nick && displayName && chatMessageId) {
    const chatUser = await getChatUser(userId, nick, displayName);

    // If the user is in the chat exclusion list, don't add the message
    if (chatExcludedUsers.has(chatUser.displayName.toLowerCase())) {
      return;
    }

    if (chatUser) {
      if (Config.repeatMessageHandler.enabled && parsedMessage.parameters) {
        await repeatMessageHandler(parsedMessage.parameters);
      }
      addChatMessage({ id: chatMessageId, user: chatUser, parsedMessage });
    }
  }
}
