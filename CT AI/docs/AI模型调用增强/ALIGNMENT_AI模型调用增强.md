# ALIGNMENT_AI模型调用增强

## 1. 原始需求
- 前端显示的 AI 模型需要全部替换成当前主流、具备图像编辑/生成能力的国内外模型。
- 后端必须实际调用 AI 图像模型；用户需要看到如何在 `backend/.env.local` 中配置 `GEMINI_API_KEY` 等密钥。

## 2. 项目与现状理解
- 当前前端基于 React + Zustand，`Sidebar` 使用 `AI_MODELS` 常量渲染模型下拉列表，包含国内外模型混合，部分与图像编辑不完全匹配。
- 后端使用本地 JSON 存储，已经新增了 Google Gemini 调用能力（`generateModuleResult` + `POST /api/modules`），依赖 `@google/generative-ai`，要求在环境变量中提供 `GEMINI_API_KEY`。
- `.env.example` 已新增 `GEMINI_API_KEY`，但用户本地的 `.env.local` 可能尚未同步。

## 3. 任务边界与限制
- 调整前端模型列表仅限 UI 层（`AI_MODELS` 常量及展示），保持现有状态管理逻辑。
- 确保列出的模型均支持图像生成/编辑能力，并涵盖主流国外与国内供应商。
- 后端暂时主要集成 Google Gemini；其他模型的调用若无官方 SDK/凭证，不在当前范围，但需为未来扩展预留接口和文档说明。
- 需要更新文档，指导用户在 `.env.local` 中配置 `GEMINI_API_KEY`。

## 4. 已知信息
- `AI_MODELS` 常量定义于 `ct-ai-web/src/types/index.ts`。
- 后端 `env.ts` 要求 `GEMINI_API_KEY`，未配置将抛出错误。
- `docs/CT_AI应用` 目录已有多项部署说明，可在其中扩展新小节或新增专门文档。

## 5. 待确认/疑问
1. 前端需要展示的主流模型具体名单是否由用户指定，还是由我们结合行业现状拟定？（默认拟定：Google Gemini、OpenAI、Stability AI、Midjourney/Adobe Firefly、百度文心、阿里通义万相、腾讯混元等）
2. 对国内模型是否需要区分代理配置或提示（例如强调需要 VPN）？
3. 是否需要在本次迭代内接入除 Gemini 之外的实际调用？若是，需要提供相应的 API Key 与 SDK 选型。

## 6. 下一步建议
- 等待用户确认模型名单及 VPN 提示需求。
- 若名单无异议，则进入 DESIGN 阶段梳理前后端改动点，包含：
  - 更新 `AI_MODELS` 数据结构，列出图像编辑能力与说明。
  - 增加 `.env.local` 配置指引文档/模版。
  - （若需要）扩展后端模型路由结构以支持多模型路由。

