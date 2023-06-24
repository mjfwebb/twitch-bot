import { DEFAULT_CHAT_SETTINGS_VALUES } from '../../constants';
import { chatSearchParamsMap } from './chatSearchParamsMap';

export const useChatSearchParams = () => {
  const searchParams = new URLSearchParams(window.location.search);

  const animatedEntry = searchParams.get(chatSearchParamsMap.animatedEntry) === 'false' ? false : true;
  const backgroundColor = searchParams.get(chatSearchParamsMap.backgroundColor) || DEFAULT_CHAT_SETTINGS_VALUES.backgroundColor;
  const height = searchParams.get(chatSearchParamsMap.height) || DEFAULT_CHAT_SETTINGS_VALUES.height;
  const width = searchParams.get(chatSearchParamsMap.width) || DEFAULT_CHAT_SETTINGS_VALUES.width;
  const animatedExit = searchParams.get(chatSearchParamsMap.animatedExit) === 'true' ? true : false;
  const secondsBeforeExit =
    searchParams.get(chatSearchParamsMap.secondsBeforeExit) !== null
      ? Number(searchParams.get(chatSearchParamsMap.secondsBeforeExit))
      : DEFAULT_CHAT_SETTINGS_VALUES.secondsBeforeExit;
  const dropShadowEnabled = searchParams.get(chatSearchParamsMap.dropShadowEnabled) === 'true' ? true : false;
  const dropShadowSettings = searchParams.get(chatSearchParamsMap.dropShadowSettings) || DEFAULT_CHAT_SETTINGS_VALUES.dropShadowSettings;
  const foregroundColor = searchParams.get(chatSearchParamsMap.foregroundColor) || DEFAULT_CHAT_SETTINGS_VALUES.foregroundColor;
  const showAvatars = searchParams.get(chatSearchParamsMap.showAvatars) === 'false' ? false : true;
  const showBorders = searchParams.get(chatSearchParamsMap.showBorders) === 'false' ? false : true;

  return {
    animatedEntry,
    backgroundColor,
    height,
    width,
    animatedExit,
    secondsBeforeExit,
    dropShadowEnabled,
    dropShadowSettings,
    foregroundColor,
    showAvatars,
    showBorders,
  };
};
