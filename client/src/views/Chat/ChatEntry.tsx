import classNames from 'classnames';

import useSocketContext from '../../hooks/useSocketContext';
import useStore from '../../store/store';
import type { ChatMessage } from '../../types';
import { ChatImageRenderer } from './ChatImageRenderer';
import { contrastCorrected } from './contrastCorrected';
import { UserBadges } from './UserBadges';

interface ChatEntryProps {
  chatMessage: ChatMessage;
  backgroundColor: string;
  showAvatars: boolean;
  showBorders: boolean;
  dropShadowEnabled: boolean;
  dropShadowSettings: string;
  thickTextShadowEnabled: boolean;
  textStrokeEnabled: boolean;
  textStrokeSettings: string;
  showColonAfterDisplayName: boolean;
  chatMessagePadding: string;
}

export const ChatEntry = ({
  chatMessage,
  backgroundColor,
  showAvatars,
  showBorders,
  dropShadowEnabled,
  dropShadowSettings,
  textStrokeEnabled,
  textStrokeSettings,
  thickTextShadowEnabled,
  showColonAfterDisplayName,
  chatMessagePadding,
}: ChatEntryProps) => {
  const selectedDisplayName = useStore((s) => s.selectedDisplayName);
  const color = chatMessage.parsedMessage.tags.color;
  const actionMessage = chatMessage.parsedMessage.command.botCommand === 'ACTION';
  const message =
    chatMessage.parsedMessage.command.botCommand === 'ACTION'
      ? chatMessage.parsedMessage.command.botCommandParams || chatMessage.parsedMessage.parameters
      : chatMessage.parsedMessage.parameters;

  const { socket } = useSocketContext();

  // Set default user if no user
  const user = chatMessage.user ?? {
    displayName: chatMessage.parsedMessage.tags['display-name'] || 'unknown',
    avatarUrl: '',
  };

  const isSelected = selectedDisplayName === user.displayName;

  return (
    <button className={classNames('chat-message')} onClick={() => socket.current?.emit('setSelectedDisplayName', user.displayName)}>
      <div
        className={classNames(
          'chat-message-body',
          isSelected && 'chat-message-body-selected',
          showBorders && chatMessage.parsedMessage.tags.subscriber === '1' && 'chat-message-body-subscriber',
          chatMessage.isSpotlighted && 'chat-message-body-spotlighted',
          dropShadowEnabled && thickTextShadowEnabled && 'chat-message-body-thick-text-shadow',
        )}
        style={{
          ...(dropShadowEnabled && !thickTextShadowEnabled
            ? {
                textShadow: dropShadowSettings,
              }
            : {}),
          ...(textStrokeEnabled
            ? {
                ['-webkit-text-stroke']: textStrokeSettings,
              }
            : {}),
          padding: chatMessagePadding,
        }}
      >
        <span>
          {showAvatars && user.avatarUrl && <img className="chat-message-avatar-image" src={user.avatarUrl} alt="avatar" height={34} />}
          <UserBadges badges={chatMessage.parsedMessage.tags.badges} />
          <span
            className="chat-message-nick"
            style={{
              color: isSelected || chatMessage.isSpotlighted ? 'white' : contrastCorrected(color || '#fff', backgroundColor),
            }}
          >
            {user.displayName}
          </span>
          {showColonAfterDisplayName && !actionMessage && ': '}
          <span className={classNames('chat-message-text', actionMessage && 'chat-message-text-action')}>
            <ChatImageRenderer
              emotes={chatMessage.parsedMessage.tags.emotes}
              bits={Number(chatMessage.parsedMessage.tags.bits || '')}
              message={message}
            />
          </span>
        </span>
      </div>
    </button>
  );
};
