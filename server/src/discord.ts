import Discord, { EmbedBuilder } from 'discord.js';
import type { Webhook } from './config';

export const discordChatWebhook = (username: string, webhook: Webhook, chatMessage: string): void => {
  const webhookClient = new Discord.WebhookClient({ id: webhook.id, token: webhook.token });

  const embed = new EmbedBuilder()
    .setDescription(chatMessage)
    .setFooter({ text: 'This is a message sent from Twitch' })
    .setAuthor({ name: username || '' });

  void webhookClient.send({
    embeds: [embed],
  });
};
