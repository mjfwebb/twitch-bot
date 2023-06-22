import { useEffect, useRef } from 'react';

import { AnimatePresence, motion } from 'framer-motion';

import type { ChatMessage } from '../../types';
import useStore from '../../store/store';
import { ChatEntry } from './ChatEntry';

type MessageProps = {
  chatMessage: ChatMessage;
};

const Message = ({ chatMessage }: MessageProps) => {
  const searchParams = new URLSearchParams(window.location.search);
  const background = searchParams.get('background') || 'transparent';
  const disappearsTime = searchParams.get('disappears-time') !== null ? Number(searchParams.get('disappears-time')) : 10;
  const showAvatars = searchParams.get('avatars') === 'false' ? false : true;
  const showBorders = searchParams.get('borders') === 'false' ? false : true;
  const animatedEntry = searchParams.get('animated-entry') === 'false' ? false : true;

  useEffect(() => {
    const timer = setTimeout(() => {
      useStore.getState().removeChatMessage(chatMessage);
    }, disappearsTime * 1000);

    return () => {
      clearTimeout(timer);
    };
  }, [disappearsTime, chatMessage]);

  if (animatedEntry) {
    return (
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="message">
        <ChatEntry chatMessage={chatMessage} background={background} showAvatars={showAvatars} showBorders={showBorders} />
      </motion.div>
    );
  } else {
    return <ChatEntry chatMessage={chatMessage} background={background} showAvatars={showAvatars} showBorders={showBorders} />;
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
