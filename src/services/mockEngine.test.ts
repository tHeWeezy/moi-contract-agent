import { describe, it, expect } from 'vitest';
import { processUserMessage, generateId } from './mockEngine';
import { MOCK_PROJECTS, MOCK_CLIENTS } from '@/mocks/data';

describe('generateId', () => {
  it('should return a non-empty string', () => {
    const id = generateId();
    expect(id).toBeTruthy();
    expect(typeof id).toBe('string');
  });

  it('should return unique ids', () => {
    const ids = new Set(Array.from({ length: 20 }, () => generateId()));
    expect(ids.size).toBe(20);
  });
});

describe('processUserMessage', () => {
  it('should return project card when text contains "项目"', async () => {
    const result = await processUserMessage('查一下最近的项目');
    expect(result.role).toBe('assistant');
    expect(result.cardType).toBe('project');
    expect(result.cardData).toEqual(MOCK_PROJECTS);
    expect(result.content).toBe('为您找到与该关键词相关的 2 个项目信息。');
    expect(result.searchKeyword).toBe('查一下最近的项目');
    expect(result.id).toBeTruthy();
    expect(result.timestamp).toBeGreaterThan(0);
  });

  it('should return client card when text contains "客户"', async () => {
    const result = await processUserMessage('查询客户信息');
    expect(result.role).toBe('assistant');
    expect(result.cardType).toBe('client');
    expect(result.cardData).toEqual(MOCK_CLIENTS);
    expect(result.content).toBe('为您匹配到相关的 3 份客户档案记录。');
    expect(result.searchKeyword).toBe('查询客户信息');
  });

  it('should return fallback when text contains neither keyword', async () => {
    const result = await processUserMessage('你好');
    expect(result.role).toBe('assistant');
    expect(result.cardType).toBeNull();
    expect(result.cardData).toBeNull();
    expect(result.content).toBe(
      "抱歉，测试阶段我仅支持通过包含'项目'或'客户'的关键词进行模拟查询，请重新输入。"
    );
    expect(result.searchKeyword).toBe('你好');
  });

  it('should prioritize "项目" when both keywords present', async () => {
    const result = await processUserMessage('项目和客户');
    expect(result.cardType).toBe('project');
  });
});
