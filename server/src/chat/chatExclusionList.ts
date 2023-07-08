import { existsSync, readFileSync, writeFileSync } from 'fs';
import pc from 'picocolors';
import { logger } from '../logger';

const chatExclusionList = new Set<string>();

export const getChatExlusionList = () => chatExclusionList;

export function loadChatExclusionList() {
  // If the file chat-exclusion-list.txt exists, load it into memory
  if (existsSync('chat-exclusion-list.txt')) {
    const chatExclusionListContents = readFileSync('chat-exclusion-list.txt', 'utf8');

    // Normalise input so there aren't \r, just \n, and remove any empty lines or empty spaces
    const chatExclusionListNormalised = chatExclusionListContents
      .replace(/\r/g, '')
      .replace(/\n{2,}/g, '\n')
      .trim();

    // Split the string into an array of strings, separated by \n
    const chatExcludedUsers = chatExclusionListNormalised.split('\n');

    // Set the chatExclusionList to a new Set of the chatExcludedUsers array
    // This will remove any duplicates and empty strings
    chatExcludedUsers.filter((user) => user.length > 0).forEach((user) => chatExclusionList.add(user.toLowerCase()));

    if (chatExclusionList.size > 0) {
      logger.info(`${pc.blue('Startup:')} Loaded ${chatExclusionList.size} users into chat exclusion list`);
    }
  } else {
    logger.info(`${pc.blue('Startup:')} No chat exclusion list found, creating one`);
    writeFileSync('chat-exclusion-list.txt', '');
  }
}
