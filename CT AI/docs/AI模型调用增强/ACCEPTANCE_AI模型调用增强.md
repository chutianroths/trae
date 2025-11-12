# ACCEPTANCE_AI模型调用增强

## 已完成检查
- [x] 更新 `AI_MODELS` 为主流图像生成/编辑模型，并在 UI 中显示地区与 VPN 要求。
- [x] 设置面板 VPN 提示文案已补充。
- [x] `backend/.env.local` 写入 `GEMINI_API_KEY` 并确认未纳入版本控制。
- [x] 前端 `npm run lint` 通过。
- [x] 手动调用 `POST /api/modules`，请求已成功到达 Gemini 接口；因免费额度为 0 返回 `429 Quota exceeded`，说明真实调用链路正常，待用户补充付费或配额后可获得图像数据。

## 运行记录
- 2025-11-12：执行 `npm run lint`（ct-ai-web）。
- 2025-11-12：写入 `GEMINI_API_KEY` 到 `backend/.env.local`。

