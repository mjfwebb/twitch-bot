import websocket from 'websocket';
import { addChatMessage } from './chatMessages';
import { getChatUser } from './commands/helpers/findOrCreateUser';
import Config from './config';
import { botCommandHandler } from './handlers/botCommandHandler';
import { discordChatWebhook } from './handlers/discord/discord';
import { bitHandler } from './handlers/twitch/irc/bitHandler';
import { firstMessageHandler } from './handlers/twitch/irc/firstMessageHandler';
import { firstMessageOfStreamHandler } from './handlers/twitch/irc/firstMessageOfStreamHandler';
import { returningChatterHandler } from './handlers/twitch/irc/returningChatterHandler';
import { parseMessage } from './parsers/parseMessage';
import { getCurrentAccessToken } from './twitch';

let connectionRef: websocket.connection | undefined;

export const getConnection = () => connectionRef;

export function runBot() {
  const client = new websocket.client();
  const channel = `#${Config.twitch.channel}`; // Replace with your channel.

  client.on('connectFailed', function (error: unknown) {
    console.log(`Connect Error: ${String(error)}`);
  });

  client.on('connect', function (connection) {
    console.log('WebSocket Client Connected');

    // Store the connection ref so it can be exported
    connectionRef = connection;

    // Twitch IRC capabilities.
    connection.send('CAP REQ :twitch.tv/commands twitch.tv/tags');

    // Authenticate with the Twitch IRC server and then join the channel.
    // If the authentication fails, the server drops the connection.
    connection.send(`PASS oauth:${getCurrentAccessToken()}`);
    connection.send(`NICK ${Config.twitch.account}`);

    connection.on('error', function (error) {
      console.log('Connection Error: ' + error.toString());
    });

    connection.on('close', function () {
      console.log('Connection Closed');
      connectionRef = undefined;
      // console.log(`close description: ${connection.closeDescription}`);
      // console.log(`close reason code: ${connection.closeReasonCode}`);
    });

    // Process the Twitch IRC message.

    connection.on('message', function (ircMessage) {
      if (ircMessage.type === 'utf8') {
        const rawIrcMessage = ircMessage.utf8Data.trimEnd();
        // console.log(`Message received (${new Date().toISOString()}): '${rawIrcMessage}'\n`);

        const messages = rawIrcMessage.split('\r\n'); // The IRC message may contain one or more messages.
        messages.forEach((message) => {
          const parsedMessage = parseMessage(message);

          if (parsedMessage && parsedMessage.command) {
            const botCommand = parsedMessage.command.botCommand;

            switch (parsedMessage.command.command) {
              case 'PRIVMSG':
                botCommandHandler(connection, parsedMessage).catch((e) => console.error(e));
                bitHandler(connection, parsedMessage).catch((e) => console.error(e));
                firstMessageHandler(connection, parsedMessage);
                firstMessageOfStreamHandler(connection, parsedMessage).catch((e) => console.error(e));
                returningChatterHandler(connection, parsedMessage);

                if (!botCommand && parsedMessage.source?.nick && parsedMessage.parameters) {
                  discordChatWebhook(parsedMessage.source.nick, Config.webhooks.discordChatHook, parsedMessage.parameters);

                  const userId = parsedMessage.tags?.['user-id'];
                  const nick = parsedMessage.source.nick;

                  if (userId) {
                    getChatUser(userId, nick)
                      .then((user) => {
                        addChatMessage({ user, parsedMessage });
                      })
                      .catch((e) => {
                        console.error(e);
                      });
                  }
                }
                break;
              case 'PING':
                if (parsedMessage.parameters) {
                  connection.send(`PONG ${parsedMessage.parameters}`);
                }
                break;
              case '001':
                // Successfully logged in, so join the channel.
                connection.send(`JOIN ${channel}`);
                break;
              case 'PART':
                // NOTE: This could be due the use of Membership Commands (https://dev.twitch.tv/docs/irc/membership)
                // console.log('The channel must have banned (/ban) the bot.');
                // connection.close();
                break;
              case 'NOTICE':
                // If the authentication failed, leave the channel.
                // The server will close the connection.
                if ('Login authentication failed' === parsedMessage.parameters) {
                  console.log(`Authentication failed; left ${channel}`);
                  connection.send(`PART ${channel}`);
                } else if ("You don't have permission to perform that action" === parsedMessage.parameters) {
                  console.log(`No permission. Check if the access token is still valid. Left ${channel}`);
                  connection.send(`PART ${channel}`);
                }
                break;
              default: // Ignore all other IRC messages.
            }
          }
        });
      }
    });
  });
  client.connect('ws://irc-ws.chat.twitch.tv:80');
}
