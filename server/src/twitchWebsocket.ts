import websocket from 'websocket';
import { getConnection } from './bot';
import { REWARDS, TWITCH_WEBSOCKET_EVENTSUB_URL } from './constants';
import { botCommands } from './handlers/botCommands';
import { subscribeToRedeems } from './handlers/customRewards';
import { subscribeToFollows } from './handlers/followHandler';
import { sendChatMessage } from './helpers/sendChatMessage';
import { playSound } from './playSound';
import type { ChannelPointRedeemNotificatonEvent, FollowNotificationEvent, TwitchWebsocketMessage } from './types';
import { hasOwnProperty } from './utils/hasOwnProperty';

function handleNotification(data: TwitchWebsocketMessage) {
  if (hasOwnProperty(data.payload, 'event') && hasOwnProperty(data.payload.event, 'followed_at')) {
    const event = data.payload.event as unknown as FollowNotificationEvent;
    const connection = getConnection();
    if (connection) {
      sendChatMessage(connection, `Thank you for following ${event.user_name}, I love you`);
    }
  }

  // ChannelPointRedeemNotificatonEvent
  if (hasOwnProperty(data.payload, 'event') && hasOwnProperty(data.payload.event, 'reward')) {
    const event = data.payload.event as unknown as ChannelPointRedeemNotificatonEvent;
    const reward = Object.values(REWARDS).find((value) => value === event.reward.id);
    switch (reward) {
      case REWARDS.pushup:
        playSound('redeem');
        {
          const connection = getConnection();
          if (connection) {
            sendChatMessage(connection, "It's time to get down");
          }
        }
        break;
      case REWARDS.pushupAddOne:
        {
          const addPushupCommand = botCommands.find((command) => command.command === 'addpushup');
          const connection = getConnection();
          if (addPushupCommand && connection) {
            playSound('redeem');
            addPushupCommand.callback(connection, {
              tags: null,
              source: null,
              command: null,
              parameters: null,
            });
          }
        }
        break;
      case REWARDS.test:
        {
          playSound('redeem');
        }
        break;
      default:
        console.log('Unsupported reward');
        break;
    }
  }
}

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
              }
            }

            break;

          case 'notification':
            handleNotification(data);

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
