import classNames from 'classnames';

import type { ChatMessage } from '../../types';
import useStore from '../../store/store';
import useSocketContext from '../../hooks/useSocketContext';
import { UserBadges } from './UserBadges';
import { contrastCorrected } from './contrastCorrected';
import { ChatMessageWithEmotes } from './ChatMessageWithEmotes';

interface ChatEntryProps {
  chatMessage: ChatMessage;
  backgroundColor: string;
  showAvatars: boolean;
  showBorders: boolean;
  dropShadowEnabled: boolean;
  dropShadowSettings: string;
}

export const ChatEntry = ({ chatMessage, backgroundColor, showAvatars, showBorders, dropShadowEnabled, dropShadowSettings }: ChatEntryProps) => {
  const selectedDisplayName = useStore((s) => s.selectedDisplayName);
  const color = chatMessage.parsedMessage.tags.color;
  const actionMessage = chatMessage.parsedMessage.command.botCommand === 'ACTION';
  const message =
    chatMessage.parsedMessage.command.botCommand === 'ACTION'
      ? chatMessage.parsedMessage.command.botCommandParams
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
          showBorders && chatMessage.parsedMessage.tags.subscriber === '1' && 'chat-message-body-subscriber'
        )}
        style={
          dropShadowEnabled
            ? {
                textShadow: dropShadowSettings,
              }
            : {}
        }
      >
        <span>
          {showAvatars && user.avatarUrl && <img className="chat-message-avatar-image" src={user.avatarUrl} alt="avatar" height={34} />}
          <UserBadges badges={chatMessage.parsedMessage.tags.badges} />
          <span className="chat-message-nick" style={{ color: isSelected ? 'white' : contrastCorrected(color || '#fff', backgroundColor) }}>
            {user.displayName}
          </span>
          <span className={classNames('chat-message-text', actionMessage && 'chat-message-text-action')}>
            <ChatMessageWithEmotes emotes={chatMessage.parsedMessage.tags.emotes} message={message} />
          </span>
        </span>
      </div>
    </button>
  );
};
