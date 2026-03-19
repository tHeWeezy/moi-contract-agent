import { render, screen, cleanup } from '@testing-library/react';
import { describe, it, expect, beforeAll, afterEach } from 'vitest';
import * as fc from 'fast-check';
import MessageStream from '@/components/MessageStream';
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

afterEach(() => {
  cleanup();
});

// Use alphanumeric content to avoid whitespace-normalization issues with toHaveTextContent
const chatMessageArb = fc.record({
  id: fc.uuid(),
  role: fc.constantFrom('user', 'assistant') as fc.Arbitrary<'user' | 'assistant'>,
  content: fc.stringMatching(/^[a-zA-Z0-9]{1,20}$/),
  cardType: fc.constant(null),
  cardData: fc.constant(null),
  timestamp: fc.nat(),
});

// Feature: contract-agent-inquiry, Property 1: 消息时间排序不变量
// **Validates: Requirements 1.3**
describe('Property 1: 消息时间排序不变量', () => {
  it('MessageStream 渲染顺序与 timestamp 升序排列一致', () => {
    fc.assert(
      fc.property(
        fc.array(chatMessageArb, { minLength: 1, maxLength: 10 }),
        (messages) => {
          // Sort by timestamp ascending (as ChatPanel would do upstream)
          const sorted = [...messages].sort((a, b) => a.timestamp - b.timestamp);

          cleanup();
          const { unmount } = render(
            <MessageStream messages={sorted} isLoading={false} />
          );

          const bubbles = screen.getAllByTestId('message-bubble');
          expect(bubbles).toHaveLength(sorted.length);

          // Verify rendered order matches timestamp-sorted order by checking content
          bubbles.forEach((bubble, index) => {
            expect(bubble.textContent).toContain(sorted[index].content);
          });

          unmount();
        }
      ),
      { numRuns: 100 }
    );
  });
});
