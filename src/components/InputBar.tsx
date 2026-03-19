import React, { useState, useRef } from 'react';
import { ArrowUpOutlined } from '@ant-design/icons';

export interface InputBarProps {
  onSend: (text: string) => void;
  disabled: boolean;
}

const InputBar: React.FC<InputBarProps> = ({ onSend, disabled }) => {
  const [text, setText] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const trimmed = text.trim();
  const canSend = trimmed.length > 0 && !disabled;

  const handleSend = () => {
    if (!canSend) return;
    onSend(trimmed);
    setText('');
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setText(e.target.value);
    // Auto-resize
    const el = e.target;
    el.style.height = 'auto';
    el.style.height = Math.min(el.scrollHeight, 120) + 'px';
  };

  return (
    <div className="input-bar-wrapper">
      <div className="input-bar-container">
        <div className="input-bar-top">
          <span className="input-bar-tag">
            信息问询 <span style={{ fontSize: 10 }}>∨</span>
          </span>
          <textarea
            ref={textareaRef}
            className="input-bar-textarea"
            value={text}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            placeholder="请输入您的问题"
            disabled={disabled}
            rows={1}
          />
        </div>
        <div className="input-bar-bottom">
          <button
            className={`input-bar-send-btn${canSend ? ' active' : ''}`}
            disabled={!canSend}
            onClick={handleSend}
            data-testid="send-button"
          >
            <ArrowUpOutlined />
          </button>
        </div>
      </div>
    </div>
  );
};

export default InputBar;
