import { loadBotCommands } from './botCommands';
import Config from './config';
import { fetchCustomRewards } from './handlers/twitch/helix/customRewards';
import { fetchChannelInformation } from './handlers/twitch/helix/fetchChannelInformation';
import { fetchStreamStatus } from './handlers/twitch/helix/fetchStreamStatus';
import { fetchKnownTwitchViewerBots } from './handlers/twitchinsights/twitchViewerBots';
import { runIntervalCommands } from './intervalCommands';
import { runIrcWebsocket } from './ircWebsocket';
import { runSocketServer } from './runSocketServer';
import { setupMongoose } from './setupMongoose';
import { getSpotifyAccessToken } from './spotify';
import { setDisplayName, setStreamStatus } from './streamState';
import { assertTokenFileExists } from './tokenManager';
import { getTwitchAccessToken } from './twitch';
import { runTwitchWebsocket } from './twitchWebsocket';

async function main() {
  try {
    assertTokenFileExists();

    await setupMongoose();

    if (Config.features.commands_handler) {
      console.log('Startup: loading bot commands');
      await loadBotCommands();
    }

    console.log('Startup: getting Twitch access token');
    await getTwitchAccessToken(Config.twitch);

    if (Config.spotify.enabled) {
      console.log('Startup: getting Spotify access token');
      await getSpotifyAccessToken();
    }

    console.log('Startup: getting Twitch custom rewards');
    await fetchCustomRewards();

    console.log('Startup: getting Twitch viewer bots');
    await fetchKnownTwitchViewerBots();

    console.log('Startup: getting Twitch stream status');
    setStreamStatus(await fetchStreamStatus());

    console.log('Startup: getting Twitch channel information and setting display name');
    setDisplayName((await fetchChannelInformation())?.broadcaster_name || Config.twitch.account);

    console.log('Startup: running Twitch IRC WebSocket client');
    runIrcWebsocket();

    console.log('Startup: running Twitch Websocket client');
    runTwitchWebsocket();

    if (Config.features.interval_commands) {
      console.log('Startup: running interval commands');
      runIntervalCommands();
    }

    console.log('Startup: running localhost socket server');
    runSocketServer();
  } catch (error) {
    console.error(error);
  }
}

void main();
