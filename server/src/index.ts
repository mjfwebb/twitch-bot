import pc from 'picocolors';
import { getSpotifyAccessToken, spotifyAuthCodeRouter } from './auth/spotify';
import { assertTokenFileExists } from './auth/tokenManager';
import { getTwitchAccessToken, twitchAuthCodeRouter } from './auth/twitch';
import { loadBotCommands } from './botCommands';
import { loadChatCommandInclusionList, loadChatUserExclusionList } from './chat/chatFiltering';
import { loadBadges } from './chat/loadBadges';
import { loadCheers } from './chat/loadCheers';
import { loadEmotes } from './chat/loadEmotes';
import Config, { assertConfigFileExists } from './config';
import { runBetterTTVWebsocket } from './handlers/bttv/betterTTVWebsocket';
import { runOBSWebsocket } from './handlers/obs/obsWebsocket';
import { fetchSevenTVTwitchUser } from './handlers/sevenTV/fetchSevenTVTwitchUser';
import { setSevenTVUser } from './handlers/sevenTV/sevenTVUser';
import { runSevenTVWebsocket } from './handlers/sevenTV/sevenTVWebsocket';
import { runTwitchEventSubWebsocket } from './handlers/twitch/event-sub/twitchEventSubWebsocket';
import { fetchCustomRewards, getCustomRewards } from './handlers/twitch/helix/customRewards';
import { fetchChannelInformation } from './handlers/twitch/helix/fetchChannelInformation';
import { fetchStreamStatus } from './handlers/twitch/helix/fetchStreamStatus';
import { runTwitchIRCWebsocket } from './handlers/twitch/irc/twitchIRCWebsocket';
import { fetchKnownTwitchViewerBots } from './handlers/twitchinsights/twitchViewerBots';
import { intervalCommands, loadIntervalCommands, loadSpotifyIntervalCommands, runIntervalCommands } from './intervalCommands';
import { logger } from './logger';
import { removeOldTTSFiles } from './removeOldTTSFiles';
import { makeIO, runSocketServer } from './runSocketServer';
import { StreamState } from './streamState';
import { isError } from './utils/isError';

async function main() {
  try {
    assertConfigFileExists();
    assertTokenFileExists();

    await twitchAuthCodeRouter();
    await spotifyAuthCodeRouter();

    removeOldTTSFiles();
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

    // Load chat user exclusion list and chat command inclusion list
    loadChatUserExclusionList();
    // This list containts commands that will be shown in chat when they are used
    loadChatCommandInclusionList();

    logger.info(`Getting Twitch custom rewards`);
    await fetchCustomRewards();
    const customRewards = getCustomRewards();
    if (customRewards.length > 0) {
      logger.debug(`Loaded ${pc.green(`${customRewards.length}`)} custom rewards`);
      customRewards.forEach((reward) => logger.debug(`  - ${pc.green(`${reward.title}`)} with ID ${pc.green(`${reward.id}`)}`));
    }

    logger.info(`Getting Twitch viewer bots`);
    await fetchKnownTwitchViewerBots();

    logger.info(`Getting Twitch stream status`);
    StreamState.status = await fetchStreamStatus();

    logger.info(`Getting Twitch channel information`);
    StreamState.displayName = (await fetchChannelInformation())?.broadcaster_name || Config.twitch.account;

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

    logger.info('Setting up socket server');
    makeIO(Config.clientPort);

    logger.info(`Running localhost socket server`);
    runSocketServer(Config.serverPort);

    if (Config.betterTTV.enabled) {
      logger.info(`${pc.green('[BetterTTV enabled]')} Running BetterTTV WebSocket client`);
      runBetterTTVWebsocket();
    }

    if (Config.sevenTV.enabled) {
      const sevenTVUser = await fetchSevenTVTwitchUser();
      if (sevenTVUser) {
        setSevenTVUser(sevenTVUser);
        logger.info(`${pc.green('[7TV enabled]')} Running 7TV WebSocket client`);
        runSevenTVWebsocket(sevenTVUser);
      }
    }

    // Load emotes, badges and cheers
    await loadEmotes();
    await loadBadges();
    await loadCheers();

    if (Config.obs.enabled) {
      runOBSWebsocket(Config.obs);
    }
  } catch (error) {
    if (isError(error)) {
      logger.error(error.message);
    }
  }
}

void main();
