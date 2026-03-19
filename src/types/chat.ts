/** 消息角色 */
export type MessageRole = 'user' | 'assistant';

/** 卡片类型 */
export type CardType = 'project' | 'client' | null;

/** 项目记录 */
export interface ProjectRecord {
  projectId: string;
  projectName: string;
  status: string;
  manager: string;
}

/** 客户记录 */
export interface ClientRecord {
  clientId: string;
  clientName: string;
  contact: string;
  level: string;
}

/** 聊天消息对象 */
export interface ChatMessage {
  id: string;
  role: MessageRole;
  content: string;
  cardType: CardType;
  cardData: ProjectRecord[] | ClientRecord[] | null;
  searchKeyword?: string;
  timestamp: number;
}
