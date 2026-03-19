import { render, screen, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, beforeAll, beforeEach, afterEach, vi } from 'vitest';
import ChatPanel from '@/components/ChatPanel';

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

describe('ChatPanel integration', () => {
  beforeEach(() => {
    vi.useFakeTimers({ shouldAdvanceTime: true });
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('shows welcome message when no messages exist', () => {
    render(<ChatPanel />);
    const welcome = screen.getByTestId('welcome-message');
    expect(welcome).toBeInTheDocument();
    expect(welcome).toHaveTextContent('你好，我是合同智能体，可以帮你审核合同、提取合同信息等等，帮你省时间、提效率~');
  });

  it('shows user bubble after sending a message', async () => {
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
    render(<ChatPanel />);

    const input = screen.getByPlaceholderText('请输入您的问题');
    await user.type(input, '查询项目');
    await user.click(screen.getByTestId('send-button'));

    // User bubble should appear
    expect(screen.getByTestId('user-bubble')).toBeInTheDocument();
    expect(screen.getByText('查询项目')).toBeInTheDocument();
    // Welcome message should be gone
    expect(screen.queryByTestId('welcome-message')).not.toBeInTheDocument();
  });

  it('shows loading indicator during the 800ms delay', async () => {
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
    render(<ChatPanel />);

    const input = screen.getByPlaceholderText('请输入您的问题');
    await user.type(input, '查询项目');
    await user.click(screen.getByTestId('send-button'));

    // Loading indicator should be visible while waiting for MockEngine
    expect(screen.getByTestId('loading-indicator')).toBeInTheDocument();
  });

  it('renders assistant response with DataCard after delay resolves', async () => {
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
    render(<ChatPanel />);

    const input = screen.getByPlaceholderText('请输入您的问题');
    await user.type(input, '查询项目');
    await user.click(screen.getByTestId('send-button'));

    // Advance past the 800ms MockEngine delay
    await act(async () => {
      vi.advanceTimersByTime(1000);
    });

    // Loading should be gone
    expect(screen.queryByTestId('loading-indicator')).not.toBeInTheDocument();
    // Assistant bubble with DataCard should appear
    expect(screen.getByTestId('assistant-bubble')).toBeInTheDocument();
    expect(screen.getByTestId('data-card')).toBeInTheDocument();
    expect(screen.getByText('为您找到与该关键词相关的 2 个项目信息。')).toBeInTheDocument();
  });
});
