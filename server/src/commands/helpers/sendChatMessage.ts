import type websocket from "websocket";
import Config from "../../config";
import { MAX_TWITCH_MESSAGE_LENGTH } from "../../constants";

const channel = `#${Config.twitch.channel}`; // Replace with your channel.

export function sendChatMessage(
  connection: websocket.connection,
  message: string,
  amount = 1,
) {
  if (message.length < MAX_TWITCH_MESSAGE_LENGTH) {
    sendMessage(message);
  } else {
    const messageWords = message.split(" ");
    let newMessage = "";
    messageWords.forEach((word) => {
      if (newMessage.length + word.length > MAX_TWITCH_MESSAGE_LENGTH - 1) {
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
