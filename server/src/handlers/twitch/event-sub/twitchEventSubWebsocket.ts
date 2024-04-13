import websocket from 'websocket';
import { TWITCH_WEBSOCKET_EVENTSUB_URL } from '../../../constants';
import { logger } from '../../../logger';
import type { TwitchWebsocketMessage } from '../../../types';
import type { EventSubResponse, EventsubEvent } from '../../../typings/twitchEvents';
import { hasOwnProperty } from '../../../utils/hasOwnProperty';
import { subscribeToChatMessages } from './subscribers/subscribeToChatMessages';
import { subscribeToFollows } from './subscribers/subscribeToFollows';
import { subscribeToRaids } from './subscribers/subscribeToRaids';
import { subscribeToRedeems } from './subscribers/subscribeToRedeems';
import { subscribeToStreamOfflineNotifications } from './subscribers/subscribeToStreamOfflineNotifications';
import { subscribeToStreamOnlineNotifications } from './subscribers/subscribeToStreamOnlineNotifications';
import { twitchEventSubHandler } from './twitchEventSubHandler';

let isConnected = false;

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
      isConnected = false;
      logger.info('Twitch EventSub WebSocket: Connection Closed');
    });

    // eslint-disable-next-line @typescript-eslint/no-misused-promises
    connection.on('message', async function (message) {
      isConnected = true;
      if (hasOwnProperty(message, 'utf8Data')) {
        const data = JSON.parse(message.utf8Data as string) as TwitchWebsocketMessage;

        switch (data.metadata.message_type) {
          case 'session_welcome':
            {
              const sessionId = data.payload.session?.id;
              if (sessionId) {
                try {
                  await Promise.all([
                    subscribeToRedeems(sessionId),
                    subscribeToFollows(sessionId),
                    subscribeToRaids(sessionId),
                    subscribeToStreamOnlineNotifications(sessionId),
                    subscribeToStreamOfflineNotifications(sessionId),
                    subscribeToChatMessages(sessionId),
                  ]);
                } catch (error) {
                  logger.error(error);
                }
              }
            }

            break;

          case 'notification':
            if (isSubscriptionEvent(data.payload)) {
              // Transform the data first so that we can have a discriminated union type
              const transformedData = {
                ...data.payload.event,
                eventType: data.payload.subscription.type,
              } as EventsubEvent;

              twitchEventSubHandler(transformedData).catch((e) => logger.error(e));
            }
            break;
          default:
            // console.info({ messageType: data.metadata.message_type, payload: data.payload });
            break;
        }
      }
    });
  });
  client.connect(TWITCH_WEBSOCKET_EVENTSUB_URL);
  setInterval(() => {
    if (!isConnected) {
      logger.info('Twitch EventSub: Reconnecting...');
      client.connect(TWITCH_WEBSOCKET_EVENTSUB_URL);
    }
  }, 10000);
}

function isSubscriptionEvent(payload: unknown): payload is EventSubResponse {
  return (
    hasOwnProperty(payload, 'event') &&
    typeof payload.event === 'object' &&
    hasOwnProperty(payload, 'subscription') &&
    hasOwnProperty(payload.subscription, 'type') &&
    typeof payload.subscription.type === 'string'
  );
}
