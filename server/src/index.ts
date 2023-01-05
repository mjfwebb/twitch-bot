import assert from 'assert';
import Config from './config';
import { getTwitchAccessToken } from './twitch';
import { fetchCustomRewards } from './handlers/customRewards';
import { runTwitchWebsocket } from './twitchWebsocket';
import { runBot } from './bot';
import { getUserIdByName } from './helpers/getUserIdByName';
import { banUser } from './handlers/moderation';

async function main() {
  try {
    assert(Config.twitch?.client_id && Config.twitch?.client_secret, 'Missing Twitch credentials!');

    await getTwitchAccessToken(Config.twitch);
    await fetchCustomRewards();

    runBot();
    runTwitchWebsocket();
  } catch (error) {
    console.error(error);
  }
}

void main();
