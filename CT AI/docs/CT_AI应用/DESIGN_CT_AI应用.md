 # DESIGN_CT_AI应用

 ## 1. 总体架构

 ### 1.1 系统架构图
 ```mermaid
 graph TD
     subgraph Client[客户端 - React Native / Expo]
         Upload[ImageUploader]
         ChainEditor[ChainEditor]
         ModulePanel[ModuleLibrary]
         StatusPanel[StatusIndicator]
         Settings[SettingsCenter]
         AuthUI[AuthScreens]
     end

     subgraph Core[业务逻辑层]
         Engine[ChainExecutionEngine]
         ModuleLoader[ModuleLoader]
         StateMgr[StateManager (Zustand)]
         Compressor[ImageCompressor]
         ProxyRouter[ProxyRouter]
         PromptMgr[PromptManager]
         AuthService[AuthService]
     end

     subgraph Gateway[API 网关 - Next.js]
         APIEntry[REST Gateway]
         ModelRouter[ModelRouter]
         Queue[RequestQueue]
         ErrorCenter[ErrorController]
     end

     subgraph Services[服务层 - Node Modules]
         ModuleSvc[ModuleService]
         PromptSvc[PromptService]
         ProjectSvc[ProjectService]
         AuthSvc[AuthServiceAPI]
     end

     subgraph Data[数据层 - MongoDB]
         UserCol[users]
         ProjectCol[edit_projects]
         ModuleCol[modules]
         PromptCol[prompt_templates]
         ConfigCol[configurations]
     end

     subgraph External[外部依赖]
         Gemini[gemini-2.5-flash-image API]
         OtherModels[Future Models]
         VPN[User Proxy Endpoint]
     end

     Upload --> Engine
     ChainEditor --> Engine
     ModulePanel --> ModuleLoader
     StatusPanel --> StateMgr
     Settings --> ProxyRouter
     AuthUI --> AuthService
     Engine --> APIEntry
     ModuleLoader --> ModuleSvc
     PromptMgr --> PromptSvc
     AuthService --> AuthSvc
     APIEntry --> ModelRouter
     ModelRouter --> Gemini
     ModelRouter --> OtherModels
     APIEntry --> Queue
     Queue --> ErrorCenter
     Services --> Data
     ProxyRouter --> VPN
 ```

 ### 1.2 分层说明
 - **客户端层**: 提供上传、链式编辑、模块管理、状态展示、设置与认证 UI；通过 Zustand 管理应用状态，调用本地压缩与代理配置。
 - **业务逻辑层**: 封装链式执行、模块装载、状态同步、压缩策略、代理策略、提示词管理、认证流程等核心逻辑。
 - **API 网关层**: 使用 Next.js API 路由提供统一入口，执行请求校验、排队、错误处理、模型路由与响应封装。
 - **服务层**: 针对模块、提示词、项目、用户等领域提供服务对象，处理业务规则并与数据层交互。
 - **数据层**: MongoDB 存储用户、项目、模块、提示词、配置等持久化数据；可扩展 Redis 缓存执行状态。
 - **外部依赖层**: 对接指定模型 API（MVP 以 `gemini-2.5-flash-image` 为主），预留扩展接口；VPN/代理由用户提供参数。

 ## 2. 核心组件设计

 ### 2.1 客户端组件
 - `ImageUploader`: 负责图片选择、裁剪、本地压缩（质量/尺寸配置），输出压缩结果与元数据。
 - `ChainEditor`: 管理步骤列表、拖拽排序、条件分支、参数面板；与 `ChainExecutionEngine` 和状态管理器交互。
 - `ModuleLibrary`: 展示可用模块，支持搜索、安装状态、模块详情；调用后端 `ModuleService` 获取数据。
 - `StatusIndicator`: 订阅步骤状态，显示颜色、进度、消息、耗时；提供重试、跳过操作入口。
 - `SettingsCenter`: 集成模型选择、代理配置、压缩策略、账户信息等设置项。
 - `AuthScreens`: 包含注册、登录、重置密码 UI，调用 `AuthService` 完成认证流程。

 ### 2.2 业务逻辑模块
 - `ChainExecutionEngine`
   - 负责执行链式步骤：初始化 → 参数校验 → 调用 API → 状态更新 → 错误回滚/重试。
   - 提供事件总线通知 UI（stepStarted、stepProgress、stepCompleted、stepFailed）。
   - 支持条件分支，通过步骤条件表达式决定下一步骤。
 - `ModuleLoader`
   - 加载模块元数据、参数定义、默认模型；管理模块版本与启用状态。
   - 提供安装/卸载、启用/禁用操作；本地缓存模块信息。
 - `StateManager`
   - 基于 Zustand 定义核心 store：项目列表、当前项目、步骤状态、用户信息、设置偏好等。
 - `ImageCompressor`
   - 提供压缩队列、网络状况评估（必要时调整质量）、多图批处理能力。
 - `ProxyRouter`
   - 根据模型配置和用户代理设置决定是否使用代理；对网络失败进行回退策略（如重试）。
 - `PromptManager`
   - 管理提示词模板、收藏、使用统计；区分角色访问权限。
 - `AuthService`
   - 管理本地 token、刷新、退出登录、角色权限检查；处理用户信息同步。

 ### 2.3 服务层模块
 - `ModuleService`: CRUD 模块数据、版本管理、内部模块市场数据接口。
 - `PromptService`: 提示词模板 CRUD、评分、成功率统计。
 - `ProjectService`: 项目与步骤管理、链式执行历史、收藏流程模板。
 - `AuthServiceAPI`: 用户注册、登录、角色分配、Token 发行（JWT）、密码找回。
 - `ModelRouter`: 负责模型选择、调用封装、参数映射、错误分类、耗时统计。
 - `RequestQueue`: 限制并发、按策略排队（FIFO/优先级），记录请求状态。
 - `ErrorController`: 统一处理错误码，返回前端友好的错误信息，记录日志。

 ## 3. 模块依赖关系

 ```mermaid
 graph LR
     ChainExecutionEngine --> StateManager
     ChainExecutionEngine --> ModuleLoader
     ChainExecutionEngine --> ModelRouter
     ChainExecutionEngine --> ProxyRouter
     ModuleLoader --> ModuleService
     PromptManager --> PromptService
     AuthService --> AuthServiceAPI
     ModelRouter --> RequestQueue
     ModelRouter --> ErrorController
     RequestQueue --> ModelAPIs[Model APIs]
     ErrorController --> Logging[Logging & Monitoring]
     StateManager --> LocalStorage[Secure Storage]
 ```

 ## 4. 接口契约定义

 ### 4.1 客户端 ↔ 后端 API
 - `POST /api/auth/register`
   - 请求: `{ email, password, name }`
   - 响应: `{ userId, token, role }`
 - `POST /api/auth/login`
   - 请求: `{ email, password }`
   - 响应: `{ userId, token, refreshToken, role }`
 - `GET /api/modules`
   - 响应: `EditModule[]`
 - `POST /api/projects`
   - 请求: `EditProject` 简化版本（不含执行状态）
   - 响应: `{ projectId }`
 - `POST /api/projects/{projectId}/execute`
   - 请求: `{ steps: EditStep[], settings: { proxyConfig, compressionConfig } }`
   - 响应: `{ executionId, status, queuedAt }`
 - `GET /api/executions/{executionId}`
   - 响应: `{ status, progress, resultUrl?, errorMessage? }`
 - `GET /api/prompts`
   - 请求参数: `?visibility=&category=`
   - 响应: `PromptTemplate[]`

 ### 4.2 服务层内部接口
 - `ModuleService#getAvailableModules(userRole: UserRole): Promise<EditModule[]>`
 - `ProjectService#createProject(userId: string, payload: CreateProjectDto): Promise<string>`
 - `ProjectService#updateStepStatus(executionId: string, stepId: string, status: StepStatus): Promise<void>`
 - `ModelRouter#invoke(request: AIRequest, context: InvokeContext): Promise<AIResponse>`
 - `ProxyRouter#resolve(model: string): Promise<ProxyConfig | null>`
 - `PromptService#trackUsage(templateId: string, success: boolean): Promise<void>`

 ### 4.3 数据模型补充
 ```typescript
 interface ProxyConfig {
   enabled: boolean;
   host: string;
   port: number;
   username?: string;
   password?: string;
 }

 interface CreateProjectDto {
   name: string;
   originalImage: string;
   steps: EditStep[];
 }

 interface AIResponse {
   stepId: string;
   status: 'success' | 'error';
   resultImage?: string;
   error?: {
     code: string;
     message: string;
     retryable: boolean;
   };
   metadata?: {
     cost: number;
     durationMs: number;
   };
 }
 ```

 ## 5. 数据流与状态同步

 1. **项目创建数据流**: 用户端提交项目 → `ProjectService` 存储 → 返回项目 ID → 客户端更新 `StateManager` -> 进入链式编辑界面。
 2. **步骤执行流**:
    - 链式引擎校验步骤参数、选择模型 → 通过 `ModelRouter` 调用 API。
    - `ProxyRouter` 决定是否使用代理；`ImageCompressor` 在执行前处理图片。
    - `RequestQueue` 控制请求速率，`ModelRouter` 记录耗时与费用。
    - 执行结果通过 `ProjectService` 更新数据库，同时推送到客户端（轮询或 WebSocket）。
    - 客户端 `StateManager` 更新步骤状态，`StatusIndicator` 展示。
 3. **模块与提示词同步**: 客户端获取模块/提示词列表 → 缓存于本地 → 用户操作触发后端更新 → 成功后刷新 UI。
 4. **认证流**: 注册/登录 → 获取 token → `AuthService` 存储于安全存储 → 后续请求携带 → Token 过期时通过刷新令牌获取新 token。

 ## 6. 异常处理策略
 - **模型调用失败**: 根据 `AIResponse.error.retryable` 决定自动重试次数（默认 2 次）；失败后更新步骤状态为 `error`，提示重试选项。
 - **网络/代理错误**: 捕获连接超时、DNS 失败等错误；提供检测按钮测试代理可用性；必要时回退到无代理模式。
 - **图片压缩失败**: 回退到原图或提示用户重新上传；记录日志以便诊断。
 - **认证失败**: 明确区分凭证错误与账户状态问题，提供重试或联系客服指引。
 - **数据一致性**: 通过事务或补偿逻辑确保步骤状态与执行记录一致；引擎在恢复时可读取最新状态继续执行。
 - **全局错误监控**: 集成日志与监控系统（如 Sentry），对模型调用耗时、失败率、成本进行统计。

 ## 7. 性能与扩展考虑
 - **请求并发控制**: `RequestQueue` 根据模型限流配置限制并发，避免超过供应商配额。
 - **缓存策略**: 模块列表、提示词模板、模型配置可在客户端与服务端缓存，减少重复请求。
 - **扩展模型**: `ModelRouter` 使用适配器模式，新模型仅需实现统一接口（参数映射、响应解析）。
 - **模块生态扩展**: 预留模块签名、版本管理、热更新接口，为内部市场扩展做准备。
 - **多端适配**: 使用响应式布局、平台特定样式，桌面端启用快捷键与更宽的布局。

 ## 8. 安全策略
 - **认证与授权**: JWT + 角色权限控制；所有敏感接口需验证角色。
 - **数据保护**: 本地使用安全存储（Keychain/Keystore/EncryptedStorage）；后端数据加密存储敏感字段（如 API Key）。
 - **通信安全**: 所有网络请求使用 HTTPS；提供证书校验与中间人攻击防护。
 - **审计日志**: 记录关键操作（模块安装、流程执行、提示词管理）以备审计。

 ---

 本设计文档为 Architect 阶段交付物，指导随后任务拆分与实现。下一阶段将基于此设计生成原子任务规划文档。

