import type { ParsedMessage, ParsedMessageWithAllProps } from '../../types';

export const parsedMessageHasAllProps = (parsedMessage: ParsedMessage): parsedMessage is ParsedMessageWithAllProps => {
  return (
    !!parsedMessage.source &&
    !!parsedMessage.tags &&
    !!parsedMessage.command &&
    !!parsedMessage.command.botCommandParams &&
    !!parsedMessage.parameters
  );
};
