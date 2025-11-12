# TODO_AI模型调用增强

1. **Gemini 额度配置**
   - 当前请求因免费额度为 0 返回 `429 Quota exceeded`，需在 Google AI Studio 开通付费计划或提升配额后再次测试。
2. **多模型真实接入规划**
   - 若后续希望调用 OpenAI、Stability、Midjourney 等，请提前准备 API Key 与 SDK 选型，并为后端设计统一的模型路由接口。
3. **代理连通性检测（可选）**
   - 可在设置面板新增代理检测按钮，自动验证指定域名的可达性，提升用户体验。

