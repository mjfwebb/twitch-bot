// https://api.twitchinsights.net/v1/bots/all

import fetch from "node-fetch";
import { TWITCH_INSIGHTS_URL } from "../../constants";
import { logger } from "../../logger";
import { assertArray } from "../../utils/assertArray";
import { hasOwnProperty } from "../../utils/hasOwnProperty";

/* The response from the API is in the format of a JSON response:
{ "bots":[[ botName, numberOfChannelsBotIsViewing, botId ]], "_total": totalNumberOfViewerBots } }
*/
type TwitchViewerBot = [string, number, number];

let twitchViewerBotNames: string[];

export const getTwitchViewerBotNames = () => twitchViewerBotNames;

export const fetchKnownTwitchViewerBots = async (): Promise<void> => {
  try {
    const url = `${TWITCH_INSIGHTS_URL}bots/all`;

    const response = await fetch(url, {
      method: "GET",
    });

    const result = await response.text();
    const parsedResult: unknown = JSON.parse(result);

    if (hasOwnProperty(parsedResult, "bots")) {
      const botsData: unknown = parsedResult.bots;
      assertArray(botsData);
      const botNames = (botsData as TwitchViewerBot[])
        .map((botData: TwitchViewerBot) => {
          if (botData[0] && typeof botData[0] === "string") {
            return botData[0];
          } else {
            return undefined;
          }
        })
        .filter((b): b is string => b !== undefined);
      twitchViewerBotNames = botNames;
    }
  } catch (error) {
    logger.error(error);
  }
};
