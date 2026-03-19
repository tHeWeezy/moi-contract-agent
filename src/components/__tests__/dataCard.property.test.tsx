import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, beforeAll, vi, afterEach } from 'vitest';
import * as fc from 'fast-check';
import DataCard from '@/components/DataCard';

beforeAll(() => {
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: (query: string) => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: () => {},
      removeListener: () => {},
      addEventListener: () => {},
      removeEventListener: () => {},
      dispatchEvent: () => false,
    }),
  });
});

const projectRecordArb = fc.record({
  projectId: fc.string({ minLength: 1 }),
  projectName: fc.string({ minLength: 1 }),
  status: fc.string({ minLength: 1 }),
  manager: fc.string({ minLength: 1 }),
});

const clientRecordArb = fc.record({
  clientId: fc.string({ minLength: 1 }),
  clientName: fc.string({ minLength: 1 }),
  contact: fc.string({ minLength: 1 }),
  level: fc.string({ minLength: 1 }),
});

// Feature: contract-agent-inquiry, Property 5: DataCard 标题数量一致性
// **Validates: Requirements 4.1, 5.1**
describe('Property 5: DataCard 标题数量一致性', () => {
  it('项目卡片标题中的数量 N 应等于 cardData.length', () => {
    fc.assert(
      fc.property(
        fc.array(projectRecordArb, { minLength: 0, maxLength: 10 }),
        (records) => {
          const { unmount } = render(
            <DataCard cardType="project" cardData={records} searchKeyword="项目" />
          );

          const header = screen.getByTestId('data-card-header');
          const match = header.textContent?.match(/共\s*(\d+)\s*份/);
          expect(match).not.toBeNull();
          const n = Number(match![1]);
          expect(n).toBe(records.length);

          unmount();
        }
      ),
      { numRuns: 100 }
    );
  }, 30000);

  it('客户卡片标题中的数量 N 应等于 cardData.length', () => {
    fc.assert(
      fc.property(
        fc.array(clientRecordArb, { minLength: 0, maxLength: 10 }),
        (records) => {
          const { unmount } = render(
            <DataCard cardType="client" cardData={records} searchKeyword="客户" />
          );

          const header = screen.getByTestId('data-card-header');
          const match = header.textContent?.match(/共\s*(\d+)\s*份/);
          expect(match).not.toBeNull();
          const n = Number(match![1]);
          expect(n).toBe(records.length);

          unmount();
        }
      ),
      { numRuns: 100 }
    );
  }, 30000);
});

// Feature: contract-agent-inquiry, Property 6: 项目表格列完整性
// **Validates: Requirements 4.3**
describe('Property 6: 项目表格列完整性', () => {
  const EXPECTED_PROJECT_COLUMNS = ['所属项目编号', '项目名称', '当前状态', '负责人'];

  it('项目表格应包含且仅包含四列：所属项目编号、项目名称、当前状态、负责人', () => {
    fc.assert(
      fc.property(
        fc.array(projectRecordArb, { minLength: 1, maxLength: 5 }),
        (records) => {
          const { unmount } = render(
            <DataCard cardType="project" cardData={records} searchKeyword="项目" />
          );

          const columnHeaders = screen.getAllByRole('columnheader');
          const headerTexts = columnHeaders.map((th) => th.textContent?.trim() ?? '');

          // Verify exactly 4 columns
          expect(headerTexts).toHaveLength(4);

          // Verify column names match expected
          expect(headerTexts).toEqual(EXPECTED_PROJECT_COLUMNS);

          // Verify no action/操作 column exists
          expect(headerTexts).not.toContain('操作');

          unmount();
        }
      ),
      { numRuns: 100 }
    );
  }, 30000);
});

// Feature: contract-agent-inquiry, Property 7: 客户表格列完整性
// **Validates: Requirements 5.3**
describe('Property 7: 客户表格列完整性', () => {
  const EXPECTED_CLIENT_COLUMNS = ['客户编号', '客户名称', '联系人', '客户级别'];

  it('客户表格应包含且仅包含四列：客户编号、客户名称、联系人、客户级别', () => {
    fc.assert(
      fc.property(
        fc.array(clientRecordArb, { minLength: 1, maxLength: 5 }),
        (records) => {
          const { unmount } = render(
            <DataCard cardType="client" cardData={records} searchKeyword="客户" />
          );

          const columnHeaders = screen.getAllByRole('columnheader');
          const headerTexts = columnHeaders.map((th) => th.textContent?.trim() ?? '');

          // Verify exactly 4 columns
          expect(headerTexts).toHaveLength(4);

          // Verify column names match expected
          expect(headerTexts).toEqual(EXPECTED_CLIENT_COLUMNS);

          // Verify no action/操作 column exists
          expect(headerTexts).not.toContain('操作');

          unmount();
        }
      ),
      { numRuns: 100 }
    );
  }, 30000);
});

// Feature: contract-agent-inquiry, Property 8: 动态跳转 — 单实体指向详情页
// **Validates: Requirements 7.1, 7.3**
describe('Property 8: 动态跳转 — 单实体指向详情页', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('项目卡片：所有记录同一 projectId 时，按钮文案为"查看项目详情"，跳转 URL 包含该 projectId', () => {
    fc.assert(
      fc.property(
        fc.string({ minLength: 1 }).chain((projectId) =>
          fc.tuple(
            fc.constant(projectId),
            fc.array(
              fc.record({
                projectId: fc.constant(projectId),
                projectName: fc.string({ minLength: 1 }),
                status: fc.string({ minLength: 1 }),
                manager: fc.string({ minLength: 1 }),
              }),
              { minLength: 1, maxLength: 3 }
            )
          )
        ),
        ([projectId, records]) => {
          const openMock = vi.fn();
          vi.stubGlobal('open', openMock);

          const { unmount } = render(
            <DataCard cardType="project" cardData={records} searchKeyword="项目" />
          );

          const navButton = screen.getByTestId('nav-button');
          expect(navButton.textContent).toContain('查看项目详情');

          fireEvent.click(navButton);

          expect(openMock).toHaveBeenCalledTimes(1);
          const calledUrl = openMock.mock.calls[0][0] as string;
          expect(calledUrl).toContain(projectId);
          expect(calledUrl).toContain('moi_c_ProjectInfo');

          unmount();
          vi.unstubAllGlobals();
        }
      ),
      { numRuns: 100 }
    );
  }, 30000);

  it('客户卡片：所有记录同一 clientId 时，按钮文案为"查看客户档案"，跳转 URL 包含该 clientId', () => {
    fc.assert(
      fc.property(
        fc.string({ minLength: 1 }).chain((clientId) =>
          fc.tuple(
            fc.constant(clientId),
            fc.array(
              fc.record({
                clientId: fc.constant(clientId),
                clientName: fc.string({ minLength: 1 }),
                contact: fc.string({ minLength: 1 }),
                level: fc.string({ minLength: 1 }),
              }),
              { minLength: 1, maxLength: 3 }
            )
          )
        ),
        ([clientId, records]) => {
          const openMock = vi.fn();
          vi.stubGlobal('open', openMock);

          const { unmount } = render(
            <DataCard cardType="client" cardData={records} searchKeyword="客户" />
          );

          const navButton = screen.getByTestId('nav-button');
          expect(navButton.textContent).toContain('查看客户档案');

          fireEvent.click(navButton);

          expect(openMock).toHaveBeenCalledTimes(1);
          const calledUrl = openMock.mock.calls[0][0] as string;
          expect(calledUrl).toContain(clientId);
          expect(calledUrl).toContain('moi_c_ClientInfo');

          unmount();
          vi.unstubAllGlobals();
        }
      ),
      { numRuns: 100 }
    );
  }, 30000);
});

// Feature: contract-agent-inquiry, Property 9: 动态跳转 — 多实体指向列表页
// **Validates: Requirements 7.2, 7.4**
describe('Property 9: 动态跳转 — 多实体指向列表页', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('项目卡片：记录包含多个不同 projectId 时，按钮文案为"查看完整列表"，跳转 URL 指向项目列表页', () => {
    fc.assert(
      fc.property(
        fc.tuple(
          fc.string({ minLength: 1 }),
          fc.string({ minLength: 1 })
        ).filter(([a, b]) => a !== b),
        ([idA, idB]) => {
          const records = [
            { projectId: idA, projectName: 'P1', status: 'active', manager: 'M1' },
            { projectId: idB, projectName: 'P2', status: 'done', manager: 'M2' },
          ];

          const openMock = vi.fn();
          vi.stubGlobal('open', openMock);

          const { unmount } = render(
            <DataCard cardType="project" cardData={records} searchKeyword="项目" />
          );

          const navButton = screen.getByTestId('nav-button');
          expect(navButton.textContent).toContain('查看完整列表');

          fireEvent.click(navButton);

          expect(openMock).toHaveBeenCalledTimes(1);
          const calledUrl = openMock.mock.calls[0][0] as string;
          expect(calledUrl).toContain('moi_c_ProjectInfo');

          unmount();
          vi.unstubAllGlobals();
        }
      ),
      { numRuns: 100 }
    );
  }, 30000);

  it('客户卡片：记录包含多个不同 clientId 时，按钮文案为"查看完整列表"，跳转 URL 指向客户列表页', () => {
    fc.assert(
      fc.property(
        fc.tuple(
          fc.string({ minLength: 1 }),
          fc.string({ minLength: 1 })
        ).filter(([a, b]) => a !== b),
        ([idA, idB]) => {
          const records = [
            { clientId: idA, clientName: 'C1', contact: 'X1', level: 'VIP' },
            { clientId: idB, clientName: 'C2', contact: 'X2', level: 'Normal' },
          ];

          const openMock = vi.fn();
          vi.stubGlobal('open', openMock);

          const { unmount } = render(
            <DataCard cardType="client" cardData={records} searchKeyword="客户" />
          );

          const navButton = screen.getByTestId('nav-button');
          expect(navButton.textContent).toContain('查看完整列表');

          fireEvent.click(navButton);

          expect(openMock).toHaveBeenCalledTimes(1);
          const calledUrl = openMock.mock.calls[0][0] as string;
          expect(calledUrl).toContain('moi_c_ClientInfo/list.html');

          unmount();
          vi.unstubAllGlobals();
        }
      ),
      { numRuns: 100 }
    );
  }, 30000);
});
