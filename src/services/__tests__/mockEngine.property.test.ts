import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import * as fc from 'fast-check';
import { processUserMessage } from '@/services/mockEngine';
import { MOCK_PROJECTS, MOCK_CLIENTS } from '@/mocks/data';

describe('Feature: contract-agent-inquiry, Property 4: Mock Engine 关键词路由', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  /** Validates: Requirements 3.1 */
  it('包含"项目"的输入 → cardType 为 project 且 cardData 为非空项目数组', async () => {
    await fc.assert(
      fc.asyncProperty(fc.string(), async (randomStr) => {
        const input = randomStr + '项目';
        const promise = processUserMessage(input);
        await vi.advanceTimersByTimeAsync(800);
        const msg = await promise;

        expect(msg.cardType).toBe('project');
        expect(Array.isArray(msg.cardData)).toBe(true);
        expect((msg.cardData as unknown[]).length).toBeGreaterThan(0);
        expect(msg.cardData).toEqual(MOCK_PROJECTS);
      }),
      { numRuns: 100 },
    );
  });

  /** Validates: Requirements 3.2 */
  it('包含"客户"但不含"项目"的输入 → cardType 为 client 且 cardData 为非空客户数组', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.string().filter((s) => !s.includes('项目')),
        async (randomStr) => {
          const input = randomStr + '客户';
          const promise = processUserMessage(input);
          await vi.advanceTimersByTimeAsync(800);
          const msg = await promise;

          expect(msg.cardType).toBe('client');
          expect(Array.isArray(msg.cardData)).toBe(true);
          expect((msg.cardData as unknown[]).length).toBeGreaterThan(0);
          expect(msg.cardData).toEqual(MOCK_CLIENTS);
        },
      ),
      { numRuns: 100 },
    );
  });

  /** Validates: Requirements 3.3 */
  it('既不含"项目"也不含"客户"的输入 → cardType 为 null 且返回兜底文案', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.string().filter((s) => !s.includes('项目') && !s.includes('客户')),
        async (randomStr) => {
          const promise = processUserMessage(randomStr);
          await vi.advanceTimersByTimeAsync(800);
          const msg = await promise;

          expect(msg.cardType).toBeNull();
          expect(msg.cardData).toBeNull();
          expect(msg.content).toBe(
            "抱歉，测试阶段我仅支持通过包含'项目'或'客户'的关键词进行模拟查询，请重新输入。",
          );
        },
      ),
      { numRuns: 100 },
    );
  });
});
