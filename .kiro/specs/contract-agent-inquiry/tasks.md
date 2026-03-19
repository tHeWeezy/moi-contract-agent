# 实施计划：合同智能体 - 信息问询功能

## 概述

基于 React 18 + TypeScript + Vite 6 + Ant Design 6 技术栈，在 `moi_c_all` 工作区从零搭建独立 SPA 项目，实现聊天式对话界面。采用增量构建方式：先搭建项目骨架和类型定义，再逐步实现各组件，最后集成联调。测试框架使用 Vitest + React Testing Library + fast-check。

## 任务

- [x] 1. 搭建项目骨架与基础配置
  - [x] 1.1 初始化 Vite + React + TypeScript 项目
    - 在 `moi_c_all` 目录下创建 Vite 项目配置（`vite.config.ts`，`base: './'`）
    - 配置 `tsconfig.json`，设置 `@` 路径别名指向 `src/`
    - 创建 `package.json`，添加 React 18、Ant Design 6、TypeScript 依赖
    - 创建 `src/main.tsx` 入口文件和 `index.html`
    - 创建 `src/App.tsx` 根组件骨架
    - 创建 `src/index.css` 全局样式文件
    - _需求：1.1_

  - [x] 1.2 配置测试框架
    - 安装并配置 Vitest、React Testing Library、fast-check、jsdom
    - 创建 `vitest.config.ts` 或在 `vite.config.ts` 中添加测试配置
    - 创建测试 setup 文件（`src/test/setup.ts`）
    - _需求：全局_

- [x] 2. 定义类型系统与 Mock 数据
  - [x] 2.1 创建类型定义文件 `src/types/chat.ts`
    - 定义 `MessageRole`、`CardType`、`ChatMessage`、`ProjectRecord`、`ClientRecord` 接口
    - _需求：8.1_

  - [x] 2.2 创建 Mock 数据文件 `src/mocks/data.ts`
    - 编写 `MOCK_PROJECTS`（至少 2 条记录）和 `MOCK_CLIENTS`（至少 3 条记录）
    - 数据字段值符合 PRD 示例格式（编号 P-20260316、C-884821 等）
    - _需求：4.4, 5.4_

  - [x] 2.3 编写属性测试：ChatMessage 结构完整性
    - **属性 10：ChatMessage 结构完整性**
    - 使用 fast-check 生成随机输入文本，验证 MockEngine 返回的 ChatMessage 字段完整性
    - cardType 为 null 时 cardData 也为 null；cardType 非 null 时 cardData 为非空数组
    - **验证需求：8.1**

- [x] 3. 实现 Mock Engine 与跳转工具
  - [x] 3.1 实现 MockEngine `src/services/mockEngine.ts`
    - 实现 `processUserMessage(text: string): Promise<ChatMessage>` 函数
    - 关键词匹配逻辑：包含"项目" → 项目卡片；包含"客户" → 客户卡片；否则 → 兜底文案
    - 800ms 延迟模拟网络请求
    - 实现 `generateId()` 辅助函数
    - _需求：3.1, 3.2, 3.3_

  - [x] 3.2 编写属性测试：Mock Engine 关键词路由
    - **属性 4：Mock Engine 关键词路由**
    - 使用 fast-check 生成随机字符串（含/不含"项目"/"客户"），验证返回的 cardType 和 cardData
    - **验证需求：3.1, 3.2, 3.3**

  - [x] 3.3 实现跳转工具 `src/utils/navigation.ts`
    - 实现 `navigateToProjectDetail(projectId)`、`navigateToProjectList(keyword?)`
    - 实现 `navigateToClientDetail(clientId)`、`navigateToClientList(keyword?)`
    - 所有跳转通过 `window.open(url, '_blank')` 在新页签打开
    - URL 使用 `../` 相对路径（与 moi_c_ProjectInfo、moi_c_ClientInfo 同级）
    - _需求：7.1, 7.2, 7.3, 7.4, 7.5_

  - [x] 3.4 编写单元测试：NavigationUtils URL 格式
    - 验证各跳转函数生成的 URL 格式正确
    - 验证 `window.open` 被正确调用
    - _需求：7.1, 7.2, 7.3, 7.4, 7.5_

- [x] 4. 检查点 - 确保基础层测试通过
  - 确保所有测试通过，如有问题请向用户确认。

- [x] 5. 实现 InputBar 输入组件
  - [x] 5.1 创建 InputBar 组件 `src/components/InputBar.tsx`
    - 实现 `InputBarProps` 接口（`onSend`、`disabled`）
    - 展示"信息问询 ∨"下拉标签和占位符文本
    - 支持 Enter 键和发送按钮触发 `onSend`
    - 输入为空时禁用发送按钮
    - 发送后清空输入框
    - _需求：2.1, 2.2, 2.3, 2.4, 2.5_

  - [x] 5.2 编写属性测试：空输入禁止发送
    - **属性 3：空输入禁止发送**
    - 使用 fast-check 生成随机空白字符串，验证发送按钮禁用且不添加消息
    - **验证需求：2.5**

  - [x] 5.3 编写属性测试：发送消息后追加并清空
    - **属性 2：发送消息后追加并清空**
    - 使用 fast-check 生成随机非空字符串，验证消息追加和输入框清空
    - **验证需求：2.3, 2.4**

- [x] 6. 实现 DataCard 数据卡片组件
  - [x] 6.1 创建 DataCard 组件 `src/components/DataCard.tsx`
    - 实现 `DataCardProps` 接口（`cardType`、`cardData`、`searchKeyword`）
    - 渲染卡片头部（标题 + 数量 + 跳转按钮）
    - 使用 Ant Design Table 渲染表格主体（纯展示无操作列）
    - 表格最大 5 行可见，超出启用垂直滚动
    - 实现动态跳转逻辑（单实体 → 详情页，多实体 → 列表页）
    - cardData 为空数组时不渲染跳转按钮
    - _需求：4.1, 4.2, 4.3, 5.1, 5.2, 5.3, 6.1, 6.2, 6.3, 7.1, 7.2, 7.3, 7.4_

  - [x] 6.2 编写属性测试：DataCard 标题数量一致性
    - **属性 5：DataCard 标题数量一致性**
    - 使用 fast-check 生成随机长度的记录数组，验证标题中的数量 N 等于 cardData 长度
    - **验证需求：4.1, 5.1**

  - [x] 6.3 编写属性测试：项目表格列完整性
    - **属性 6：项目表格列完整性**
    - 使用 fast-check 生成随机 ProjectRecord 数组，验证表格包含且仅包含四列
    - **验证需求：4.3**

  - [x] 6.4 编写属性测试：客户表格列完整性
    - **属性 7：客户表格列完整性**
    - 使用 fast-check 生成随机 ClientRecord 数组，验证表格包含且仅包含四列
    - **验证需求：5.3**

  - [x] 6.5 编写属性测试：单实体指向详情页
    - **属性 8：动态跳转 — 单实体指向详情页**
    - 使用 fast-check 生成相同 ID 的记录数组，验证按钮文案和跳转 URL
    - **验证需求：7.1, 7.3**

  - [x] 6.6 编写属性测试：多实体指向列表页
    - **属性 9：动态跳转 — 多实体指向列表页**
    - 使用 fast-check 生成不同 ID 的记录数组，验证按钮文案和跳转 URL
    - **验证需求：7.2, 7.4**

- [x] 7. 检查点 - 确保核心组件测试通过
  - 确保所有测试通过，如有问题请向用户确认。

- [x] 8. 实现消息展示组件
  - [x] 8.1 创建 LoadingIndicator 组件 `src/components/LoadingIndicator.tsx`
    - 实现加载动画（如三个跳动的小圆点或"正在查询中..."）
    - _需求：3.4_

  - [x] 8.2 创建 MessageBubble 组件 `src/components/MessageBubble.tsx`
    - 实现 `MessageBubbleProps` 接口
    - 根据 `role` 决定左/右对齐
    - 根据 `cardType` 决定渲染纯文本或 DataCard
    - _需求：8.2, 8.3, 8.4_

  - [x] 8.3 编写属性测试：消息渲染模式由 role 和 cardType 决定
    - **属性 11：消息渲染模式由 role 和 cardType 决定**
    - 使用 fast-check 生成随机 ChatMessage（不同 role/cardType 组合），验证渲染结果
    - **验证需求：8.2, 8.3, 8.4**

  - [x] 8.4 创建 MessageStream 组件 `src/components/MessageStream.tsx`
    - 实现 `MessageStreamProps` 接口
    - 遍历 messages 渲染 MessageBubble
    - 新消息时自动滚动到底部
    - loading 时在底部展示 LoadingIndicator
    - _需求：1.3, 1.4, 3.4_

  - [x] 8.5 编写属性测试：消息时间排序不变量
    - **属性 1：消息时间排序不变量**
    - 使用 fast-check 生成随机 ChatMessage 数组，验证渲染顺序与 timestamp 升序一致
    - **验证需求：1.3**

- [x] 9. 实现 ChatPanel 对话面板并集成
  - [x] 9.1 创建 ChatPanel 组件 `src/components/ChatPanel.tsx`
    - 管理 `messages: ChatMessage[]` 和 `isLoading: boolean` 状态
    - 接收 InputBar 用户输入，创建 user 消息并追加到 messages
    - 调用 MockEngine 获取 assistant 响应并追加
    - loading 期间禁用 InputBar 并展示加载动画
    - 空状态时展示欢迎提示信息
    - _需求：1.1, 1.2, 1.3, 1.4, 2.3, 2.4, 3.1, 3.2, 3.3, 3.4_

  - [x] 9.2 集成 App 根组件
    - 在 `App.tsx` 中引入 ChatPanel，完成整体布局
    - 应用全局样式
    - _需求：1.1_

  - [x] 9.3 编写单元测试：ChatPanel 集成测试
    - 测试空状态欢迎信息展示
    - 测试发送消息后用户气泡出现
    - 测试 Loading 动画在延迟期间展示
    - 测试 assistant 响应后卡片正确渲染
    - _需求：1.2, 3.4, 8.2, 8.3, 8.4_

- [x] 10. 最终检查点 - 确保所有测试通过
  - 确保所有测试通过，如有问题请向用户确认。

## 备注

- 标记 `*` 的任务为可选任务，可跳过以加速 MVP 交付
- 每个任务均引用了对应的需求编号，确保需求可追溯
- 检查点任务用于增量验证，确保每个阶段的代码质量
- 属性测试验证通用正确性属性，单元测试验证具体示例和边界条件
- 所有 11 个正确性属性均已覆盖为属性测试子任务
