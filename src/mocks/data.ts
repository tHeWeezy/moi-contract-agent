import { ProjectRecord, ClientRecord } from '@/types/chat';

export const MOCK_PROJECTS: ProjectRecord[] = [
  { projectId: 'P-20260316', projectName: '数据库二期扩容项目', status: '执行中', manager: '张三' },
  { projectId: 'P-20260401', projectName: '智能运维平台建设', status: '规划中', manager: '李四' },
];

export const MOCK_CLIENTS: ClientRecord[] = [
  { clientId: 'C-884821', clientName: '广联达科技股份有限公司', contact: '李总', level: '核心 VIP' },
  { clientId: 'C-773512', clientName: '郑州地铁集团有限公司', contact: '王经理', level: '战略客户' },
  { clientId: 'C-661203', clientName: '北京数码视讯科技股份有限公司', contact: '赵总', level: '普通客户' },
];
