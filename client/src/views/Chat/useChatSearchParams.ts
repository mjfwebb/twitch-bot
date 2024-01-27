import { DEFAULT_CHAT_SETTINGS_VALUES } from '../../constants';
import { chatSearchParamsMap } from './chatSearchParamsMap';

export const useChatSearchParams = () => {
  const searchParams = new URLSearchParams(window.location.search);

  const animatedEntry = searchParams.get(chatSearchParamsMap.animatedEntry) === 'false' ? false : true;
  const backgroundColor = searchParams.get(chatSearchParamsMap.backgroundColor) || DEFAULT_CHAT_SETTINGS_VALUES.backgroundColor;
  const height =
    searchParams.get(chatSearchParamsMap.height) || `${DEFAULT_CHAT_SETTINGS_VALUES.heightValue}${DEFAULT_CHAT_SETTINGS_VALUES.heightUnit}`;
  const width = searchParams.get(chatSearchParamsMap.width) || `${DEFAULT_CHAT_SETTINGS_VALUES.widthValue}${DEFAULT_CHAT_SETTINGS_VALUES.widthUnit}`;
  const animatedExit = searchParams.get(chatSearchParamsMap.animatedExit) === 'true' ? true : false;
  const secondsBeforeExit =
    searchParams.get(chatSearchParamsMap.secondsBeforeExit) !== null
      ? Number(searchParams.get(chatSearchParamsMap.secondsBeforeExit))
      : DEFAULT_CHAT_SETTINGS_VALUES.secondsBeforeExit;
  const dropShadowEnabled = searchParams.get(chatSearchParamsMap.dropShadowEnabled) === 'true' ? true : false;
  const dropShadowSettings = searchParams.get(chatSearchParamsMap.dropShadowSettings) || DEFAULT_CHAT_SETTINGS_VALUES.dropShadowSettings;
  const thickTextShadowEnabled = searchParams.get(chatSearchParamsMap.thickTextShadowEnabled) === 'true' ? true : false;
  const foregroundColor = searchParams.get(chatSearchParamsMap.foregroundColor) || DEFAULT_CHAT_SETTINGS_VALUES.foregroundColor;
  const showAvatars = searchParams.get(chatSearchParamsMap.showAvatars) === 'false' ? false : true;
  const showBorders = searchParams.get(chatSearchParamsMap.showBorders) === 'false' ? false : true;
  const showColonAfterDisplayName = searchParams.get(chatSearchParamsMap.showColonAfterDisplayName) === 'true' ? true : false;
  const textStrokeEnabled = searchParams.get(chatSearchParamsMap.textStrokeEnabled) === 'true' ? true : false;
  const textStrokeSettings = searchParams.get(chatSearchParamsMap.textStrokeSettings) || DEFAULT_CHAT_SETTINGS_VALUES.textStrokeSettings;
  const fontSize =
    searchParams.get(chatSearchParamsMap.fontSize) || `${DEFAULT_CHAT_SETTINGS_VALUES.fontSizeValue}${DEFAULT_CHAT_SETTINGS_VALUES.fontSizeUnit}`;
  const fontFamily = searchParams.get(chatSearchParamsMap.fontFamily) || DEFAULT_CHAT_SETTINGS_VALUES.fontFamily;
  const chatMessagePadding =
    searchParams.get(chatSearchParamsMap.chatMessagePadding) ||
    `${DEFAULT_CHAT_SETTINGS_VALUES.chatMessagePaddingValue}${DEFAULT_CHAT_SETTINGS_VALUES.chatMessagePaddingUnit}`;

  return {
    animatedEntry,
    backgroundColor,
    height,
    width,
    animatedExit,
    secondsBeforeExit,
    dropShadowEnabled,
    dropShadowSettings,
    thickTextShadowEnabled,
    foregroundColor,
    showAvatars,
    showBorders,
    showColonAfterDisplayName,
    textStrokeEnabled,
    textStrokeSettings,
    fontSize,
    fontFamily,
    chatMessagePadding,
  };
};
