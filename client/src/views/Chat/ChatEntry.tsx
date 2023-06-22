import classNames from 'classnames';

import type { ChatMessage } from '../../types';
import useStore from '../../store/store';
import useSocketContext from '../../hooks/useSocketContext';
import { UserBadges } from './UserBadges';
import { contrastCorrected } from './contrastCorrected';
import { ChatMessageWithEmotes } from './ChatMessageWithEmotes';

interface ChatEntryProps {
  chatMessage: ChatMessage;
  background: string;
  showAvatars: boolean;
  showBorders: boolean;
}

export const ChatEntry = ({ chatMessage, background, showAvatars, showBorders }: ChatEntryProps) => {
  const selectedDisplayName = useStore((s) => s.selectedDisplayName);
  const color = chatMessage.parsedMessage.tags.color;
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
      >
        <span className="chat-message-content">
          <div className="chat-message-user">
            {showAvatars && (
              <span className="chat-message-avatar">
                {user.avatarUrl && <img className="chat-message-avatar-image" src={user.avatarUrl} alt="avatar" height={34} />}
              </span>
            )}
            <UserBadges badges={chatMessage.parsedMessage.tags.badges} />
            <span className="chat-message-nick" style={{ color: isSelected ? 'white' : contrastCorrected(color || '#fff', background) }}>
              {user.displayName}
            </span>
          </div>
          <span className="chat-message-text">
            <ChatMessageWithEmotes emotes={chatMessage.parsedMessage.tags.emotes} message={chatMessage.parsedMessage.parameters} />
          </span>
        </span>
      </div>
    </button>
  );
};
