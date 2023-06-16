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

const ChatEntry = ({ chatMessage, background }: { chatMessage: ChatMessage; background: string }) => {
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
    <button className="chat-message" onClick={() => socket.current?.emit('setSelectedDisplayName', user.displayName)}>
      <div
        className={classNames(
          'chat-message-body',
          isSelected && 'chat-message-body-selected',
          chatMessage.parsedMessage.tags.subscriber === '1' && 'chat-message-body-subscriber'
        )}
      >
        <div className="chat-message-avatar">
          {user.avatarUrl && <img className="chat-message-avatar-image" src={user.avatarUrl} alt="avatar" height={34} />}
        </div>
        <div className="chat-message-user">
          <UserBadges badges={chatMessage.parsedMessage.tags.badges} />
          <span className="chat-message-nick" style={{ color: isSelected ? 'white' : contrastCorrected(color || '#fff', background) }}>
            {user.displayName}
          </span>
        </div>
        <span className="chat-message-content">
          <ChatMessageWithEmotes emotes={chatMessage.parsedMessage.tags.emotes} message={chatMessage.parsedMessage.parameters} />
        </span>
      </div>
    </button>
  );
};

export const Chat = () => {
  const searchParams = new URLSearchParams(window.location.search);
  const background = searchParams.get('background') || '#121212';
  const chatMessages = useStore((s) => s.chatMessages);
  const virtuoso = useRef<VirtuosoHandle>(null);

  const InnerItem = memo(({ index }: { index: number }) => {
    return <ChatEntry chatMessage={chatMessages[index]} background={background} />;
  });

  const itemContent = (index: number) => {
    return <InnerItem index={index} />;
  };

  return (
    <div className="chat" style={{ background }}>
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
