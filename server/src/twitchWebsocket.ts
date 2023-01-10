import websocket from 'websocket';
import { TWITCH_WEBSOCKET_EVENTSUB_URL } from './constants';
import { subscribeToRedeems } from './subscribers/subscribeToRedeems';
import { subscribeToFollows } from './subscribers/subscribeToFollows';
import { subscribeToRaids } from './subscribers/subscribeToRaids';
import { websocketEventHandler } from './handlers/websocketEventHandler';
import type { TwitchWebsocketMessage } from './types';
import { hasOwnProperty } from './utils/hasOwnProperty';

export function runTwitchWebsocket() {
  const client = new websocket.client();

  client.on('connectFailed', function (error: unknown) {
    console.log(`Connect Error: ${String(error)}`);
  });

  client.on('connect', function (connection) {
    console.log('Twitch Websocket: Client Connected');

    connection.on('error', function (error) {
      console.log('Connection Error: ' + error.toString());
    });

    connection.on('close', function () {
      console.log('Twitch Websocket: Connection Closed');
    });

    connection.on('message', function (message) {
      if (hasOwnProperty(message, 'utf8Data')) {
        const data = JSON.parse(message.utf8Data as string) as TwitchWebsocketMessage;

        switch (data.metadata.message_type) {
          case 'session_welcome':
            {
              const sessionId = data.payload.session?.id;
              if (sessionId) {
                subscribeToRedeems(sessionId).catch((e) => console.error(e));
                subscribeToFollows(sessionId).catch((e) => console.error(e));
                subscribeToRaids(sessionId).catch((e) => console.error(e));
              }
            }

            break;

          case 'notification':
            websocketEventHandler(data);

            break;

          default:
            console.info({ messageType: data.metadata.message_type, payload: data.payload });
            break;
        }
      }
    });
  });
  client.connect(TWITCH_WEBSOCKET_EVENTSUB_URL);
}
