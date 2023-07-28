import { useChatSettingsStore } from '../../store/chatSettingsStore';
import type { ChatMessage } from '../../types';
import { ChatEntry } from '../Chat/ChatEntry';

export const ChatPreview = () => {
  const backgroundColor = useChatSettingsStore((s) => s.backgroundColor);
  const showAvatars = useChatSettingsStore((s) => s.showAvatars);
  const showBorders = useChatSettingsStore((s) => s.showBorders);
  const dropShadowEnabled = useChatSettingsStore((s) => s.dropShadowEnabled);
  const dropShadowSettings = useChatSettingsStore((s) => s.dropShadowSettings);
  const showColonAfterDisplayName = useChatSettingsStore((s) => s.showColonAfterDisplayName);
  const textStrokeEnabled = useChatSettingsStore((s) => s.textStrokeEnabled);
  const textStrokeSettings = useChatSettingsStore((s) => s.textStrokeSettings);

  const chatMessageOne: ChatMessage = {
    id: '83d40613-4afc-46b5-9133-0367c89fa310',
    user: {
      userId: '30458956',
      welcomeMessage: 'Hello %nick%!',
      points: 0,
      experience: 0,
      lastSeen: '2023-07-03T17:43:21.776Z',
      avatarUrl: 'https://static-cdn.jtvnw.net/jtv_user_pictures/6e159f50-bab1-4e19-90e6-10c09710b2dc-profile_image-300x300.png',
      displayName: 'Athano',
    },
    parsedMessage: {
      tags: {
        'badge-info': {
          subscriber: '24',
        },
        badges: {
          broadcaster: '1',
          subscriber: '12',
          'game-developer': '1',
        },
        color: '#5052B2',
        'display-name': 'Athano',
        emotes: undefined,
        'first-msg': '0',
        id: '83d40613-4afc-46b5-9133-0367c89fa310',
        mod: '0',
        'returning-chatter': '0',
        'room-id': '30458956',
        subscriber: '1',
        'tmi-sent-ts': '1688817793438',
        turbo: '0',
        'user-id': '30458956',
        'user-type': null,
      },
      source: {
        nick: 'athano',
        host: 'athano@athano.tmi.twitch.tv',
      },
      command: {
        command: 'PRIVMSG',
        channel: '#athano',
      },
      parameters: 'Hello world! peepoHappy',
    },
  };

  return (
    <>
      <ChatEntry
        chatMessage={chatMessageOne}
        backgroundColor={backgroundColor}
        showAvatars={showAvatars}
        showBorders={showBorders}
        dropShadowEnabled={dropShadowEnabled}
        dropShadowSettings={dropShadowSettings}
        showColonAfterDisplayName={showColonAfterDisplayName}
        textStrokeEnabled={textStrokeEnabled}
        textStrokeSettings={textStrokeSettings}
      />
      <ChatEntry
        chatMessage={{
          id: '2',
          parsedMessage: {
            tags: {
              'display-name': 'OtherUser',
              'user-id': 'fake-user-id',
              'tmi-sent-ts': new Date().toISOString(),
              color: '#FF0000',
            },
            source: {
              nick: 'Athano',
              host: 'tmi.twitch.tv',
            },
            parameters: 'hope you are doing well! catKISS',
            command: {
              command: 'PRIVMSG',
              botCommandParams: 'hope you are doing well! catKISS',
              channel: '#athano',
              botCommand: '',
            },
          },
          user: {
            displayName: 'OtherUser',
            avatarUrl: 'https://picsum.photos/100/100',
            experience: 0,
            points: 0,
            lastSeen: new Date().toISOString(),
            userId: '1',
            welcomeMessage: '',
          },
        }}
        backgroundColor={backgroundColor}
        showAvatars={showAvatars}
        showBorders={showBorders}
        dropShadowEnabled={dropShadowEnabled}
        dropShadowSettings={dropShadowSettings}
        showColonAfterDisplayName={showColonAfterDisplayName}
        textStrokeEnabled={textStrokeEnabled}
        textStrokeSettings={textStrokeSettings}
      />
    </>
  );
};
