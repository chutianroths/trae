# ALIGNMENT_图片编辑免费模型

## 项目上下文
- `ct-ai-web` 采用 Vite + React + TypeScript，模型配置集中在 `AI_MODELS` 常量中，前端 UI（`Sidebar`、`SettingsPanel`）依赖该列表渲染模型信息及 API Key 输入。
- `backend` 目前只真正调用 Google Gemini 图像模型；其它模型在前端作为占位，尚未建立后端路由与密钥校验逻辑。
- 现有 `AI_MODELS` 已涵盖文心一格、通义万相、腾讯混元、商汤日日新等国内模型，但 `costPerImage` 全部为付费值，UI 中也没有突出“免费额度/国内免 VPN”标签。

```216:315:ct-ai-web/src/types/index.ts
export const AI_MODELS: AIModel[] = [
  { name: 'Gemini 2.5 Flash Image', requiresVPN: true, costPerImage: 0.02, apiKeyId: 'gemini' },
  { name: '文心一格', requiresVPN: false, costPerImage: 0.02, apiKeyId: 'wenxinyige' },
  { name: '通义万相', requiresVPN: false, costPerImage: 0.018, apiKeyId: 'tongyiwanxiang' },
  { name: '混元图像', requiresVPN: false, costPerImage: 0.02, apiKeyId: 'hunyuan' },
  { name: '日日新·星辰', requiresVPN: false, costPerImage: 0.025, apiKeyId: 'rishin' }
];
```

## 原始需求
- “查询目前中国国内可以调用的图片编辑的免费模型，并添加进 AI 模型选择和 API 密钥里面”。

## 边界确认
- **范围内**：调研国内可直接在线调用、具备图片编辑能力且提供免费调用额度（免费套餐/零售价）的模型；在前端模型列表与 API Key 配置中新增/标注；补充文档说明接入方式与免费额度限制。
- **范围外**：搭建/部署新的推理后端、深度联调 SDK、调整移动端 `frontend`/`figma` 目录、扩展链式编辑逻辑；除非必要，不修改 `backend` 的实际调用链。

## 需求理解
1. 需要提供一份“可在中国大陆区域直连、无需 VPN、含免费层”的模型清单，并说明调用入口与 API Key 获取方式。
2. UI 层至少要在模型选择列表与设置中的 API Key Tab 中展示这些模型（含 `apiKeyId`），方便用户粘贴密钥。
3. 需要同步更新相关文档，保证用户能找到注册、额度、风控限制及使用场景说明。
4. 可能需要新增 `AiApiKeyId` 枚举项（例如 `siliconflow_flux`、`baidu_wenxinyige_free` 等），并在 `ApiKeys` 状态、持久化逻辑中支持。

## 关键假设
- “免费”可理解为**官方提供有明确免费额度**（如新用户赠送额度、长期 Daily Free Tier）；若完全免费模型数量有限，可选择提供至少三个具备免费试用的国内模型。
- 现有 UI 允许继续扩充 AI_MODELS，无需大幅调整组件结构。
- 用户期望先完成调研与前端数据更新，后续是否真正接入后端可再行安排。

## 待澄清问题
1. **免费标准**：是否接受“有长期免费配额/试用额度”的模型，还是必须无限制完全免费？
2. **数量目标**：需要列出多少款国内免费模型？是否至少 3 款？
3. **优先行业**：更偏向通用图像编辑（抠图、修复）还是 AIGC 文生图？
4. **API Key 管理**：是否需要在 .env 或其它配置文件中给出示例字段？
5. **文档输出形态**：是否沿用 6A 流程（ALIGNMENT→CONSENSUS→DESIGN→TASK→ACCEPTANCE→FINAL）完整交付？

请确认以上问题或提供额外约束，以便进入下一阶段（Architect）。
