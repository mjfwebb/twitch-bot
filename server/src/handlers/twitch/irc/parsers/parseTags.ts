import type { Tags } from '../../../../types';

// Parses the tags component of the IRC message.
export function parseTags(tags: string): Tags {
  // badge-info=;badges=broadcaster/1;color=#0000FF;...

  const tagsToIgnore = {
    // List of tags to ignore.
    'client-nonce': null,
    flags: null,
  };

  const dictParsedTags: { [key: string]: unknown } = {}; // Holds the parsed list of tags.
  // The key is the tag's name (e.g., color).
  const parsedTags = tags.split(';');

  parsedTags.forEach((tag) => {
    const parsedTag = tag.split('='); // Tags are key/value pairs.
    const tagValue = parsedTag[1] === '' ? null : parsedTag[1];

    // Switch on tag name
    switch (parsedTag[0]) {
      case 'badges':
      case 'badge-info':
        // badges=staff/1,broadcaster/1,turbo/1;
        if (tagValue) {
          const dict: { [key: string]: unknown } = {}; // Holds the list of badge objects.
          // The key is the badge's name (e.g., subscriber).
          const badges = tagValue.split(',');
          badges.forEach((pair) => {
            const badgeParts = pair.split('/');
            dict[badgeParts[0]] = badgeParts[1];
          });
          dictParsedTags[parsedTag[0]] = dict;
        } else {
          dictParsedTags[parsedTag[0]] = null;
        }
        break;
      case 'emotes':
        // emotes=25:0-4,12-16/1902:6-10

        if (tagValue) {
          const dictEmotes: { [key: string]: unknown } = {}; // Holds a list of emote objects.
          // The key is the emote's ID.
          const emotes = tagValue.split('/');
          emotes.forEach((emote) => {
            const emoteParts = emote.split(':');

            const textPositions: {
              startPosition: string;
              endPosition: string;
            }[] = []; // The list of position objects that identify
            // the location of the emote in the chat message.
            const positions = emoteParts[1].split(',');
            positions.forEach((position) => {
              const positionParts = position.split('-');
              textPositions.push({
                startPosition: positionParts[0],
                endPosition: positionParts[1],
              });
            });

            dictEmotes[emoteParts[0]] = textPositions;
          });

          dictParsedTags[parsedTag[0]] = dictEmotes;
        } else {
          dictParsedTags[parsedTag[0]] = null;
        }

        break;
      case 'emote-sets':
        // emote-sets=0,33,50,237
        if (tagValue !== null) {
          const emoteSetIds: string[] = tagValue?.split(','); // Array of emote set IDs.
          dictParsedTags[parsedTag[0]] = emoteSetIds;
        }

        break;
      default:
        // If the tag is in the list of tags to ignore, ignore
        // it; otherwise, add it.

        if (!tagsToIgnore.hasOwnProperty(parsedTag[0])) {
          dictParsedTags[parsedTag[0]] = tagValue;
        }
    }
  });

  return dictParsedTags as Tags;
}
