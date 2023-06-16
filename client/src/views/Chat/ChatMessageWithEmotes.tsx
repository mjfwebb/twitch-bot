import type { ReactElement } from 'react';

import type { Emotes } from '../../twitchTypes';
import useStore from '../../store/store';

const emoteRegex = /(\w+)/g;

type ReplacerFunction = (match: string, index: number, offset: number) => string | ReactElement;

function replaceString(text: string, regExpMatch: RegExp, replacerFunction: ReplacerFunction): string | string[] {
  let currentCharStart = 0;
  let currentCharLength = 0;

  const result = text.split(regExpMatch);

  // Deliberately apply replacerFunction to all odd elements
  for (let i = 1, length = result.length; i < length; i += 2) {
    currentCharLength = result[i].length;
    currentCharStart += result[i - 1].length;
    result[i] = replacerFunction(result[i], i, currentCharStart) as unknown as string;
    currentCharStart += currentCharLength;
  }

  return result;
}

function reactStringReplace(source: string, match: RegExp, fn: ReplacerFunction): (string | string[])[] {
  return [source].map((x) => replaceString(x, match, fn)).flat();
}

export const ChatMessageWithEmotes = ({
  emotes,
  message = '',
  offset = 0,
}: {
  emotes: Emotes | undefined;
  message: string;
  offset?: number;
}): JSX.Element => {
  const chatEmotes = useStore((s) => s.chatEmotes);

  message = message.slice(offset);

  if (!message) {
    return <></>;
  }

  const twitchEmoteMap: Record<string, string> = {};

  if (emotes) {
    Object.entries(emotes).forEach(([emoteUrlPart, positioning]) => {
      const emoteName = message.slice(Number(positioning[0].startPosition - offset), Number(positioning[0].endPosition - offset) + 1);
      twitchEmoteMap[emoteName] = `https://static-cdn.jtvnw.net/emoticons/v2/${emoteUrlPart}/default/dark/3.0`;
    });
  }

  return (
    <>
      {reactStringReplace(message, emoteRegex, (match, index) => {
        if (twitchEmoteMap[match]) {
          return <img className="chat-emote" key={`${match}.${index}`} height={36} src={twitchEmoteMap[match]} alt={match} title={match} />;
        } else if (chatEmotes[match]) {
          return <img className="chat-emote" key={`${match}.${index}`} height={36} src={chatEmotes[match].url} alt={match} title={match} />;
        } else {
          return match;
        }
      })}
    </>
  );
};
