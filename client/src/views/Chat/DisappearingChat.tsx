import { useEffect, useRef } from 'react';

import { AnimatePresence, motion } from 'framer-motion';

import type { ChatMessage } from '../../types';
import useStore from '../../store/store';
import { useChatSearchParams } from './useChatSearchParams';
import { ChatEntry } from './ChatEntry';

type MessageProps = {
  chatMessage: ChatMessage;
};

const Message = ({ chatMessage }: MessageProps) => {
  const chatSearchParams = useChatSearchParams();

  useEffect(() => {
    const timer = setTimeout(() => {
      useStore.getState().removeChatMessage(chatMessage);
    }, chatSearchParams.disappearsTime * 1000);

    return () => {
      clearTimeout(timer);
    };
  }, [chatSearchParams.disappearsTime, chatMessage]);

  const ChatEntryProps = {
    chatMessage,
    background: chatSearchParams.background,
    showAvatars: chatSearchParams.showAvatars,
    showBorders: chatSearchParams.showBorders,
    dropShadow: chatSearchParams.dropShadow,
    dropShadowColor: chatSearchParams.dropShadowColor,
  };

  if (chatSearchParams.animatedEntry) {
    return (
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="message">
        <ChatEntry {...ChatEntryProps} />
      </motion.div>
    );
  } else {
    return <ChatEntry {...ChatEntryProps} />;
  }
};

export const DisappearingChat = () => {
  const chatMessages = useStore((s) => s.chatMessages);
  const bottomRef = useRef<HTMLDivElement | null>(null);

  const scrollToBottom = () => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [chatMessages]);

  return (
    <div className="chat-disappearing">
      <AnimatePresence>
        {chatMessages.map((chatMessage) => (
          <Message key={chatMessage.id} chatMessage={chatMessage} />
        ))}
      </AnimatePresence>
      <div ref={bottomRef} />
    </div>
  );
};
