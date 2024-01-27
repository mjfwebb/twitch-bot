import { useEffect, useRef } from 'react';

import { AnimatePresence, motion } from 'framer-motion';

import useStore from '../../store/store';
import type { ChatMessage } from '../../types';
import { ChatEntry } from './ChatEntry';
import { useChatSearchParams } from './useChatSearchParams';

type MessageProps = {
  chatMessage: ChatMessage;
};

const Message = ({ chatMessage }: MessageProps) => {
  const chatSearchParams = useChatSearchParams();

  useEffect(() => {
    const timer = setTimeout(() => {
      useStore.getState().removeChatMessage(chatMessage);
    }, chatSearchParams.secondsBeforeExit * 1000);

    return () => {
      clearTimeout(timer);
    };
  }, [chatSearchParams.secondsBeforeExit, chatMessage]);

  const ChatEntryProps = {
    chatMessage,
    backgroundColor: chatSearchParams.backgroundColor,
    showAvatars: chatSearchParams.showAvatars,
    showBorders: chatSearchParams.showBorders,
    dropShadowEnabled: chatSearchParams.dropShadowEnabled,
    dropShadowSettings: chatSearchParams.dropShadowSettings,
    thickTextShadowEnabled: chatSearchParams.thickTextShadowEnabled,
    showColonAfterDisplayName: chatSearchParams.showColonAfterDisplayName,
    textStrokeEnabled: chatSearchParams.textStrokeEnabled,
    textStrokeSettings: chatSearchParams.textStrokeSettings,
    chatMessagePadding: chatSearchParams.chatMessagePadding,
  };

  if (chatSearchParams.animatedEntry) {
    return (
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }} className="message">
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
