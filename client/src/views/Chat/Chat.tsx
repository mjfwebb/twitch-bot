import { memo, useRef } from 'react';

import type { VirtuosoHandle } from 'react-virtuoso';
import { Virtuoso } from 'react-virtuoso';
import classNames from 'classnames';

import type { ChatMessage } from '../../types';
import useStore from '../../store/store';
import useSocketContext from '../../hooks/useSocketContext';
import { UserBadges } from './UserBadges';
import { contrastCorrected } from './contrastCorrected';
import { ChatMessageWithEmotes } from './ChatMessageWithEmotes';

import './Chat.less';

interface ChatEntryProps {
  chatMessage: ChatMessage;
  background: string;
  showAvatars: boolean;
  showBorders: boolean;
}

const ChatEntry = ({ chatMessage, background, showAvatars, showBorders }: ChatEntryProps) => {
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
    <button
      className={classNames(
        'chat-message',
        chatMessage.isDisappearingSoon && 'chat-message-disappearing-soon',
        chatMessage.disappeared && 'chat-message-disappeared'
      )}
      onClick={() => socket.current?.emit('setSelectedDisplayName', user.displayName)}
    >
      <div
        className={classNames(
          'chat-message-body',
          isSelected && 'chat-message-body-selected',
          showBorders && chatMessage.parsedMessage.tags.subscriber === '1' && 'chat-message-body-subscriber'
        )}
      >
        {showAvatars && (
          <div className="chat-message-avatar">
            {user.avatarUrl && <img className="chat-message-avatar-image" src={user.avatarUrl} alt="avatar" height={34} />}
          </div>
        )}

        <span className="chat-message-content">
          <div className="chat-message-user">
            <UserBadges badges={chatMessage.parsedMessage.tags.badges} />
            <span className="chat-message-nick" style={{ color: isSelected ? 'white' : contrastCorrected(color || '#fff', background) }}>
              {user.displayName}
            </span>
          </div>
          <ChatMessageWithEmotes emotes={chatMessage.parsedMessage.tags.emotes} message={chatMessage.parsedMessage.parameters} />
        </span>
      </div>
    </button>
  );
};

export const Chat = () => {
  const chatMessages = useStore((s) => s.chatMessages);
  const virtuoso = useRef<VirtuosoHandle>(null);
  const searchParams = new URLSearchParams(window.location.search);
  const foreground = searchParams.get('foreground') || 'white';
  const background = searchParams.get('background') || 'transparent';
  const showAvatars = searchParams.get('avatars') === 'false' ? false : true;
  const showBorders = searchParams.get('borders') === 'false' ? false : true;
  const chatWidth = searchParams.get('width');
  const chatHeight = searchParams.get('height');

  const InnerItem = memo(({ index }: { index: number }) => {
    return <ChatEntry chatMessage={chatMessages[index]} background={background} showAvatars={showAvatars} showBorders={showBorders} />;
  });

  const itemContent = (index: number) => {
    return <InnerItem index={index} />;
  };

  return (
    <div className="chat" style={{ background, width: chatWidth ?? undefined, height: chatHeight ?? undefined, color: foreground ?? undefined }}>
      {chatMessages.length > 0 && (
        <Virtuoso
          ref={virtuoso}
          alignToBottom={true}
          followOutput={'auto'}
          itemContent={itemContent}
          totalCount={chatMessages.length}
          initialTopMostItemIndex={chatMessages.length - 1}
          atBottomThreshold={400}
        />
      )}
    </div>
  );
};
