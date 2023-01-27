import Config from './config';
import { getTwitchAccessToken } from './twitch';
import { fetchCustomRewards } from './handlers/twitch/helix/customRewards';
import { runTwitchWebsocket } from './twitchWebsocket';
import { runBot } from './bot';
import { runIntervalCommands } from './intervalCommands';
import { fetchStreamStatus } from './handlers/twitch/helix/fetchStreamStatus';
import { setDisplayName, setStreamStatus } from './streamState';
import { setupMongoose } from './setupMongoose';
import { runSocketServer } from './runSocketServer';
import { getSpotifyAccessToken } from './spotify';
import { fetchChannelInformation } from './handlers/twitch/helix/fetchChannelInformation';
import { loadBotCommands } from './botCommands';

async function main() {
  try {
    await setupMongoose();
    await loadBotCommands();

    await getTwitchAccessToken(Config.twitch);
    await getSpotifyAccessToken();
    await fetchCustomRewards();
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
