import type websocket from 'websocket';
import Config from '../../config';

const channel = `#${Config.twitch.channel}`; // Replace with your channel.

export function sendChatMessage(connection: websocket.connection, message: string, amount = 1) {
  if (message.length < 450) {
    sendMessage(message);
  } else {
    const messageWords = message.split(' ');
    let newMessage = '';
    messageWords.forEach((word) => {
      if (newMessage.length + word.length > 450) {
        sendMessage(newMessage);
        newMessage = word;
      } else {
        newMessage = `${newMessage} ${word}`;
      }
    });
    if (newMessage.length > 0) {
      sendMessage(newMessage);
    }
  }

  function sendMessage(message: string) {
    if (amount === 1) {
      connection.send(`PRIVMSG ${channel} :${message}`);
      return;
    }
    for (let x = 0; x < amount; x += 1) {
      connection.send(`PRIVMSG ${channel} :${message}`);
    }
  }
}
