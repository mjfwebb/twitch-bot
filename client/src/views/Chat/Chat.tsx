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
  disappears: boolean;
  showBorders: boolean;
  disappearsTime: number;
}

const ChatEntry = ({ chatMessage, background, showAvatars, showBorders, disappears, disappearsTime }: ChatEntryProps) => {
  const selectedDisplayName = useStore((s) => s.selectedDisplayName);
  const color = chatMessage.parsedMessage.tags.color;
  const { socket } = useSocketContext();

  // Set default user if no user
  const user = chatMessage.user ?? {
    displayName: chatMessage.parsedMessage.tags['display-name'] || 'unknown',
    avatarUrl: '',
  };

  const isSelected = selectedDisplayName === user.displayName;

  let isDisappeared = false;
  if (disappears) {
    const messageTime = new Date(Number(chatMessage.parsedMessage.tags['tmi-sent-ts'])).getTime();
    const disappearsTimeSeconds = disappearsTime * 1000;
    const differenceBetweenMessageAndNow = Date.now() - messageTime;
    isDisappeared = disappearsTimeSeconds < differenceBetweenMessageAndNow;
  }

  return (
    <button
      className={classNames('chat-message', isDisappeared && 'chat-message-disappeared')}
      style={disappears ? { animation: `hide ${String(disappearsTime)}s forwards` } : undefined}
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
  const chatMessages = useStore((s) => s.chatMessages);
  const virtuoso = useRef<VirtuosoHandle>(null);
  const searchParams = new URLSearchParams(window.location.search);
  const disappears = searchParams.get('disappears') === 'true' ? true : false;
  const disappearsTime = searchParams.get('disappears-time') !== null ? Number(searchParams.get('disappears-time')) : 10;
  const foreground = searchParams.get('foreground');
  const background = searchParams.get('background') || 'transparent';
  const showAvatars = searchParams.get('avatars') === 'false' ? false : true;
  const showBorders = searchParams.get('borders') === 'false' ? false : true;
  const chatWidth = searchParams.get('width');
  const chatHeight = searchParams.get('height');

  const InnerItem = memo(({ index }: { index: number }) => {
    return (
      <ChatEntry
        chatMessage={chatMessages[index]}
        background={background}
        showAvatars={showAvatars}
        showBorders={showBorders}
        disappears={disappears}
        disappearsTime={disappearsTime}
      />
    );
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
          atTopThreshold={400}
        />
      )}
    </div>
  );
};
