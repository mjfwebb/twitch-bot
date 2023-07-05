import type { connection } from 'websocket';
import type { Quote } from '../storage-models/quotes-model';
import { Quotes } from '../storage-models/quotes-model';
import { getStreamCategory } from '../streamState';
import type { BotCommand } from '../types';
import { hasBotCommandParams } from './helpers/hasBotCommandParams';
import { sendChatMessage } from './helpers/sendChatMessage';

const quoteHelpText = `The possible quote commands are: add, delete, update, random, count, last`;
const noQuoteHelpText = `There are no quotes yet. You can add one with the command !quote add <quote>.`;

function sendChatQuote(connection: connection, quote: Quote) {
  sendChatMessage(connection, `Quote ${quote.quoteId}, added by ${quote.author}: ${quote.quoteText}`);
}

export const quote: BotCommand = {
  command: 'quote',
  id: 'quote',
  privileged: false,
  hidden: false,
  description: 'Quote commands. Use !quote help for more information.',
  callback: (connection, parsedCommand) => {
    if (hasBotCommandParams(parsedCommand.parsedMessage)) {
      const quoteParams = parsedCommand.parsedMessage.command?.botCommandParams;
      if (quoteParams) {
        const newCommandParts = quoteParams.split(' ');
        if (newCommandParts.length > 1) {
          const commandName = newCommandParts[0];
          const quoteText = newCommandParts.splice(1).join(' ');
          const isoString = new Date().toISOString();
          switch (commandName) {
            case 'add': {
              const newId = Quotes.nextId();
              Quotes.saveOne({
                quoteId: newId,
                quoteText,
                author: parsedCommand.parsedMessage.tags?.['display-name'] || 'unknown',
                category: getStreamCategory(),
                deleted: false,
                createdAt: isoString,
                updatedAt: isoString,
              });

              sendChatMessage(connection, `Quote ${newId} added. You can see it by using the command !quote ${newId}.`);
              break;
            }
            case 'delete': {
              const foundQuote = Quotes.findOneByQuoteId(quoteText);

              if (!Number(quoteText)) {
                sendChatMessage(connection, `That doesn't seem right. To delete a quote, use the command !quote delete <quoteId>.`);
                break;
              }

              if (foundQuote) {
                Quotes.deleteOne(foundQuote);
                sendChatMessage(connection, `Quote ${foundQuote.quoteId} deleted.`);
              } else {
                sendChatMessage(connection, `Unable to find a quote with the id ${quoteParams}.`);
              }

              break;
            }
            case 'update': {
              const foundQuote = Quotes.findOneByQuoteId(quoteText);

              if (foundQuote) {
                Quotes.saveOne({
                  ...foundQuote,
                  quoteText,
                  updatedAt: isoString,
                });
                sendChatMessage(connection, `Quote number ${foundQuote.quoteId} updated.`);
              }
              break;
            }
            default:
              sendChatMessage(connection, `That doesn't seem right. ${quoteHelpText}`);
              break;
          }
        } else {
          if (Number(quoteParams) > 0) {
            const foundQuote = Quotes.findOneByQuoteId(quoteParams);
            if (foundQuote) {
              sendChatQuote(connection, foundQuote);
            } else {
              sendChatMessage(connection, `Unable to find a quote with the id ${quoteParams}.`);
            }
          } else if (quoteParams === 'random') {
            const randomQuote = Quotes.data[Math.floor(Math.random() * Quotes.data.length)];
            if (randomQuote) {
              sendChatQuote(connection, randomQuote);
            } else {
              sendChatMessage(connection, noQuoteHelpText);
            }
          } else if (quoteParams === 'count') {
            sendChatMessage(connection, `There are ${Quotes.data.length} quotes.`);
          } else if (quoteParams === 'last') {
            const lastQuote = Quotes.data[Quotes.data.length - 1];
            if (lastQuote) {
              sendChatQuote(connection, lastQuote);
            } else {
              sendChatMessage(connection, noQuoteHelpText);
            }
          } else if (quoteParams === 'help') {
            sendChatMessage(connection, quoteHelpText);
          } else {
            sendChatMessage(connection, `That doesn't seem right. To get a quote, use the command !quote <quoteId>.`);
          }
        }
      }
    }
  },
};
