import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import InputBar from '../InputBar';

describe('InputBar', () => {
  it('renders the dropdown label "信息问询"', () => {
    render(<InputBar onSend={vi.fn()} disabled={false} />);
    expect(screen.getByText('信息问询')).toBeInTheDocument();
  });

  it('renders the placeholder text', () => {
    render(<InputBar onSend={vi.fn()} disabled={false} />);
    expect(
      screen.getByPlaceholderText('请输入您的问题')
    ).toBeInTheDocument();
  });

  it('disables send button when input is empty', () => {
    render(<InputBar onSend={vi.fn()} disabled={false} />);
    const btn = screen.getByTestId('send-button');
    expect(btn).toBeDisabled();
  });

  it('enables send button when input has non-whitespace text', async () => {
    const user = userEvent.setup();
    render(<InputBar onSend={vi.fn()} disabled={false} />);
    const input = screen.getByPlaceholderText('请输入您的问题');
    await user.type(input, '查询项目');
    const btn = screen.getByTestId('send-button');
    expect(btn).not.toBeDisabled();
  });

  it('calls onSend with trimmed text and clears input on button click', async () => {
    const user = userEvent.setup();
    const onSend = vi.fn();
    render(<InputBar onSend={onSend} disabled={false} />);
    const input = screen.getByPlaceholderText('请输入您的问题');
    await user.type(input, '  查询项目  ');
    await user.click(screen.getByTestId('send-button'));
    expect(onSend).toHaveBeenCalledWith('查询项目');
    expect(input).toHaveValue('');
  });

  it('calls onSend on Enter key press', async () => {
    const user = userEvent.setup();
    const onSend = vi.fn();
    render(<InputBar onSend={onSend} disabled={false} />);
    const input = screen.getByPlaceholderText('请输入您的问题');
    await user.type(input, '查询客户');
    await user.keyboard('{Enter}');
    expect(onSend).toHaveBeenCalledWith('查询客户');
    expect(input).toHaveValue('');
  });

  it('does not call onSend when input is only whitespace', async () => {
    const user = userEvent.setup();
    const onSend = vi.fn();
    render(<InputBar onSend={onSend} disabled={false} />);
    const input = screen.getByPlaceholderText('请输入您的问题');
    await user.type(input, '   ');
    await user.keyboard('{Enter}');
    expect(onSend).not.toHaveBeenCalled();
  });

  it('disables send button when disabled prop is true', async () => {
    render(<InputBar onSend={vi.fn()} disabled={true} />);
    // Input itself should be disabled too
    const input = screen.getByPlaceholderText('请输入您的问题');
    expect(input).toBeDisabled();
    const btn = screen.getByTestId('send-button');
    expect(btn).toBeDisabled();
  });
});
