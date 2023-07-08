import pc from 'picocolors';
import { getSpotifyAccessToken } from './auth/spotify';
import { assertTokenFileExists } from './auth/tokenManager';
import { getTwitchAccessToken } from './auth/twitch';
import { loadBotCommands } from './botCommands';
import { loadChatExclusionList } from './chat/chatExclusionList';
import Config, { assertConfigFileExists } from './config';
import { runBetterTTVWebsocket } from './handlers/bttv/betterTTVWebsocket';
import { fetchSevenTVUser } from './handlers/sevenTV/fetchSevenTVUser';
import { setSevenTVUser } from './handlers/sevenTV/sevenTVUser';
import { runSevenTVWebsocket } from './handlers/sevenTV/sevenTVWebsocket';
import { runTwitchEventSubWebsocket } from './handlers/twitch/event-sub/twitchEventSubWebsocket';
import { fetchCustomRewards } from './handlers/twitch/helix/customRewards';
import { fetchChannelInformation } from './handlers/twitch/helix/fetchChannelInformation';
import { fetchStreamStatus } from './handlers/twitch/helix/fetchStreamStatus';
import { runTwitchIRCWebsocket } from './handlers/twitch/irc/twitchIRCWebsocket';
import { fetchKnownTwitchViewerBots } from './handlers/twitchinsights/twitchViewerBots';
import { intervalCommands, loadIntervalCommands, loadSpotifyIntervalCommands, runIntervalCommands } from './intervalCommands';
import { logger } from './logger';
import { runSocketServer } from './runSocketServer';
import { setDisplayName, setStreamStatus } from './streamState';
import { isError } from './utils/isError';

async function main() {
  try {
    assertConfigFileExists();
    assertTokenFileExists();

    loadBotCommands();

    if (Config.features.commands_handler) {
      logger.info(`${pc.green('[Commands handler enabled]')} Loading bot commands`);
    }

    logger.info(`Getting Twitch access token`);
    await getTwitchAccessToken(Config.twitch);

    if (Config.spotify.enabled) {
      logger.info(`${pc.green('[Spotify enabled]')} Getting Spotify access token`);
      await getSpotifyAccessToken();

      logger.info(`${pc.green('[Spotify enabled]')} Loading Spotify bot commands`);

      logger.info(`${pc.green('[Spotify enabled]')} Loading Spotify interval commands`);
      loadSpotifyIntervalCommands();
    }

    if (Config.github.enabled) {
      logger.info(`${pc.green('[GitHub enabled]')} Loading GitHub bot commands`);
    }

    loadChatExclusionList();

    logger.info(`Getting Twitch custom rewards`);
    await fetchCustomRewards();

    logger.info(`Getting Twitch viewer bots`);
    await fetchKnownTwitchViewerBots();

    logger.info(`Getting Twitch stream status`);
    setStreamStatus(await fetchStreamStatus());

    logger.info(`Getting Twitch channel information and setting display name`);
    setDisplayName((await fetchChannelInformation())?.broadcaster_name || Config.twitch.account);

    logger.info(`Running Twitch IRC WebSocket client`);
    runTwitchIRCWebsocket();

    if (Config.features.events_handler) {
      logger.info(`${pc.green('[Events handler enabled]')} Running Twitch WebSocket client`);
      runTwitchEventSubWebsocket();
    }

    if (Config.features.interval_commands) {
      logger.info(`${pc.green('[Interval commands enabled]')} Loading interval commands`);
      loadIntervalCommands();
    }

    if (intervalCommands.length > 0) {
      logger.info(
        `Running interval commands. ${pc.yellow(
          'Note: If interval commands are disabled, but Spotify is enabled, Spotify interval commands will still run.',
        )}`,
      );
      runIntervalCommands();
    }

    logger.info(`Running localhost socket server`);
    runSocketServer();

    if (Config.betterTTV.enabled) {
      logger.info(`${pc.green('[BetterTTV enabled]')} Running BetterTTV WebSocket client`);
      runBetterTTVWebsocket();
    }

    if (Config.sevenTV.enabled) {
      const sevenTVUser = await fetchSevenTVUser();
      if (sevenTVUser) {
        setSevenTVUser(sevenTVUser);
        runSevenTVWebsocket(sevenTVUser);
      }
    }
  } catch (error) {
    if (isError(error)) {
      logger.error(error.message);
    }
  }
}

void main();
