import React from 'react';
import {
  RobotOutlined,
  CopyOutlined,
  SnippetsOutlined,
  SearchOutlined,
  PlusOutlined,
  CalendarOutlined,
  ThunderboltOutlined,
} from '@ant-design/icons';

const MiddlePanel: React.FC = () => {
  return (
    <div className="middle-panel">
      {/* Header */}
      <div className="middle-header">
        <div className="middle-header-avatar">
          <RobotOutlined style={{ color: '#fff', fontSize: 16 }} />
        </div>
        <div className="middle-header-info">
          <div className="middle-header-title">合同智能体</div>
          <div className="middle-header-desc">审查并修订变更后的合同</div>
        </div>
        <div className="middle-header-actions">
          <CopyOutlined />
          <SnippetsOutlined />
        </div>
      </div>

      {/* New Chat Button */}
      <button className="middle-new-chat-btn">
        <PlusOutlined /> 创建新对话
      </button>

      {/* Search */}
      <div className="middle-search">
        <span className="middle-search-icon"><SearchOutlined /></span>
        <input type="text" placeholder="搜索" />
      </div>

      {/* Conversation List */}
      <div className="middle-conversations">
        <div className="middle-date-label">3月16日 周一</div>
        <div className="middle-conv-item active">新对话</div>

        <div className="middle-date-label">1月12日 周一</div>
        <div className="middle-conv-item">321-信息提取</div>
        <div className="middle-conv-item">123-合同审查</div>
      </div>

      {/* Bottom Tabs */}
      <div className="middle-bottom-tabs">
        <div className="middle-bottom-tab"><CalendarOutlined /> 日志记录</div>
        <div className="middle-bottom-tab"><ThunderboltOutlined /> 智能跟催</div>
      </div>
    </div>
  );
};

export default MiddlePanel;
