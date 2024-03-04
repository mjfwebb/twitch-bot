import { existsSync, readFileSync, writeFileSync } from 'fs';
import pc from 'picocolors';
import { logger } from '../logger';

const oldChatExclusionListFilename = 'chat-exclusion-list.txt';
const chatUserExclusionListFilename = 'chat-user-exclusion-list.txt';
const chatCommandInclusionListFilename = 'chat-command-inclusion-list.txt';

const chatUserExclusionList = new Set<string>();
const chatCommandInclusionList = new Set<string>();

export const getChatUserExclusionList = () => chatUserExclusionList;

export const getChatCommandInclusionList = () => chatCommandInclusionList;

function loadFileToList(filename: string, list: Set<string>, listName: string) {
  const contents = readFileSync(filename, 'utf8');

  // Normalise input so there aren't \r, just \n, and remove any empty lines or empty spaces
  const normalised = contents
    .replace(/\r/g, '')
    .replace(/\n{2,}/g, '\n')
    .trim();

  // Split the string into an array of strings, separated by \n
  const items = normalised.split('\n');

  // Set the list to a new Set of the items array
  // This will remove any duplicates and empty strings
  items.filter((item) => item.length > 0).forEach((item) => list.add(item.toLowerCase()));

  if (list.size > 0) {
    logger.debug(`Loaded ${list.size} ${listName} into list`);
  }
}

export function loadChatUserExclusionList() {
  // Migrate the old chat-exclusion-list.txt to chat-user-exclusion-list.txt, if it still exists
  if (existsSync(oldChatExclusionListFilename)) {
    logger.info(`${pc.blue('Startup:')} Migrating old chat exclusion list to new format`);
    const oldChatExclusionListContents = readFileSync(oldChatExclusionListFilename, 'utf8');
    writeFileSync(chatUserExclusionListFilename, oldChatExclusionListContents);
    writeFileSync(oldChatExclusionListFilename, '');
  }

  // If the file chat-exclusion-list.txt exists, load it into memory
  if (existsSync(chatUserExclusionListFilename)) {
    loadFileToList(chatUserExclusionListFilename, chatUserExclusionList, 'chat user exclusions');
  } else {
    logger.info(`${pc.blue('Startup:')} No chat user exclusion list found, creating one`);
    writeFileSync(chatUserExclusionListFilename, '');
  }
}

export function loadChatCommandInclusionList() {
  // If the file chat-inclusion-list.txt exists, load it into memory
  if (existsSync(chatCommandInclusionListFilename)) {
    loadFileToList(chatCommandInclusionListFilename, chatCommandInclusionList, 'chat command inclusions');
  } else {
    logger.info(`${pc.blue('Startup:')} No chat command inclusion list found, creating one`);
    writeFileSync(chatCommandInclusionListFilename, '');
  }
}
