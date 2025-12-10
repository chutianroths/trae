# FINAL_图片编辑免费模型

## 1. 目标回顾
- 提供至少 3 款国内可调用、带官方免费额度的图片编辑/文生图模型。
- 在前端模型选择与 API Key 面板中直观展示“国内/Free Tier/是否配置”等状态。
- 提供 .env 示例字段及文档指引，便于用户复制密钥。

## 2. 交付内容
1. **模型调研**：在 MODEL_RESEARCH_图片编辑免费模型.md 记录文心一格、通义万相、混元图像的免费额度、申请流程与限制。
2. **类型与常量扩展**：AIModel 引入 id/freeTier/officialSite/quotaNotes 字段，AI_MODELS 补充国内模型及配额描述。引用：220:355:ct-ai-web/src/types/index.ts。
3. **Sidebar/Settings UI**：模型下拉、徽标、API Key 面板、配额提示等交互全部更新，支持快速区分国内免费模型。引用：364:435:ct-ai-web/src/components/Sidebar.tsx、189:268:ct-ai-web/src/components/SettingsPanel.tsx。
4. **配置模板**：ackend/env.example 新增百度/阿里/腾讯示例字段，便于未来后端多模型路由。引用：1:14:backend/env.example。
5. **测试文档**：ACCEPTANCE_图片编辑免费模型.md 记录 lint 与文档验收结果。

## 3. 测试概览
- 
pm run lint（ct-ai-web）：✅
- 文档审查（模型、UI、配置示例）：✅

## 4. 余量与风险
- 免费额度可能随官方策略调整；文档中已提示“以官方公告为准”。
- 后端目前仍仅调用 Gemini，后续若要切换真实模型需实现多模型路由与鉴权。

## 5. 下一步建议
- 与产品确认是否需要在后端接入以上国内模型，并评估鉴权/计费策略。
- 结合用户反馈决定是否增加更多国内模型或提供一键测速/配额查询能力。
