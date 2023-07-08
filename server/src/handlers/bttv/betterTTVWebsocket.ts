import websocket from 'websocket';
import { addBetterTTVEmote, removeBetterTTVEmote, sendEmotes } from '../../chat/loadEmotes';
import Config from '../../config';
import { BETTER_TTV_WEBSOCKET_URL } from '../../constants';
import { hasOwnProperty } from '../../utils/hasOwnProperty';
import type { BttvEmote } from './types';

export function runBetterTTVWebsocket() {
  const client = new websocket.client();

  function joinChannel(connection: websocket.connection) {
    connection.send(JSON.stringify({ name: 'join_channel', data: { name: `${Config.betterTTV.provider}:${Config.betterTTV.provider_id}` } }));
  }

  client.on('connectFailed', function (error: unknown) {
    console.log(`BetterTTV WebSocket: Connect Error: ${String(error)}`);
  });

  client.on('connect', function (connection) {
    console.log('BetterTTV WebSocket: Client Connected');

    joinChannel(connection);

    connection.on('error', function (error) {
      console.log('BetterTTV WebSocket: Connection Error: ' + error.toString());
    });

    connection.on('close', function () {
      console.log('BetterTTV WebSocket: Connection Closed');
    });

    connection.on('message', function (message) {
      if (hasOwnProperty(message, 'utf8Data')) {
        const data = JSON.parse(message.utf8Data as string) as { name: string; data: unknown };

        switch (data.name) {
          case 'emote_delete':
            if (hasOwnProperty(data.data, 'emoteId') && typeof data.data.emoteId === 'string') {
              console.log(`BetterTTV WebSocket: Removing emote ${data.data.emoteId}`);
              removeBetterTTVEmote(data.data.emoteId);
              sendEmotes();
            }
            break;
          case 'emote_create':
            if (hasOwnProperty(data.data, 'emote') && hasOwnProperty(data.data.emote, 'code')) {
              const emote = data.data.emote as BttvEmote;
              console.log(`BetterTTV WebSocket: Adding emote ${emote.code}`);
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
