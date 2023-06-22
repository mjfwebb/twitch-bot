import { memo, useRef } from 'react';

import type { VirtuosoHandle } from 'react-virtuoso';
import { Virtuoso } from 'react-virtuoso';
import { motion } from 'framer-motion';

import useStore from '../../store/store';
import { useChatSearchParams } from './useChatSearchParams';
import { ChatEntry } from './ChatEntry';

export const NonDisappearingChat = () => {
  const chatSearchParams = useChatSearchParams();

  const chatMessages = useStore((s) => s.chatMessages);
  const virtuoso = useRef<VirtuosoHandle>(null);

  console.log('NonDisappearingChat', chatMessages);

  const InnerItem = memo(({ index }: { index: number }) => {
    return (
      <ChatEntry
        chatMessage={chatMessages[index]}
        background={chatSearchParams.background}
        showAvatars={chatSearchParams.showAvatars}
        showBorders={chatSearchParams.showBorders}
        dropShadow={chatSearchParams.dropShadow}
        dropShadowColor={chatSearchParams.dropShadowColor}
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
