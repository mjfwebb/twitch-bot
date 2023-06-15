import { memo, useRef } from 'react';

import type { VirtuosoHandle } from 'react-virtuoso';
import { Virtuoso } from 'react-virtuoso';
import classNames from 'classnames';

import type { ChatMessage } from '../../types';
import useStore from '../../store/store';
import { usePersistentStore } from '../../store/persistentStore';
import useSocketContext from '../../hooks/useSocketContext';
import { UserBadges } from './UserBadges';
import { ChatMessageWithEmotes } from './ChatMessageWithEmotes';

import './Chat.less';

const ChatEntry = ({ chatMessage }: { chatMessage: ChatMessage }) => {
  const selectedDisplayName = useStore((s) => s.selectedDisplayName);
  const color = chatMessage.parsedMessage.tags.color;
  const { socket } = useSocketContext();
  const avatarUrl = chatMessage.user?.avatarUrl || '';

  const user = chatMessage.user ?? {
    displayName: chatMessage.parsedMessage.tags['display-name'] || 'unknown',
  };
  const isSelected = selectedDisplayName === user.displayName;

  return (
    <button className="chat-message" onClick={() => socket.current?.emit('setSelectedDisplayName', user.displayName)}>
      <div
        className={classNames(
          'chat-message-background',
          chatMessage.parsedMessage.tags.subscriber === '1' && 'chat-message-background-subscriber'
          // chatMessage.parsedMessage.tags.mod === '1' && 'chat-message-background-moderator',
          // chatMessage.parsedMessage.tags.vip === '1' && 'chat-message-background-vip'
        )}
      >
        <div className={classNames('chat-message-body', isSelected && 'chat-message-selected')} key={chatMessage.parsedMessage.tags.id}>
          <div className="chat-message-avatar">
            {avatarUrl && <img className="chat-message-avatar-image" src={avatarUrl} alt="avatar" height={34} />}
          </div>
          <div className="chat-message-user">
            <UserBadges badges={chatMessage.parsedMessage.tags.badges} />
            <span className="chat-message-nick" style={{ color: isSelected ? 'white' : color }}>
              {user.displayName}
            </span>
          </div>
          <span className="chat-message-content">
            <ChatMessageWithEmotes emotes={chatMessage.parsedMessage.tags.emotes} message={chatMessage.parsedMessage.parameters} />
          </span>
        </div>
      </div>
    </button>
  );
};

export const Chat = () => {
  const chatMessages = usePersistentStore((s) => s.chatMessages);
  const virtuoso = useRef<VirtuosoHandle>(null);

  const InnerItem = memo(({ index }: { index: number }) => {
    return <ChatEntry chatMessage={chatMessages[index]} />;
  });

  const itemContent = (index: number) => {
    return <InnerItem index={index} />;
  };

  return (
    <div className="chat">
      {chatMessages.length > 0 && (
        <Virtuoso
          ref={virtuoso}
          alignToBottom={true}
          followOutput={'auto'}
          itemContent={itemContent}
          totalCount={chatMessages.length}
          initialTopMostItemIndex={chatMessages.length - 1}
          atBottomThreshold={12}
        />
      )}
    </div>
  );
};
