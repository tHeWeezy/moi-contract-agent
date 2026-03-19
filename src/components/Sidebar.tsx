import React from 'react';
import {
  MessageOutlined,
  RobotOutlined,
  FileTextOutlined,
  BarChartOutlined,
  AppstoreOutlined,
  BellOutlined,
  EditOutlined,
} from '@ant-design/icons';

const navItems = [
  { icon: <MessageOutlined />, label: '对话', active: false, isHeader: true },
  { icon: <RobotOutlined />, label: '通用智能体', active: false },
  { icon: <FileTextOutlined />, label: '合同智能体', active: true },
  { icon: <BarChartOutlined />, label: '问数智能体', active: false },
  { divider: true },
  { icon: <AppstoreOutlined />, label: '智能体广场', active: false },
  { icon: <BellOutlined />, label: '消息', active: false },
];

const Sidebar: React.FC = () => {
  return (
    <div className="sidebar">
      <div className="sidebar-logo">
        <div className="sidebar-logo-icon" />
        <span>金盘 AI Portal</span>
      </div>

      <div className="sidebar-nav">
        {navItems.map((item, i) => {
          if ('divider' in item && item.divider) {
            return <div key={i} className="sidebar-divider" />;
          }
          const navItem = item as { icon: React.ReactNode; label: string; active: boolean; isHeader?: boolean };
          return (
            <div
              key={i}
              className={`sidebar-nav-item${navItem.active ? ' active' : ''}`}
              style={navItem.isHeader ? { fontWeight: 500 } : undefined}
            >
              <span className="nav-icon">{navItem.icon}</span>
              <span>{navItem.label}</span>
              {navItem.isHeader && (
                <span style={{ marginLeft: 'auto', fontSize: 12, color: '#bbb' }}><EditOutlined /></span>
              )}
            </div>
          );
        })}
      </div>

      <div className="sidebar-user">
        <div className="sidebar-user-avatar">精</div>
        <span>wscs003</span>
        <span className="sidebar-collapse-btn">«</span>
      </div>
    </div>
  );
};

export default Sidebar;
