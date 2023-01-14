import Config from './config';
import { getTwitchAccessToken } from './twitch';
import { fetchCustomRewards } from './handlers/customRewards';
import { runTwitchWebsocket } from './twitchWebsocket';
import { runBot } from './bot';
import { runIntervalCommands } from './intervalCommands';
import { fetchStreamStatus } from './handlers/fetchStreamStatus';
import { setStreamState } from './streamState';
import { setupMongoose } from './setupMongoose';

async function main() {
  try {
    await setupMongoose();

    await getTwitchAccessToken(Config.twitch);
    await fetchCustomRewards();
    setStreamState(await fetchStreamStatus());

    runBot();
    runTwitchWebsocket();
    runIntervalCommands();
  } catch (error) {
    console.error(error);
  }
}

void main();
