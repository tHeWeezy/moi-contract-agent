# 需求文档

## 简介

本功能为"合同智能体"系统新增"信息问询"对话模块。用户可通过自然语言输入查询项目或客户信息，系统基于关键词匹配返回结构化数据卡片，并支持跳转至已有的详情页面（moi_c_ProjectInfo / moi_c_ClientInfo）。当前阶段采用前端 Mock 数据驱动，不依赖后端 AI 模型。

## 术语表

- **Chat_Panel**：信息问询对话面板，包含消息展示区和底部输入区的完整聊天界面组件
- **Input_Bar**：底部输入组件，包含模式下拉标签、文本输入框和发送按钮
- **Message_Stream**：聊天消息流，由多条 ChatMessage 对象按时间顺序组成的列表
- **ChatMessage**：聊天流对象，标准数据结构，包含 id、role、content、cardType、cardData 字段
- **Data_Card**：整合数据明细卡片，由卡片头部、表格主体和可选底部组成的结构化展示组件
- **Mock_Engine**：前端 Mock 识别引擎，基于关键词匹配用户输入并返回预设假数据的逻辑模块
- **moi_c_ProjectInfo**：已开发完成的项目详情外部页面
- **moi_c_ClientInfo**：已开发完成的客户详情外部页面

## 需求

### 需求 1：对话面板 UI 布局

**用户故事：** 作为用户，我希望看到一个标准的聊天室界面，以便通过自然语言进行信息查询。

#### 验收标准

1. THE Chat_Panel SHALL 采用左右分栏布局，右侧为主干对话区，底部为输入区
2. THE Chat_Panel SHALL 在对话区顶部或空状态时展示欢迎提示信息
3. THE Message_Stream SHALL 以时间顺序从上到下排列所有聊天消息，新消息以上推形式进入聊天流
4. WHEN 新消息被添加到 Message_Stream 时，THE Chat_Panel SHALL 自动滚动至最新消息位置

### 需求 2：底部输入组件

**用户故事：** 作为用户，我希望通过输入框输入查询内容并发送，以便获取所需信息。

#### 验收标准

1. THE Input_Bar SHALL 在输入框左侧固定展示"信息问询 ∨"下拉标签
2. THE Input_Bar SHALL 在文本输入框中展示占位符提示语："请输入您的查询条件，例如：查询某项目的进度"
3. WHEN 用户点击"发送"按钮时，THE Input_Bar SHALL 将输入框中的文本作为用户消息发送至 Message_Stream 并清空输入框
4. WHEN 用户按下键盘 Enter 键时，THE Input_Bar SHALL 将输入框中的文本作为用户消息发送至 Message_Stream 并清空输入框
5. WHILE 输入框内容为空时，THE Input_Bar SHALL 禁用发送按钮，阻止发送空消息

### 需求 3：Mock 关键词识别与响应

**用户故事：** 作为用户，我希望输入包含"项目"或"客户"关键词的查询后，系统能返回对应的模拟数据，以便验证完整的查询闭环。

#### 验收标准

1. WHEN 用户发送的文本中包含关键词"项目"时，THE Mock_Engine SHALL 在延迟 800ms 后回复结论文本"为您找到与该关键词相关的 2 个项目信息。"并下发项目信息卡片数据
2. WHEN 用户发送的文本中包含关键词"客户"时，THE Mock_Engine SHALL 在延迟 800ms 后回复结论文本并下发客户信息卡片数据
3. WHEN 用户发送的文本中既不包含"项目"也不包含"客户"时，THE Mock_Engine SHALL 回复兜底文案："抱歉，测试阶段我仅支持通过包含'项目'或'客户'的关键词进行模拟查询，请重新输入。"
4. WHILE Mock_Engine 正在处理用户消息（800ms 延迟期间）时，THE Chat_Panel SHALL 展示 Loading 动画（如"正在查询中..."或三个跳动的小圆点）

### 需求 4：项目信息卡片渲染

**用户故事：** 作为用户，我希望查询项目信息后看到结构化的项目数据卡片，以便快速浏览项目概况。

#### 验收标准

1. THE Data_Card SHALL 在卡片头部左侧展示标题及总数，格式为"项目明细（共 N 份）"，其中 N 为返回的项目数据条数
2. THE Data_Card SHALL 在卡片头部右侧展示全局跳转按钮
3. THE Data_Card SHALL 在卡片主体中以纯展示型表格渲染项目数据，表头包含：所属项目编号、项目名称、当前状态、负责人，表格无操作列
4. THE Data_Card SHALL 提供 Mock 项目假数据，至少包含 2 条记录，字段值符合 PRD 示例格式（如编号 P-20260316、状态"执行中"等）

### 需求 5：客户信息卡片渲染

**用户故事：** 作为用户，我希望查询客户信息后看到结构化的客户数据卡片，以便快速浏览客户档案。

#### 验收标准

1. THE Data_Card SHALL 在卡片头部左侧展示标题及总数，格式为"客户明细（共 N 份）"，其中 N 为返回的客户数据条数
2. THE Data_Card SHALL 在卡片头部右侧展示全局跳转按钮
3. THE Data_Card SHALL 在卡片主体中以纯展示型表格渲染客户数据，表头包含：客户编号、客户名称、联系人、客户级别，表格无操作列
4. THE Data_Card SHALL 提供 Mock 客户假数据，至少包含 3 条记录，字段值符合 PRD 示例格式（如编号 C-884821、级别"核心 VIP"等）

### 需求 6：表格视觉边界与滚动

**用户故事：** 作为用户，我希望数据卡片中的表格在数据较多时不会无限拉长，以便保持聊天界面的可读性。

#### 验收标准

1. THE Data_Card SHALL 将内嵌表格的最大可见行数限制为 5 行
2. WHEN 表格数据超过 5 行时，THE Data_Card SHALL 在表格内部启用垂直滚动条，卡片整体高度保持固定
3. THE Data_Card SHALL 确保聊天气泡高度不因表格数据量增加而无限拉长

### 需求 7：动态路由跳转

**用户故事：** 作为用户，我希望点击卡片上的跳转按钮后能直接进入对应的详情页或列表页，以便查看完整信息。

#### 验收标准

1. WHEN 项目卡片数据中所有记录归属同一个 ProjectID 时，THE Data_Card SHALL 展示按钮文案"👁 查看项目详情"，点击后携带该 ProjectID 在新浏览器页签中打开 moi_c_ProjectInfo 页面
2. WHEN 项目卡片数据中包含多个不同 ProjectID 时，THE Data_Card SHALL 展示按钮文案"👁 查看完整列表"，点击后携带搜索关键词或 ID 集合参数在新浏览器页签中打开项目列表页
3. WHEN 客户卡片数据中所有记录归属同一个 ClientID 时，THE Data_Card SHALL 展示按钮文案"👁 查看客户档案"，点击后携带该 ClientID 在新浏览器页签中打开 moi_c_ClientInfo 页面
4. WHEN 客户卡片数据中包含多个不同 ClientID 时，THE Data_Card SHALL 展示按钮文案"👁 查看完整列表"，点击后携带搜索关键词或 ID 集合参数在新浏览器页签中打开客户列表页
5. THE Data_Card SHALL 通过 window.open 在新浏览器页签中执行所有跳转动作

### 需求 8：聊天流数据结构标准化

**用户故事：** 作为开发者，我希望聊天流对象采用标准化数据结构，以便未来接入真实 AI 接口时只需替换数据源而无需重构 UI 组件。

#### 验收标准

1. THE ChatMessage SHALL 包含以下标准字段：id（唯一标识）、role（角色，值为 "user" 或 "assistant"）、content（文本内容）、cardType（卡片类型，可选值为 "project"、"client" 或 null）、cardData（卡片数据，为数组或 null）
2. WHEN role 为 "user" 时，THE Chat_Panel SHALL 将消息渲染为用户气泡样式（右侧对齐）
3. WHEN role 为 "assistant" 且 cardType 为 null 时，THE Chat_Panel SHALL 将消息渲染为纯文本助手气泡样式（左侧对齐）
4. WHEN role 为 "assistant" 且 cardType 不为 null 时，THE Chat_Panel SHALL 将消息渲染为结论文本加 Data_Card 的组合样式（左侧对齐）
