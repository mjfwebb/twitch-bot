import { memo, useRef } from 'react';

import type { VirtuosoHandle } from 'react-virtuoso';
import { Virtuoso } from 'react-virtuoso';

import useStore from '../../store/store';
import { ChatEntry } from './ChatEntry';

import './Chat.less';

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
  const now = Date.now();

  const filteredChatMessages = chatMessages.filter((chatMessage) => {
    if (chatMessage.disappearAt) {
      return chatMessage.disappearAt > now;
    }
    return true;
  });

  const InnerItem = memo(({ index }: { index: number }) => {
    return (
      <ChatEntry now={now} chatMessage={filteredChatMessages[index]} background={background} showAvatars={showAvatars} showBorders={showBorders} />
    );
  });

  const itemContent = (index: number) => {
    return <InnerItem index={index} />;
  };

  return (
    <div className="chat" style={{ background, width: chatWidth ?? undefined, height: chatHeight ?? undefined, color: foreground ?? undefined }}>
      {filteredChatMessages.length > 0 && (
        <Virtuoso
          ref={virtuoso}
          alignToBottom={true}
          followOutput={'auto'}
          itemContent={itemContent}
          totalCount={filteredChatMessages.length}
          initialTopMostItemIndex={filteredChatMessages.length - 1}
          atBottomThreshold={400}
        />
      )}
    </div>
  );
};
