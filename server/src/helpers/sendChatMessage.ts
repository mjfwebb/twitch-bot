import type websocket from 'websocket';
import Config from '../config';

const channel = `#${Config.twitch.channel}`; // Replace with your channel.

export function sendChatMessage(connection: websocket.connection, message: string, amount = 1) {
  if (amount === 1) {
    connection.send(`PRIVMSG ${channel} :${message}`);
    return;
  }
  for (let x = 0; x < amount; x += 1) {
    connection.send(`PRIVMSG ${channel} :${message}`);
  }
}
