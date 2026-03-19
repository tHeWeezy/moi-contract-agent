import { render, screen } from '@testing-library/react';
import { describe, it, expect, beforeAll } from 'vitest';
import MessageBubble from '../MessageBubble';
import type { ChatMessage } from '@/types/chat';

beforeAll(() => {
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: (query: string) => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: () => {},
      removeListener: () => {},
      addEventListener: () => {},
      removeEventListener: () => {},
      dispatchEvent: () => false,
    }),
  });
});

const baseMessage: ChatMessage = {
  id: 'test-1',
  role: 'user',
  content: '查询项目',
  cardType: null,
  cardData: null,
  timestamp: Date.now(),
};

describe('MessageBubble', () => {
  it('renders user message as right-aligned bubble with user-bubble testid', () => {
    const msg: ChatMessage = { ...baseMessage, role: 'user', content: '你好' };
    render(<MessageBubble message={msg} />);
    expect(screen.getByTestId('message-bubble')).toBeInTheDocument();
    expect(screen.getByTestId('user-bubble')).toBeInTheDocument();
    expect(screen.getByText('你好')).toBeInTheDocument();
    // right-aligned
    const outer = screen.getByTestId('message-bubble');
    expect(outer.style.justifyContent).toBe('flex-end');
  });

  it('renders assistant plain text as left-aligned bubble with assistant-bubble testid', () => {
    const msg: ChatMessage = {
      ...baseMessage,
      role: 'assistant',
      content: '抱歉，请重新输入。',
      cardType: null,
      cardData: null,
    };
    render(<MessageBubble message={msg} />);
    expect(screen.getByTestId('assistant-bubble')).toBeInTheDocument();
    expect(screen.getByText('抱歉，请重新输入。')).toBeInTheDocument();
    const outer = screen.getByTestId('message-bubble');
    expect(outer.style.justifyContent).toBe('flex-start');
    // no DataCard rendered
    expect(screen.queryByTestId('data-card')).not.toBeInTheDocument();
  });

  it('renders assistant message with cardType and cardData showing DataCard', () => {
    const msg: ChatMessage = {
      ...baseMessage,
      role: 'assistant',
      content: '为您找到 2 个项目信息。',
      cardType: 'project',
      cardData: [
        { projectId: 'P-001', projectName: '项目A', status: '执行中', manager: '张三' },
        { projectId: 'P-002', projectName: '项目B', status: '规划中', manager: '李四' },
      ],
      searchKeyword: '项目',
    };
    render(<MessageBubble message={msg} />);
    expect(screen.getByTestId('assistant-bubble')).toBeInTheDocument();
    expect(screen.getByText('为您找到 2 个项目信息。')).toBeInTheDocument();
    expect(screen.getByTestId('data-card')).toBeInTheDocument();
    const outer = screen.getByTestId('message-bubble');
    expect(outer.style.justifyContent).toBe('flex-start');
  });

  it('uses different background colors for user vs assistant', () => {
    const userMsg: ChatMessage = { ...baseMessage, role: 'user', content: 'hi' };
    const { unmount } = render(<MessageBubble message={userMsg} />);
    const userBubble = screen.getByTestId('user-bubble');
    expect(userBubble.style.backgroundColor).toBe('rgb(22, 119, 255)');
    unmount();

    const assistantMsg: ChatMessage = {
      ...baseMessage,
      role: 'assistant',
      content: 'hello',
      cardType: null,
      cardData: null,
    };
    render(<MessageBubble message={assistantMsg} />);
    const assistantBubble = screen.getByTestId('assistant-bubble');
    expect(assistantBubble.style.backgroundColor).toBe('rgb(240, 240, 240)');
  });
});
