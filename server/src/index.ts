import pc from 'picocolors';
import { loadBotCommands } from './botCommands';
import Config from './config';
import { fetchCustomRewards } from './handlers/twitch/helix/customRewards';
import { fetchChannelInformation } from './handlers/twitch/helix/fetchChannelInformation';
import { fetchStreamStatus } from './handlers/twitch/helix/fetchStreamStatus';
import { fetchKnownTwitchViewerBots } from './handlers/twitchinsights/twitchViewerBots';
import { runIntervalCommands } from './intervalCommands';
import { runSocketServer } from './runSocketServer';
import { setupMongoose } from './setupMongoose';
import { getSpotifyAccessToken } from './spotify';
import { setDisplayName, setStreamStatus } from './streamState';
import { assertTokenFileExists } from './tokenManager';
import { getTwitchAccessToken } from './twitch';
import { runTwitchEventSubWebsocket } from './twitch-event-sub/twitchEventSubWebsocket';
import { runTwitchIRCWebsocket } from './twitch-irc/twitchIRCWebsocket';

async function main() {
  try {
    assertTokenFileExists();

    await setupMongoose();

    if (Config.features.commands_handler) {
      console.log(`${pc.green('[Commands handler enabled] ')}${pc.blue('Startup:')} Loading bot commands`);
      await loadBotCommands();
    }

    console.log(`${pc.blue('Startup:')} Getting Twitch access token`);
    await getTwitchAccessToken(Config.twitch);

    if (Config.spotify.enabled) {
      console.log(`${pc.green('[Spotify enabled] ')}${pc.blue('Startup:')} Getting Spotify access token`);
      await getSpotifyAccessToken();
    }

    console.log(`${pc.blue('Startup:')} Getting Twitch custom rewards`);
    await fetchCustomRewards();

    console.log(`${pc.blue('Startup:')} Getting Twitch viewer bots`);
    await fetchKnownTwitchViewerBots();

    console.log(`${pc.blue('Startup:')} Getting Twitch stream status`);
    setStreamStatus(await fetchStreamStatus());

    console.log(`${pc.blue('Startup:')} Getting Twitch channel information and setting display name`);
    setDisplayName((await fetchChannelInformation())?.broadcaster_name || Config.twitch.account);

    console.log(`${pc.blue('Startup:')} Running Twitch IRC WebSocket client`);
    runTwitchIRCWebsocket();

    if (Config.features.events_handler) {
      console.log(`${pc.green('[Events handler enabled] ')}${pc.blue('Startup:')} Running Twitch Websocket client`);
      runTwitchEventSubWebsocket();
    }

    if (Config.features.interval_commands) {
      console.log(`${pc.green('[Interval commands enabled] ')}${pc.blue('Startup:')} Running interval commands`);
      runIntervalCommands();
    }

    console.log(`${pc.blue('Startup:')} Running localhost socket server`);
    runSocketServer();
  } catch (error) {
    console.error(error);
  }
}

void main();
