# CONSENSUS_AI模型调用增强

## 需求与验收标准
- **模型列表更新**：前端仅展示主流、具备图像生成/编辑能力的国内外模型，包含 Google Gemini、OpenAI DALL·E、Stability Stable Diffusion、Midjourney、Adobe Firefly、百度文心一格、阿里通义万相、腾讯混元图像、商汤日日新等。需明确显示地区与是否必须使用 VPN。
- **UI 提示**：Sidebar 的模型选择区显著标注 “需 VPN” 信息并展示模型能力；设置面板的 VPN Tab 提示使用国外模型时须开启代理，保留 VPN 配置入口。
- **后端调用**：继续使用 `generateModuleResult` 调用 Google Gemini `models/gemini-2.5-flash-image`，要求在 `backend/.env.local` 配置 `GEMINI_API_KEY` 并确保调用成功返回图像数据。
- **文档更新**：补充说明如何填写 `.env.local`、如何在设置面板中录入 API Key 与开启 VPN。

## 技术方案
- 更新 `ct-ai-web/src/types/index.ts` 内 `AI_MODELS` 常量，同时调整能力描述。
- 在 `Sidebar` 中基于当前模型展示地区、能力与 VPN 提示；保持与 Zustand 的 `selectedModel` 状态兼容。
- 在 `SettingsPanel` 的 VPN Tab 增加国外模型说明。
- 使用 PowerShell 将用户提供的 `GEMINI_API_KEY` 写入 `backend/.env.local`，避免纳入版本控制。
- 若后续需要扩展其他模型服务，只需在后端增补对应 service 与 API 路由。

## 边界与限制
- 当前仅确保 Gemini 实际调用；其他模型暂不接入真实 API，仅在 UI 中展示。
- 不改动现有本地 JSON 存储实现。
- 不涉及移动端/Expo 项目。

