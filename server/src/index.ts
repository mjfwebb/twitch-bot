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
import { getTwitchAccessToken } from './twitch';
import { runTwitchWebsocket } from './twitchWebsocket';

async function main() {
  try {
    await setupMongoose();
    await loadBotCommands();

    await getTwitchAccessToken(Config.twitch);
    if (Config.spotify.enabled) {
      await getSpotifyAccessToken();
    }
    await fetchCustomRewards();
    await fetchKnownTwitchViewerBots();
    setStreamStatus(await fetchStreamStatus());
    setDisplayName((await fetchChannelInformation())?.broadcaster_name || Config.twitch.account);

    runBot();
    runTwitchWebsocket();
    runIntervalCommands();

    runSocketServer();
  } catch (error) {
    console.error(error);
  }
}

void main();
