import { DEFAULT_CHAT_SETTINGS_VALUES } from '../../constants';

export const useChatSearchParams = () => {
  const searchParams = new URLSearchParams(window.location.search);

  const animatedEntry = searchParams.get('animated-entry') === 'false' ? false : true;
  const background = searchParams.get('background') || DEFAULT_CHAT_SETTINGS_VALUES.backgroundColor;
  const chatHeight = searchParams.get('height') || DEFAULT_CHAT_SETTINGS_VALUES.height;
  const chatWidth = searchParams.get('width') || DEFAULT_CHAT_SETTINGS_VALUES.width;
  const disappears = searchParams.get('disappears') === 'true' ? true : false;
  const disappearsTime =
    searchParams.get('disappears-time') !== null ? Number(searchParams.get('disappears-time')) : DEFAULT_CHAT_SETTINGS_VALUES.disappearsTime;
  const dropShadow = searchParams.get('drop-shadow') === 'true' ? true : false;
  const dropShadowColor = searchParams.get('drop-shadow-color') || DEFAULT_CHAT_SETTINGS_VALUES.dropShadowColor;
  const foreground = searchParams.get('foreground') || DEFAULT_CHAT_SETTINGS_VALUES.foregroundColor;
  const showAvatars = searchParams.get('avatars') === 'false' ? false : true;
  const showBorders = searchParams.get('borders') === 'false' ? false : true;

  return {
    animatedEntry,
    background,
    chatHeight,
    chatWidth,
    disappears,
    disappearsTime,
    dropShadow,
    dropShadowColor,
    foreground,
    showAvatars,
    showBorders,
  };
};
