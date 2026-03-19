import React, { useState, useCallback } from 'react';
import type { ChatMessage } from '@/types/chat';
import MessageStream from '@/components/MessageStream';
import InputBar from '@/components/InputBar';
import { processUserMessage, generateId } from '@/services/mockEngine';

const WELCOME_TEXT =
  '你好，我是合同智能体，可以帮你审核合同、提取合同信息等等，帮你省时间、提效率~';

const ChatPanel: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleSend = useCallback(async (text: string) => {
    const userMessage: ChatMessage = {
      id: generateId(),
      role: 'user',
      content: text,
      cardType: null,
      cardData: null,
      timestamp: Date.now(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);

    try {
      const assistantMessage = await processUserMessage(text);
      setMessages((prev) => [...prev, assistantMessage]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  return (
    <div className="main-area">
      <div className="main-header">新对话</div>
      <div className="main-chat-body" data-testid="chat-panel">
        {messages.length === 0 && !isLoading ? (
          <div data-testid="welcome-message" className="welcome-text">
            {WELCOME_TEXT}
          </div>
        ) : (
          <MessageStream messages={messages} isLoading={isLoading} />
        )}
        <div style={{ marginTop: 'auto' }}>
          <InputBar onSend={handleSend} disabled={isLoading} />
        </div>
        <div className="main-footer">
          内容由第三方AI生成，无法确保真实准确，仅供参考
        </div>
      </div>
    </div>
  );
};

export default ChatPanel;
