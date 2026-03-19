import type { ChatMessage } from '@/types/chat';
import { MOCK_PROJECTS, MOCK_CLIENTS } from '@/mocks/data';

/** 生成唯一 ID */
export function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

/** 延迟辅助函数 */
function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * 处理用户消息，基于关键词匹配返回对应的 ChatMessage。
 * - 包含"项目" → 项目卡片
 * - 包含"客户" → 客户卡片
 * - 否则 → 兜底文案
 */
export async function processUserMessage(text: string): Promise<ChatMessage> {
  await delay(800);

  if (text.includes('项目')) {
    return {
      id: generateId(),
      role: 'assistant',
      content: '为您找到与该关键词相关的 2 个项目信息。',
      cardType: 'project',
      cardData: MOCK_PROJECTS,
      searchKeyword: text,
      timestamp: Date.now(),
    };
  }

  if (text.includes('客户')) {
    return {
      id: generateId(),
      role: 'assistant',
      content: '为您匹配到相关的 3 份客户档案记录。',
      cardType: 'client',
      cardData: MOCK_CLIENTS,
      searchKeyword: text,
      timestamp: Date.now(),
    };
  }

  return {
    id: generateId(),
    role: 'assistant',
    content: '抱歉，测试阶段我仅支持通过包含\'项目\'或\'客户\'的关键词进行模拟查询，请重新输入。',
    cardType: null,
    cardData: null,
    searchKeyword: text,
    timestamp: Date.now(),
  };
}
