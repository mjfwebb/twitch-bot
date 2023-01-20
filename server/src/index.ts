import Config from './config';
import { getTwitchAccessToken } from './twitch';
import { fetchCustomRewards } from './handlers/twitch/helix/customRewards';
import { runTwitchWebsocket } from './twitchWebsocket';
import { runBot } from './bot';
import { runIntervalCommands } from './intervalCommands';
import { fetchStreamStatus } from './handlers/twitch/helix/fetchStreamStatus';
import { setStreamState } from './streamState';
import { setupMongoose } from './setupMongoose';
import { runSocketServer } from './runSocketServer';
import { getSpotifyAccessToken } from './spotify';

async function main() {
  try {
    await setupMongoose();

    await getTwitchAccessToken(Config.twitch);
    await getSpotifyAccessToken();
    await fetchCustomRewards();
    setStreamState(await fetchStreamStatus());

    runBot();
    runTwitchWebsocket();
    runIntervalCommands();

    runSocketServer();
  } catch (error) {
    console.error(error);
  }
}

void main();
