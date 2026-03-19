import React from 'react';
import type { ChatMessage } from '@/types/chat';
import type { ProjectRecord, ClientRecord } from '@/types/chat';
import DataCard from '@/components/DataCard';

export interface MessageBubbleProps {
  message: ChatMessage;
}

const MessageBubble: React.FC<MessageBubbleProps> = ({ message }) => {
  const isUser = message.role === 'user';

  return (
    <div
      data-testid="message-bubble"
      className={`message-bubble-row ${isUser ? 'user' : 'assistant'}`}
      style={{
        display: 'flex',
        justifyContent: isUser ? 'flex-end' : 'flex-start',
      }}
    >
      <div
        data-testid={isUser ? 'user-bubble' : 'assistant-bubble'}
        className={`bubble ${isUser ? 'user' : 'assistant'}`}
        style={{
          backgroundColor: isUser ? 'rgb(22, 119, 255)' : 'rgb(240, 240, 240)',
          color: isUser ? '#fff' : '#333',
        }}
      >
        <div>{message.content}</div>
        {!isUser && message.cardType && message.cardData && (
          <DataCard
            cardType={message.cardType}
            cardData={message.cardData as ProjectRecord[] | ClientRecord[]}
            searchKeyword={message.searchKeyword ?? ''}
          />
        )}
      </div>
    </div>
  );
};

export default MessageBubble;
