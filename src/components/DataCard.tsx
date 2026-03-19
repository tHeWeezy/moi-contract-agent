import React, { useMemo } from 'react';
import { Table, Button } from 'antd';
import { EyeOutlined, UnorderedListOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import type { ProjectRecord, ClientRecord } from '@/types/chat';
import {
  navigateToProjectDetail,
  navigateToProjectList,
  navigateToClientDetail,
  navigateToClientList,
} from '@/utils/navigation';

export interface DataCardProps {
  cardType: 'project' | 'client';
  cardData: ProjectRecord[] | ClientRecord[];
  searchKeyword: string;
}

const ROW_HEIGHT = 47;
const MAX_VISIBLE_ROWS = 5;

const PROJECT_COLUMNS: ColumnsType<ProjectRecord> = [
  { title: '所属项目编号', dataIndex: 'projectId', key: 'projectId' },
  { title: '项目名称', dataIndex: 'projectName', key: 'projectName' },
  { title: '当前状态', dataIndex: 'status', key: 'status' },
  { title: '负责人', dataIndex: 'manager', key: 'manager' },
];

const CLIENT_COLUMNS: ColumnsType<ClientRecord> = [
  { title: '客户编号', dataIndex: 'clientId', key: 'clientId' },
  { title: '客户名称', dataIndex: 'clientName', key: 'clientName' },
  { title: '联系人', dataIndex: 'contact', key: 'contact' },
  { title: '客户级别', dataIndex: 'level', key: 'level' },
];

function getNavigationAction(
  cardType: 'project' | 'client',
  cardData: ProjectRecord[] | ClientRecord[],
  searchKeyword: string,
): { label: string; icon: React.ReactNode; action: () => void } | null {
  if (cardData.length === 0) return null;

  if (cardType === 'project') {
    const projectIds = new Set((cardData as ProjectRecord[]).map((r) => r.projectId));
    if (projectIds.size === 1) {
      const id = [...projectIds][0];
      return {
        label: '查看项目详情',
        icon: <EyeOutlined />,
        action: () => navigateToProjectDetail(id),
      };
    }
    return {
      label: '查看完整列表',
      icon: <UnorderedListOutlined />,
      action: () => navigateToProjectList(searchKeyword),
    };
  }

  const clientIds = new Set((cardData as ClientRecord[]).map((r) => r.clientId));
  if (clientIds.size === 1) {
    const id = [...clientIds][0];
    return {
      label: '查看客户档案',
      icon: <EyeOutlined />,
      action: () => navigateToClientDetail(id),
    };
  }
  return {
    label: '查看完整列表',
    icon: <UnorderedListOutlined />,
    action: () => navigateToClientList(searchKeyword),
  };
}

const DataCard: React.FC<DataCardProps> = ({ cardType, cardData, searchKeyword }) => {
  const title = cardType === 'project'
    ? `项目明细（共 ${cardData.length} 份）`
    : `客户明细（共 ${cardData.length} 份）`;

  const nav = useMemo(
    () => getNavigationAction(cardType, cardData, searchKeyword),
    [cardType, cardData, searchKeyword],
  );

  const columns = cardType === 'project' ? PROJECT_COLUMNS : CLIENT_COLUMNS;

  const dataSource = (cardData as unknown as Record<string, unknown>[]).map((item, index) => ({
    ...item,
    key: (item as unknown as Record<string, string>)[cardType === 'project' ? 'projectId' : 'clientId'] ?? index,
  }));

  const scrollY = cardData.length > MAX_VISIBLE_ROWS ? MAX_VISIBLE_ROWS * ROW_HEIGHT : undefined;

  return (
    <div
      data-testid="data-card"
      style={{
        border: '1px solid #e8e8e8',
        borderRadius: 8,
        overflow: 'hidden',
        marginTop: 8,
      }}
    >
      <div
        data-testid="data-card-header"
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '10px 16px',
          background: '#fafafa',
          borderBottom: '1px solid #e8e8e8',
        }}
      >
        <span style={{ fontWeight: 600 }}>{title}</span>
        {nav && (
          <Button type="link" icon={nav.icon} onClick={nav.action} data-testid="nav-button">
            {nav.label}
          </Button>
        )}
      </div>
      <Table
        columns={columns as ColumnsType<Record<string, unknown>>}
        dataSource={dataSource}
        pagination={false}
        size="small"
        scroll={scrollY ? { y: scrollY } : undefined}
      />
    </div>
  );
};

export default DataCard;
export { getNavigationAction };
