import websocket from 'websocket';
import { addBetterTTVEmote, removeBetterTTVEmote, sendEmotes } from '../../chat/loadEmotes';
import Config from '../../config';
import { BETTER_TTV_WEBSOCKET_URL } from '../../constants';
import { logger } from '../../logger';
import { hasOwnProperty } from '../../utils/hasOwnProperty';
import type { BttvEmote } from './types';

export function runBetterTTVWebsocket() {
  const client = new websocket.client();

  function joinChannel(connection: websocket.connection) {
    connection.send(JSON.stringify({ name: 'join_channel', data: { name: `twitch:${Config.twitch.broadcaster_id}` } }));
  }

  client.on('connectFailed', function (error: unknown) {
    logger.error(`BetterTTV WebSocket: Connect Error: ${String(error)}`);
  });

  client.on('connect', function (connection) {
    logger.info('BetterTTV WebSocket: Client Connected');

    joinChannel(connection);

    connection.on('error', function (error) {
      logger.error('BetterTTV WebSocket: Connection Error: ' + error.toString());
    });

    connection.on('close', function () {
      logger.info('BetterTTV WebSocket: Connection Closed');
    });

    connection.on('message', function (message) {
      if (hasOwnProperty(message, 'utf8Data')) {
        const data = JSON.parse(message.utf8Data as string) as { name: string; data: unknown };

        switch (data.name) {
          case 'emote_delete':
            if (hasOwnProperty(data.data, 'emoteId') && typeof data.data.emoteId === 'string') {
              logger.info(`BetterTTV WebSocket: Removing emote ${data.data.emoteId}`);
              removeBetterTTVEmote(data.data.emoteId);
              sendEmotes();
            }
            break;
          case 'emote_create':
            if (hasOwnProperty(data.data, 'emote') && hasOwnProperty(data.data.emote, 'code')) {
              const emote = data.data.emote as BttvEmote;
              logger.info(`BetterTTV WebSocket: Adding emote ${emote.code}`);
              addBetterTTVEmote(emote);
              sendEmotes();
            }
            break;
          default:
            break;
        }
      }
    });
  });
  client.connect(BETTER_TTV_WEBSOCKET_URL);
}
