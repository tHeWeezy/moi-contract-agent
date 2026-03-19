import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import * as fc from 'fast-check';
import InputBar from '@/components/InputBar';

// Feature: contract-agent-inquiry, Property 3: 空输入禁止发送
// **Validates: Requirements 2.5**
describe('Property 3: 空输入禁止发送', () => {
  it('对于任意空白字符串，发送按钮应禁用且 onSend 不被调用', () => {
    const whitespaceArb = fc.oneof(
      fc.constant(''),
      fc
        .array(fc.constantFrom(' ', '\t', '\n', '\r'), { minLength: 1, maxLength: 20 })
        .map((chars) => chars.join(''))
    );

    fc.assert(
      fc.property(whitespaceArb, (whitespaceStr) => {
        const onSend = vi.fn();

        const { unmount } = render(<InputBar onSend={onSend} disabled={false} />);

        const input = screen.getByPlaceholderText(
          '请输入您的问题'
        );

        // Set the whitespace string into the input via fireEvent
        if (whitespaceStr.length > 0) {
          fireEvent.change(input, { target: { value: whitespaceStr } });
        }

        // Verify send button is disabled
        const sendButton = screen.getByTestId('send-button');
        expect(sendButton).toBeDisabled();

        // Try clicking the send button and verify onSend was NOT called
        fireEvent.click(sendButton);
        expect(onSend).not.toHaveBeenCalled();

        unmount();
      }),
      { numRuns: 100 }
    );
  });
});

// Feature: contract-agent-inquiry, Property 2: 发送消息后追加并清空
// **Validates: Requirements 2.3, 2.4**
describe('Property 2: 发送消息后追加并清空', () => {
  it('对于任意非空非纯空白字符串，发送后 onSend 应被调用且输入框应清空', () => {
    fc.assert(
      fc.property(
        fc.string({ minLength: 1 }).filter((s) => s.trim().length > 0),
        (text) => {
          const onSend = vi.fn();

          const { unmount } = render(<InputBar onSend={onSend} disabled={false} />);

          const input = screen.getByPlaceholderText(
            '请输入您的问题'
          );

          // Set the random string into the input
          fireEvent.change(input, { target: { value: text } });

          // Click the send button
          const sendButton = screen.getByTestId('send-button');
          fireEvent.click(sendButton);

          // Verify onSend was called with the trimmed text
          expect(onSend).toHaveBeenCalledTimes(1);
          expect(onSend).toHaveBeenCalledWith(text.trim());

          // Verify the input value is now empty
          expect(input).toHaveValue('');

          unmount();
        }
      ),
      { numRuns: 100 }
    );
  });
});
