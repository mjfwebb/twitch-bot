import { memo, useRef } from 'react';

import { motion } from 'framer-motion';
import type { VirtuosoHandle } from 'react-virtuoso';
import { Virtuoso } from 'react-virtuoso';

import useStore from '../../store/store';
import { ChatEntry } from './ChatEntry';
import { useChatSearchParams } from './useChatSearchParams';

export const NonDisappearingChat = () => {
  const chatSearchParams = useChatSearchParams();

  const chatMessages = useStore((s) => s.chatMessages);
  const virtuoso = useRef<VirtuosoHandle>(null);

  const InnerItem = memo(({ index }: { index: number }) => {
    return (
      <ChatEntry
        chatMessage={chatMessages[index]}
        backgroundColor={chatSearchParams.backgroundColor}
        showAvatars={chatSearchParams.showAvatars}
        showBorders={chatSearchParams.showBorders}
        dropShadowEnabled={chatSearchParams.dropShadowEnabled}
        dropShadowSettings={chatSearchParams.dropShadowSettings}
        textStrokeEnabled={chatSearchParams.textStrokeEnabled}
        textStrokeSettings={chatSearchParams.textStrokeSettings}
        showColonAfterDisplayName={chatSearchParams.showColonAfterDisplayName}
        chatMessagePadding={chatSearchParams.chatMessagePadding}
      />
    );
  });

  const itemContent = (index: number) => {
    if (chatSearchParams.animatedEntry) {
      return (
        <motion.div initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 50 }} className="message">
          <InnerItem index={index} />
        </motion.div>
      );
    } else {
      return <InnerItem index={index} />;
    }
  };

  return (
    <Virtuoso
      ref={virtuoso}
      alignToBottom={true}
      followOutput={'auto'}
      itemContent={itemContent}
      totalCount={chatMessages.length}
      initialTopMostItemIndex={chatMessages.length - 1}
      atBottomThreshold={400}
    />
  );
};
