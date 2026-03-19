import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import * as fc from 'fast-check';
import { processUserMessage } from '@/services/mockEngine';

describe('Feature: contract-agent-inquiry, Property 10: ChatMessage 结构完整性', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  /** Validates: Requirements 8.1 */
  it('MockEngine 返回的 ChatMessage 应包含所有必需字段且 cardType/cardData 一致', async () => {
    await fc.assert(
      fc.asyncProperty(fc.string(), async (input) => {
        const promise = processUserMessage(input);
        await vi.advanceTimersByTimeAsync(800);
        const msg = await promise;

        // id 为非空字符串
        expect(typeof msg.id).toBe('string');
        expect(msg.id.length).toBeGreaterThan(0);

        // role 为 'assistant'
        expect(msg.role).toBe('assistant');

        // content 为字符串
        expect(typeof msg.content).toBe('string');

        // cardType 为 'project' | 'client' | null
        expect([null, 'project', 'client']).toContain(msg.cardType);

        // timestamp 为正数
        expect(typeof msg.timestamp).toBe('number');
        expect(msg.timestamp).toBeGreaterThan(0);

        // cardType 为 null 时 cardData 也为 null
        if (msg.cardType === null) {
          expect(msg.cardData).toBeNull();
        }

        // cardType 非 null 时 cardData 为非空数组
        if (msg.cardType !== null) {
          expect(Array.isArray(msg.cardData)).toBe(true);
          expect((msg.cardData as unknown[]).length).toBeGreaterThan(0);
        }
      }),
      { numRuns: 100 },
    );
  });
});
