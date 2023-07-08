import websocket from 'websocket';
import { TWITCH_WEBSOCKET_EVENTSUB_URL } from '../../../constants';
import { logger } from '../../../logger';
import type { TwitchWebsocketMessage } from '../../../types';
import { hasOwnProperty } from '../../../utils/hasOwnProperty';
import { subscribeToFollows } from './subscribers/subscribeToFollows';
import { subscribeToRaids } from './subscribers/subscribeToRaids';
import { subscribeToRedeems } from './subscribers/subscribeToRedeems';
import { subscribeToStreamOfflineNotifications } from './subscribers/subscribeToStreamOfflineNotifications';
import { subscribeToStreamOnlineNotifications } from './subscribers/subscribeToStreamOnlineNotifications';
import { subscribeToSubscriptionGifts } from './subscribers/subscribeToSubscriptionGifts';
import { subscribeToSubscriptions } from './subscribers/subscribeToSubscriptions';
import { twitchEventSubHandler } from './twitchEventSubHandler';

export function runTwitchEventSubWebsocket() {
  const client = new websocket.client();

  client.on('connectFailed', function (error: unknown) {
    logger.error(`Twitch EventSub WebSocket: Connect Error: ${String(error)}`);
  });

  client.on('connect', function (connection) {
    logger.info('Twitch EventSub WebSocket: Client Connected');

    connection.on('error', function (error) {
      logger.error('Twitch EventSub WebSocket: Connection Error: ' + error.toString());
    });

    connection.on('close', function () {
      logger.info('Twitch EventSub WebSocket: Connection Closed');
    });

    connection.on('message', function (message) {
      if (hasOwnProperty(message, 'utf8Data')) {
        const data = JSON.parse(message.utf8Data as string) as TwitchWebsocketMessage;

        switch (data.metadata.message_type) {
          case 'session_welcome':
            {
              const sessionId = data.payload.session?.id;
              if (sessionId) {
                subscribeToRedeems(sessionId).catch((e) => logger.error(e));
                subscribeToFollows(sessionId).catch((e) => logger.error(e));
                subscribeToRaids(sessionId).catch((e) => logger.error(e));
                subscribeToSubscriptions(sessionId).catch((e) => logger.error(e));
                subscribeToSubscriptionGifts(sessionId).catch((e) => logger.error(e));
                subscribeToStreamOnlineNotifications(sessionId).catch((e) => logger.error(e));
                subscribeToStreamOfflineNotifications(sessionId).catch((e) => logger.error(e));
              }
            }

            break;

          case 'notification':
            twitchEventSubHandler(data).catch((e) => logger.error(e));

            break;

          default:
            // console.info({ messageType: data.metadata.message_type, payload: data.payload });
            break;
        }
      }
    });
  });
  client.connect(TWITCH_WEBSOCKET_EVENTSUB_URL);
}
