import { render, screen } from '@testing-library/react';
import { describe, it, expect, beforeAll } from 'vitest';
import MessageStream from '../MessageStream';
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

  Element.prototype.scrollIntoView = () => {};
});

const makeMsg = (overrides: Partial<ChatMessage> & { id: string }): ChatMessage => ({
  role: 'user',
  content: 'test',
  cardType: null,
  cardData: null,
  timestamp: Date.now(),
  ...overrides,
});

describe('MessageStream', () => {
  it('renders the outer container with data-testid="message-stream"', () => {
    render(<MessageStream messages={[]} isLoading={false} />);
    expect(screen.getByTestId('message-stream')).toBeInTheDocument();
  });

  it('renders a MessageBubble for each message', () => {
    const messages: ChatMessage[] = [
      makeMsg({ id: '1', content: 'Hello' }),
      makeMsg({ id: '2', role: 'assistant', content: 'Hi there' }),
      makeMsg({ id: '3', content: 'Thanks' }),
    ];
    render(<MessageStream messages={messages} isLoading={false} />);
    const bubbles = screen.getAllByTestId('message-bubble');
    expect(bubbles).toHaveLength(3);
  });

  it('renders messages in the order they appear in the array', () => {
    const messages: ChatMessage[] = [
      makeMsg({ id: '1', content: 'First' }),
      makeMsg({ id: '2', content: 'Second' }),
      makeMsg({ id: '3', content: 'Third' }),
    ];
    render(<MessageStream messages={messages} isLoading={false} />);
    const bubbles = screen.getAllByTestId('message-bubble');
    expect(bubbles[0]).toHaveTextContent('First');
    expect(bubbles[1]).toHaveTextContent('Second');
    expect(bubbles[2]).toHaveTextContent('Third');
  });

  it('shows LoadingIndicator when isLoading is true', () => {
    render(<MessageStream messages={[]} isLoading={true} />);
    expect(screen.getByTestId('loading-indicator')).toBeInTheDocument();
  });

  it('does not show LoadingIndicator when isLoading is false', () => {
    render(<MessageStream messages={[]} isLoading={false} />);
    expect(screen.queryByTestId('loading-indicator')).not.toBeInTheDocument();
  });

  it('renders empty state with no bubbles when messages is empty', () => {
    render(<MessageStream messages={[]} isLoading={false} />);
    expect(screen.queryByTestId('message-bubble')).not.toBeInTheDocument();
  });

  it('shows LoadingIndicator below messages when isLoading is true', () => {
    const messages: ChatMessage[] = [
      makeMsg({ id: '1', content: 'Hello' }),
    ];
    render(<MessageStream messages={messages} isLoading={true} />);
    expect(screen.getByTestId('message-bubble')).toBeInTheDocument();
    expect(screen.getByTestId('loading-indicator')).toBeInTheDocument();
  });
});
