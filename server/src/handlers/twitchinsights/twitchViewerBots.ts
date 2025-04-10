// https://api.twitchinsights.net/v1/bots/all

import fetch from 'node-fetch';
import { TWITCH_INSIGHTS_URL } from '../../constants';
import { logger } from '../../logger';
import { hasOwnProperty } from '../../utils/hasOwnProperty';

type ValidResult = { bots: TwitchViewerBot[]; _total: number };
type TwitchViewerBot = [botName: string, numberOfChannelsBotIsViewing: number, botId: number];

function isValidResult(result: unknown): result is ValidResult {
  return hasOwnProperty(result, 'bots') && Array.isArray(result.bots);
}

let twitchViewerBotNames: string[];

export const getTwitchViewerBotNames = () => twitchViewerBotNames;

export const fetchKnownTwitchViewerBots = async (): Promise<void> => {
  try {
    const url = `${TWITCH_INSIGHTS_URL}bots/all`;
    const response = await fetch(url);
    const result: unknown = await response.json();

    if (isValidResult(result)) {
      const botNames = result.bots.filter((botData) => botData[0] && typeof botData[0] === 'string').map((botData) => botData[0]);
      twitchViewerBotNames = botNames;
    }
  } catch (error) {
    logger.error(error);
  }
};
