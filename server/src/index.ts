import { runBot } from './bot';
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
import { runTwitchWebsocket } from './twitchWebsocket';

async function main() {
  try {
    console.log('Startup: checking token file exists and creating if not');
    assertTokenFileExists();

    await setupMongoose();

    console.log('Startup: loading bot commands');
    await loadBotCommands();

    console.log('Startup: getting twitch access token');
    await getTwitchAccessToken(Config.twitch);

    if (Config.spotify.enabled) {
      console.log('Startup: getting spotify access token');
      await getSpotifyAccessToken();
    }

    console.log('Startup: getting twitch custom rewards');
    await fetchCustomRewards();

    console.log('Startup: getting twitch viewer bots');
    await fetchKnownTwitchViewerBots();

    console.log('Startup: getting twitch stream status');
    setStreamStatus(await fetchStreamStatus());

    console.log('Startup: getting twitch channel information and setting display name');
    setDisplayName((await fetchChannelInformation())?.broadcaster_name || Config.twitch.account);

    console.log('Startup: running IRC client');
    runBot();

    console.log('Startup: running websocket client');
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
