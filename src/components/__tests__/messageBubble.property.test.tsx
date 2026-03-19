import { render, screen } from '@testing-library/react';
import { describe, it, expect, beforeAll } from 'vitest';
import * as fc from 'fast-check';
import MessageBubble from '@/components/MessageBubble';
import type { ChatMessage, ProjectRecord, ClientRecord } from '@/types/chat';

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

const projectRecordArb = fc.record({
  projectId: fc.string({ minLength: 1 }),
  projectName: fc.string({ minLength: 1 }),
  status: fc.string({ minLength: 1 }),
  manager: fc.string({ minLength: 1 }),
});

const clientRecordArb = fc.record({
  clientId: fc.string({ minLength: 1 }),
  clientName: fc.string({ minLength: 1 }),
  contact: fc.string({ minLength: 1 }),
  level: fc.string({ minLength: 1 }),
});

/**
 * Generator: random ChatMessage with consistent role/cardType/cardData constraints.
 * - role='user' → cardType=null, cardData=null
 * - role='assistant' + cardType=null → cardData=null
 * - role='assistant' + cardType='project'|'client' → cardData is non-empty array
 */
const chatMessageArb: fc.Arbitrary<ChatMessage> = fc
  .constantFrom<'user' | 'assistant'>('user', 'assistant')
  .chain((role) => {
    if (role === 'user') {
      return fc.record({
        id: fc.uuid(),
        role: fc.constant(role as 'user'),
        content: fc.string({ minLength: 1 }),
        cardType: fc.constant(null),
        cardData: fc.constant(null),
        timestamp: fc.nat(),
      });
    }
    // role === 'assistant'
    return fc
      .constantFrom<null | 'project' | 'client'>(null, 'project', 'client')
      .chain((cardType): fc.Arbitrary<ChatMessage> => {
        if (cardType === null) {
          return fc.record({
            id: fc.uuid(),
            role: fc.constant(role as 'assistant'),
            content: fc.string({ minLength: 1 }),
            cardType: fc.constant(null),
            cardData: fc.constant(null),
            timestamp: fc.nat(),
          });
        }
        const dataArb =
          cardType === 'project'
            ? fc.array(projectRecordArb, { minLength: 1, maxLength: 5 })
            : fc.array(clientRecordArb, { minLength: 1, maxLength: 5 });
        return fc.record({
          id: fc.uuid(),
          role: fc.constant(role as 'assistant'),
          content: fc.string({ minLength: 1 }),
          cardType: fc.constant(cardType as 'project' | 'client'),
          cardData: dataArb as fc.Arbitrary<ProjectRecord[] | ClientRecord[] | null>,
          searchKeyword: fc.string({ minLength: 1 }),
          timestamp: fc.nat(),
        });
      });
  });

// Feature: contract-agent-inquiry, Property 11: 消息渲染模式由 role 和 cardType 决定
// **Validates: Requirements 8.2, 8.3, 8.4**
describe('Property 11: 消息渲染模式由 role 和 cardType 决定', () => {
  it('role="user" → data-testid="user-bubble" 存在，外层 justifyContent="flex-end"', () => {
    fc.assert(
      fc.property(
        chatMessageArb.filter((m) => m.role === 'user'),
        (msg) => {
          const { unmount } = render(<MessageBubble message={msg} />);

          expect(screen.getByTestId('user-bubble')).toBeInTheDocument();
          const outer = screen.getByTestId('message-bubble');
          expect(outer.style.justifyContent).toBe('flex-end');

          unmount();
        }
      ),
      { numRuns: 100 }
    );
  });

  it('role="assistant" + cardType=null → data-testid="assistant-bubble" 存在，justifyContent="flex-start"，无 DataCard', () => {
    fc.assert(
      fc.property(
        chatMessageArb.filter((m) => m.role === 'assistant' && m.cardType === null),
        (msg) => {
          const { unmount } = render(<MessageBubble message={msg} />);

          expect(screen.getByTestId('assistant-bubble')).toBeInTheDocument();
          const outer = screen.getByTestId('message-bubble');
          expect(outer.style.justifyContent).toBe('flex-start');
          expect(screen.queryByTestId('data-card')).not.toBeInTheDocument();

          unmount();
        }
      ),
      { numRuns: 100 }
    );
  });

  it('role="assistant" + cardType="project"|"client" → data-testid="assistant-bubble" 存在，justifyContent="flex-start"，DataCard 已渲染', () => {
    fc.assert(
      fc.property(
        chatMessageArb.filter(
          (m) => m.role === 'assistant' && (m.cardType === 'project' || m.cardType === 'client')
        ),
        (msg) => {
          const { unmount } = render(<MessageBubble message={msg} />);

          expect(screen.getByTestId('assistant-bubble')).toBeInTheDocument();
          const outer = screen.getByTestId('message-bubble');
          expect(outer.style.justifyContent).toBe('flex-start');
          expect(screen.getByTestId('data-card')).toBeInTheDocument();

          unmount();
        }
      ),
      { numRuns: 100 }
    );
  }, 30000);
});
