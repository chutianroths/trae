# CONSENSUS_图片编辑免费模型

## 1. 目标与背景
- 在 ct-ai-web 前端提供面向国内用户的图片编辑模型选项，重点覆盖通用图像编辑（抠图、修复等）与 AIGC 文生图/扩散能力。
- 所列模型需可在国内网络直接调用、拥有官方明确的免费额度或试用额度。
- 前端需同步更新模型列表与 API Key 设置，文档需指导用户配置 .env 示例字段以及免费额度限制。

## 2. 范围与交付物
- **范围内**：
  1. 调研并确定至少 3 款符合条件的国内模型（示例：百度文心一格、阿里通义万相、腾讯混元图像/商汤日日新或硅基流动 FLUX）。
  2. 更新 AI_MODELS 数据结构，补充模型属性（免费额度标签、地区、VPN 需求、能力描述）。
  3. 在 SettingsPanel API Key Tab 中新增对应字段，并在 .env.example（或新增 .env.local.example）内提供示例。
  4. 文档更新：新增/补充模型接入指南、免费额度说明、风险提示（额度耗尽、实名认证等）。
- **范围外**：
  - 后端立即支持多模型真实调用；仍以 Gemini 为主要执行，但需为未来扩展保留接口设计。
  - 移动端/Expo 前端、其他子项目（rontend/、igma/）的同步改造。

## 3. 需求细化
1. **模型清单**：至少 3 款国内模型，覆盖两类能力（图像编辑 + 文生图）。每个模型记录：官方入口、免费额度说明、调用地址、API Key 获取方式、是否需实名认证/企业认证。
2. **UI 行为**：
   - Sidebar 模型列表突出 equiresVPN=false（本地可用）与“Free Tier”标记。
   - Settings → API Key 页面新增对应输入框，并支持状态保存。
3. **配置示例**：
   - .env.example 中新增例如 WENXIN_API_KEY=your_baidu_key、TONGYI_API_KEY=your_dashscope_key、HUNYUAN_API_KEY=your_tencent_key（或 SENSE_TIME_API_KEY）。
   - 文档说明这些字段不会提交 Git，并指引用户放入 .env.local。
4. **文档**：
   - 在 docs/图片编辑免费模型 目录新增设计/任务/验收/总结文档。
   - 描述模型接入流程、免费额度限制、常见报错（额度耗尽、实名校验失败）。

## 4. 验收标准
1. 文档：ALIGNMENT、CONSENSUS、DESIGN、TASK、ACCEPTANCE、FINAL、TODO 全部创建并覆盖最新内容。
2. 模型列表：前端 AI_MODELS 至少包含 3 款国内免费模型，并带有 reeTier: true 或可读标识；Sidebar/Settings 可正确显示。
3. API Key：.env.example（或新增模板）新增字段，SettingsPanel 中可输入并保存这些 Key。
4. 说明文档：提供每个模型的免费额度描述、调用限制、API 申请步骤。
5. 质量：未影响现有 Gemini 流程；linter/test（如有）无新增错误；文档中无与需求冲突的描述。

## 5. 风险与注意事项
- 免费额度随官方政策可能变动；需在文档中声明“以官方公告为准”。
- 某些平台需实名认证或企业认证（如阿里、腾讯）；需在指南中注明前提条件。
- UI 需防止用户在未配置 Key 情况下选择模型时误以为可直接调用，需保留提示（例如 未接入后端，仅供配置）。

> 所有上述内容均已与需求方达成共识，允许进入 Architect 阶段。
