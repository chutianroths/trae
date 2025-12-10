# DESIGN_图片编辑免费模型

## 1. 架构总览
`mermaid
flowchart TD
    subgraph UI[ct-ai-web 前端]
        SB[Sidebar 模型列表]
        SP[SettingsPanel API Keys]
        CE[ChainEditor / 模块配置]
        Store[Zustand store/apiKeys]
    end

    subgraph Config[配置与文档]
        ENV[.env / .env.local]
        DOCS[docs/图片编辑免费模型/*]
    end

    SB --> Store
    SP --> Store
    Store --> CE
    ENV --> SP
    DOCS --> Users
`

- **核心思路**：在前端维度完成模型调研与配置展示，暂不修改后端实际调用路线；通过配置示例与文档指引保证用户可快速获取免费额度。
- **数据主线**：AI_MODELS 常量提供所有模型元数据 → Sidebar/Settings 读取 → Zustang store 保存选择与密钥；文档/ENV 提供外部依赖说明。

## 2. 模块拆解
| 层级 | 组件/文件 | 责任 | 关键改动 |
| --- | --- | --- | --- |
| 前端数据层 | ct-ai-web/src/types/index.ts | 定义 AIModel、AiApiKeyId、AI_MODELS | 新增字段 reeTier, officialSite, quotaNotes；扩充至少 3 个国内免费模型；补充 .env 对应 piKeyId。 |
| 前端 UI | Sidebar.tsx, SettingsPanel.tsx, components/ui/* | 展示模型列表、API Key 输入 | Sidebar 增加“Free Tier/国内”徽标；SettingsPanel 增加新的输入行与提示。 |
| 状态存储 | lib/store.ts（或等效 Zustand） | 存储 piKeys, selectedModelId | 确保 ApiKeys 类型涵盖新 AiApiKeyId；默认值为空字符串。 |
| 配置示例 | .env.example / ackend/.env.example? | 提供 Key 字段 | 新增 WENXIN_API_KEY, TONGYI_API_KEY, HUNYUAN_API_KEY（按实际模型命名）。 |
| 文档 | docs/图片编辑免费模型/*.md | 描述流程、额度、验收 | 在 DESIGN/TASK/ACCEPTANCE/FINAL 中记录模型信息、配置步骤、测试方法。 |

## 3. 接口契约
### 3.1 AI 模型定义
`	ext
interface AIModel {
  id: string;              // 新增唯一 ID，便于引用
  name: string;
  provider: string;
  capabilities: string[];
  costPerImage: number;
  requiresVPN: boolean;
  region: 'domestic' | 'foreign';
  status: 'online' | 'offline';
  latency?: number;
  apiKeyId: AiApiKeyId;
  freeTier: boolean;       // 新增：是否有官方免费额度
  officialSite?: string;   // 新增：官方调用/文档
  quotaNotes?: string;     // 新增：免费额度描述
}
`
> 若现有 AI_MODELS 结构未使用 id 字段，可沿用 name 作为 ID，但推荐补充以防 UI 需要稳定 key。

### 3.2 API Key 枚举
`	ext
type AiApiKeyId =
  | 'gemini'
  | 'dalle3'
  | 'sdxl'
  | ...
  | 'wenxinyige'
  | 'tongyiwanxiang'
  | 'hunyuan'
  | 'rishin'
  | 'siliconflow_flux'; // 例如新增硅基流动
`

### 3.3 配置文件
- .env.example
  `env
  WENXIN_API_KEY=""
  TONGYI_API_KEY=""
  HUNYUAN_API_KEY=""
  SILICONFLOW_API_KEY=""
  `
- 文档需说明这些字段需写入 .env.local 或浏览器持久化方案（当前前端可能只保存在 localStorage）。

## 4. 数据流与用户路径
1. 用户在文档中找到免费模型概览，前往官方平台注册并获取 Key。
2. 将 Key 写入 .env.local 或在 SettingsPanel 中粘贴，Zustand store 同步保存至 localStorage。
3. Sidebar 展示模型列表：凡 reeTier=true 且 egion='domestic' 的模型显示“Free 国内”徽标；若用户未在 SettingsPanel 中配置 Key，Sidebar 可提示“未配置 API Key”。
4. 当用户在 ChainEditor 中选择步骤所需模型时，系统优先根据 supportedModels 推荐国内免费方案；若后端尚未实现真实调用，则在执行时提示“仅 Gemini 可调用”，避免误导。

## 5. 异常处理策略
- **Key 缺失**：SettingsPanel 输入为空时，Sidebar 显示 未配置 标签，执行操作时弹出提醒。
- **额度耗尽**：文档列出常见错误码（如 DashScope 429、Qianfan 466），并建议用户检查控制台配额；UI 可在 tooltip 中提示“免费额度有限，详见文档”。
- **实名认证/审核失败**：在文档和 SettingsPanel 提示中说明某些平台需实名/企业认证，避免用户误解。

## 6. 验收与测试策略
- **静态检查**：TypeScript 编译通过，新增字段均有默认值；linter 无报错。
- **UI 验证**：
  1. Sidebar 显示新模型及免费徽标。
  2. SettingsPanel 可新增、保存、清除新 API Key。
- **文档验证**：docs/图片编辑免费模型 下文档包含模型清单、配置步骤、常见问题；验收时根据 ACCEPTANCE 文档 checklist 逐项核对。
- **回归**：现有 Gemini 调用流程不受影响（未改 backend）。

## 7. 后续扩展预留
- 在后端 generateModuleResult 增加模型路由时可复用当前 piKeyId 字段；建议在设计中保留 selectedModelId，未来直接传给 API。
- 若需整合更多国内模型，可继续在 AI_MODELS 中扩展并复用 reeTier 字段，无需修改 UI 结构。
