import websocket from 'websocket';
import { addSevenTVEmote, removeSevenTVEmote } from '../../chat/loadEmotes';
import { SEVEN_TV_WEBSOCKET_URL } from '../../constants';
import { logger } from '../../logger';
import { hasOwnProperty } from '../../utils/hasOwnProperty';
import type { SevenTVEmote, SevenTVTwitchUser } from './types';

const closeCodes = {
  ServerError: 4000, // An error occured on the server's end
  UnknownOperation: 4001, // the client sent an unknown opcode
  InvalidPayload: 4002, // the client sent a payload that couldn't be decoded
  AuthFailure: 4003, // the client unsuccessfully tried to identify
  AlreadyIdentified: 4004, // the client wanted to identify again
  RateLimited: 4005, // the client sent too many payloads too fast
  Restart: 4006, // the server is restarting and the client should reconnect
  Maintenance: 4007, // the server is in maintenance mode and not accepting connections
  Timeout: 4008, // the client was idle for too long
  AlreadySubscribed: 4009, // the client tried to subscribe to an event twice
  NotSubscribed: 4010, // the client tried to unsubscribe from an event they weren't subscribed to
  InsufficientPrivilege: 4011, // the client did something they did not have permission for
} as const;

const SevenTVWebsocketOpCodes = {
  Dispatch: 0, // A standard event message, sent when a subscribed event is emitted
  Hello: 1, // Received upon connecting, presents info about the session
  Heartbeat: 2, // Ensures the connection is still alive
  Reconnect: 4, // Server wants the client to reconnect
  Acknowledgement: 5, // Server acknowledges an action by the client
  Error: 6, // An error occured, you should log this
  EndOfStream: 7, // The server will send no further data and imminently end the connection
  Identify: 33, // Authenticate with an account
  Resume: 34, // Try to resume a previous session
  Subscribe: 35, // Watch for changes on specific objects or sources. Don't smash it!
  Unsubscribe: 36, // Stop listening for changes
  Signal: 37,
} as const;

interface SevenTVWebsocketInboundMessage<T> {
  op: number;
  t: number;
  d: T;
}

interface SevenTVWebsocketOutboundMessage<T> {
  op: number;
  d: T;
}

type ChangeField = {
  key: string; // the key in context
  index?: number; //	if the field is an array, this is the index of the item within the array that was updated
  nested?: boolean; //	if true, this means the current value is nested deeper
  old_value: unknown; //	object or nil	the previous value
  value: unknown; // object, []ChangeField or nil
};

type DispatchMessage = SevenTVWebsocketInboundMessage<{
  type: string; // The type of event
  body: {
    id: string; // ObjectID	the object's ID
    kind: number; // int8	the object kind
    contextual?: boolean; // 	bool	if true, this event represents a change local only to the current session
    actor: string; // User	the user responsible for these changes
    added?: ChangeField[]; // 	[]ChangeField	a list of added fields
    updated?: ChangeField[]; // 	[]ChangeField	a list of updated fields
    removed?: ChangeField[]; // 	[]ChangeField	a list of removed fields
    pushed?: ChangeField[]; // 	[]ChangeField	a list of items pushed to an array
    pulled?: ChangeField[]; // 	[]ChangeField	a list of items pulled from an array
  };
}>;

type HelloMessage = SevenTVWebsocketInboundMessage<{
  heartbeat_interval: number;
  session_id: string;
  subscription_limit: number;
}>;

type HeartbeatMessage = SevenTVWebsocketInboundMessage<{
  count: number;
}>;

type EndOfStreamMessage = SevenTVWebsocketInboundMessage<{
  code: number; // The close code
  message: string; // The close reason
}>;

type AcknowledgementMessage = SevenTVWebsocketInboundMessage<{
  command: string; // The command that was acknowledged
  data: unknown; // The data that was sent with the command
}>;

// Not used
// type IdentifyMessage = SevenTVWebsocketOutboundMessage<{
// }>;

// Not used
// type ResumeMessage = SevenTVWebsocketOutboundMessage<{
//   session_id: string; // The session ID to resume
// }>;

type SubscribeMessage = SevenTVWebsocketOutboundMessage<{
  type: string; // subscription type
  condition: Record<string, string>; // filter messages by conditions
}>;

// Not used
// type UnsubscribeMessage = SevenTVWebsocketOutboundMessage<{
//   type: string; // subscription type
//   condition?: Record<string, string>; // filter messages by conditions
// }>;

let heartbeat: NodeJS.Timeout;
let missedHeartbeats = 0;
// TODO: Implement resume when a connection is dropped with a non-normal, non-error closure
// let storedSessionId: string; // To be used to resume a websocket https://github.com/SevenTV/EventAPI#resuming-websocket
const isSubscribed = false;
let isConnected = false;

function createSubscribeMessage(type: string, condition: Record<string, string>): SubscribeMessage {
  return {
    op: SevenTVWebsocketOpCodes.Subscribe,
    d: {
      type,
      condition,
    },
  };
}

export function runSevenTVWebsocket(seventTVTwitchUser: SevenTVTwitchUser) {
  const client = new websocket.client();

  client.on('connectFailed', function (error: unknown) {
    logger.error(`SevenTV WebSocket: Connect Error: ${String(error)}`);
  });

  client.on('connect', function (connection) {
    logger.info('SevenTV WebSocket: Client Connected');

    connection.on('error', function (error) {
      logger.error('SevenTV WebSocket: Connection Error: ' + error.toString());
    });

    connection.on('close', function () {
      logger.info('SevenTV WebSocket: Connection Closed');
    });

    connection.on('message', function (message) {
      if (hasOwnProperty(message, 'utf8Data') && typeof message.utf8Data === 'string') {
        const data: unknown = JSON.parse(message.utf8Data);
        if (hasOwnProperty(data, 'op') && hasOwnProperty(data, 't') && hasOwnProperty(data, 'd')) {
          const { op, t, d } = data as SevenTVWebsocketInboundMessage<unknown>;
          switch (op) {
            case SevenTVWebsocketOpCodes.Dispatch: {
              const { body } = d as DispatchMessage['d'];
              // An emote has been added to the user's emote set
              if ((body.pushed && body.pushed.length) || (body.added && body.added.length)) {
                const pushed = body.pushed || [];
                const added = body.added || [];
                for (const entry of [...pushed, ...added]) {
                  if (entry.key === 'emotes') {
                    const emote = entry.value as SevenTVEmote;
                    logger.info(`SevenTV WebSocket: Emote added: "${emote.name}" with ID: ${emote.id}`);
                    addSevenTVEmote(emote).catch((error: unknown) => logger.error(`SevenTV WebSocket: Error adding emote: ${JSON.stringify(error)}`));
                  }
                }
              }

              // An emote has been removed from the user's emote set
              if ((body.removed && body.removed.length) || (body.pulled && body.pulled.length)) {
                const pulled = body.pulled || [];
                const removed = body.removed || [];
                for (const entry of [...removed, ...pulled]) {
                  if (entry.key === 'emotes') {
                    const emote = entry.old_value as SevenTVEmote;
                    logger.info(`SevenTV WebSocket: Emote removed: "${emote.name}" with ID: ${emote.id}`);
                    removeSevenTVEmote(emote.id);
                  }
                }
              }

              break;
            }
            case SevenTVWebsocketOpCodes.Hello: {
              const { heartbeat_interval: heartbeatInterval, session_id: sessionId, subscription_limit: subscriptionLimit } = d as HelloMessage['d'];
              logger.debug(
                `SevenTV WebSocket: Hello received: ${t}. Heartbeat interval: ${heartbeatInterval}. Session ID: ${sessionId}. Subscription limit: ${subscriptionLimit}`,
              );
              isConnected = true;
              // TODO: Store session ID for resuming
              // storedSessionId = sessionId;

              // Subscribe to events
              if (!isSubscribed) {
                connection.sendUTF(JSON.stringify(createSubscribeMessage('emote_set.*', { object_id: seventTVTwitchUser.emote_set.id })));
              }

              // If there is no heartbeat, start one
              if (!heartbeat) {
                heartbeat = setInterval(() => {
                  missedHeartbeats++;

                  // If we miss 3 heartbeats, close the connection
                  if (missedHeartbeats > 3) {
                    logger.error('SevenTV WebSocket: Too many missed heartbeats, closing connection.');
                    connection.close(closeCodes.Timeout);
                    missedHeartbeats = 0;
                    isConnected = false;
                    return;
                  }
                }, heartbeatInterval);
              }
              break;
            }
            case SevenTVWebsocketOpCodes.Heartbeat: {
              const { count } = d as HeartbeatMessage['d'];
              logger.debug(`SevenTV WebSocket: Heartbeat received with count: ${count}`);
              missedHeartbeats = 0;
              break;
            }
            case SevenTVWebsocketOpCodes.Acknowledgement: {
              const { command } = d as AcknowledgementMessage['d'];
              logger.debug(`SevenTV WebSocket: Acknowledgement received for command: ${command}`);
              break;
            }
            case SevenTVWebsocketOpCodes.EndOfStream: {
              const { code, message } = d as EndOfStreamMessage['d'];
              logger.debug(`SevenTV WebSocket: End of stream received. Closing connection. Code: ${code} Reason: ${message}`);

              clearInterval(heartbeat);
              break;
            }
            default:
              logger.debug(`SevenTV WebSocket: Unknown opcode received: ${op}`);
              break;
          }
        }
      }
    });
  });
  client.connect(SEVEN_TV_WEBSOCKET_URL);
  setInterval(() => {
    if (!isConnected) {
      logger.info('SevenTV WebSocket: Connecting...');
      client.connect(SEVEN_TV_WEBSOCKET_URL);
    }
  }, 10000);
}
