import React, { useRef, useEffect } from 'react';
import type { ChatMessage } from '@/types/chat';
import MessageBubble from '@/components/MessageBubble';
import LoadingIndicator from '@/components/LoadingIndicator';

export interface MessageStreamProps {
  messages: ChatMessage[];
  isLoading: boolean;
}

const MessageStream: React.FC<MessageStreamProps> = ({ messages, isLoading }) => {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  return (
    <div
      data-testid="message-stream"
      style={{
        flex: 1,
        overflowY: 'auto',
        padding: '16px 0',
      }}
    >
      {messages.map((msg) => (
        <MessageBubble key={msg.id} message={msg} />
      ))}
      {isLoading && <LoadingIndicator />}
      <div ref={bottomRef} />
    </div>
  );
};

export default MessageStream;
