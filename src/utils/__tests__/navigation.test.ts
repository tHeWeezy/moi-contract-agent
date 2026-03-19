import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
  navigateToProjectDetail,
  navigateToProjectList,
  navigateToClientDetail,
  navigateToClientList,
} from '@/utils/navigation';

describe('NavigationUtils URL 格式', () => {
  const openSpy = vi.fn();

  beforeEach(() => {
    openSpy.mockReset();
    vi.stubGlobal('open', openSpy);
  });

  // 需求 7.1: 项目详情页跳转
  describe('navigateToProjectDetail', () => {
    it('should generate correct project detail URL', () => {
      navigateToProjectDetail('P-20260316');
      expect(openSpy).toHaveBeenCalledWith(
        './moi_c_ProjectInfo/index.html#/project/P-20260316',
        '_blank'
      );
    });

    it('should open in a new tab with _blank', () => {
      navigateToProjectDetail('P-123');
      expect(openSpy).toHaveBeenCalledTimes(1);
      expect(openSpy.mock.calls[0][1]).toBe('_blank');
    });
  });

  // 需求 7.2: 项目列表页跳转
  describe('navigateToProjectList', () => {
    it('should generate correct project list URL without keyword', () => {
      navigateToProjectList();
      expect(openSpy).toHaveBeenCalledWith(
        './moi_c_ProjectInfo/index.html#/',
        '_blank'
      );
    });

    it('should append keyword query parameter when provided', () => {
      navigateToProjectList('数据库');
      expect(openSpy).toHaveBeenCalledWith(
        `./moi_c_ProjectInfo/index.html#/?keyword=${encodeURIComponent('数据库')}`,
        '_blank'
      );
    });
  });

  // 需求 7.3: 客户详情页跳转
  describe('navigateToClientDetail', () => {
    it('should generate correct client detail URL', () => {
      navigateToClientDetail('C-884821');
      expect(openSpy).toHaveBeenCalledWith(
        './moi_c_ClientInfo/index.html?id=C-884821',
        '_blank'
      );
    });
  });

  // 需求 7.4: 客户列表页跳转
  describe('navigateToClientList', () => {
    it('should generate correct client list URL without keyword', () => {
      navigateToClientList();
      expect(openSpy).toHaveBeenCalledWith(
        './moi_c_ClientInfo/list.html',
        '_blank'
      );
    });

    it('should append keyword query parameter when provided', () => {
      navigateToClientList('广联达');
      expect(openSpy).toHaveBeenCalledWith(
        `./moi_c_ClientInfo/list.html?keyword=${encodeURIComponent('广联达')}`,
        '_blank'
      );
    });
  });

  // 需求 7.5: 所有跳转通过 window.open 在新页签打开
  describe('window.open 调用验证', () => {
    it('all navigation functions should call window.open exactly once', () => {
      navigateToProjectDetail('P-1');
      expect(openSpy).toHaveBeenCalledTimes(1);
      openSpy.mockReset();

      navigateToProjectList();
      expect(openSpy).toHaveBeenCalledTimes(1);
      openSpy.mockReset();

      navigateToClientDetail('C-1');
      expect(openSpy).toHaveBeenCalledTimes(1);
      openSpy.mockReset();

      navigateToClientList();
      expect(openSpy).toHaveBeenCalledTimes(1);
    });
  });
});
