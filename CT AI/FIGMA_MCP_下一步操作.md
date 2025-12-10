# Cursor Talk to Figma MCP - 下一步操作指南

## ✅ 当前状态

配置文件和启动脚本已创建完成。

## 📋 立即执行的步骤

### 步骤 1：验证配置（可选）

运行验证脚本检查配置：

```powershell
powershell -ExecutionPolicy Bypass -File "验证Figma_MCP配置.ps1"
```

### 步骤 2：启动 WebSocket 服务器 ⚡

**重要**：WebSocket 服务器必须在后台持续运行，Cursor 才能与 Figma 通信。

**方法一：使用启动脚本（推荐）**

```powershell
powershell -ExecutionPolicy Bypass -File "启动Figma_MCP_WebSocket.ps1"
```

**方法二：手动启动**

```powershell
bunx cursor-talk-to-figma-mcp@latest socket
```

**预期输出**：
```
WebSocket server started on ws://localhost:8765
Waiting for connections...
```

**⚠️ 重要**：
- 保持此 PowerShell 窗口打开
- 不要关闭此窗口
- 如果窗口关闭，需要重新启动服务器

### 步骤 3：重启 Cursor 🔄

1. 完全关闭 Cursor
2. 重新打开 Cursor
3. 这将加载新的 MCP 配置

### 步骤 4：在 Figma 中安装插件 🎨

#### 方法一：从 Figma 社区安装（最简单）

1. 打开 Figma Desktop 或访问 https://www.figma.com
2. 点击菜单：`Plugins` > `Browse plugins in Community`
3. 搜索：`"Cursor MCP Plugin"` 或 `"Talk to Figma"`
4. 点击 `Install` 安装

#### 方法二：本地开发模式（高级）

如果你克隆了仓库：

1. 在 Figma 中：`Plugins` > `Development` > `New Plugin`
2. 选择：`Link existing plugin`
3. 选择文件：`src/cursor_mcp_plugin/manifest.json`（在克隆的仓库中）
4. 插件将出现在开发插件列表中

### 步骤 5：连接插件到 WebSocket 🔌

1. **在 Figma 中**：
   - 运行插件：`Plugins` > `Cursor MCP Plugin`（或你安装的插件名称）
   - 插件界面打开后，使用命令：`join_channel my-channel`
   - 替换 `my-channel` 为你想要的频道名称（例如：`ct-ai-project`）

2. **验证连接**：
   - 如果连接成功，插件界面会显示连接状态
   - WebSocket 服务器窗口会显示连接日志

### 步骤 6：在 Cursor 中使用 🚀

现在你可以在 Cursor 的 AI 聊天中直接与 Figma 交互了！

**示例命令**：

```
请使用 get_document_info 获取当前 Figma 文档的信息
```

```
查看我在 Figma 中选中的元素
```

```
在 Figma 中创建一个 200x100 的矩形，位置 (100, 100)，颜色 #7C3AED
```

```
扫描所有文本节点，并将 "旧文本" 替换为 "新文本"
```

## 🔍 验证安装是否成功

### 检查清单

- [ ] Bun 已安装（运行 `bun --version`）
- [ ] `.cursor/mcp.json` 包含 `TalkToFigma` 配置
- [ ] WebSocket 服务器正在运行（有 PowerShell 窗口保持打开）
- [ ] Cursor 已重启
- [ ] Figma 插件已安装
- [ ] 插件已连接到 WebSocket（使用 `join_channel`）

### 测试连接

在 Cursor 中尝试：

```
请使用 get_document_info 获取 Figma 文档信息
```

如果成功，说明一切配置正确！

## ❓ 常见问题

### Q: WebSocket 服务器启动失败？

**A**: 检查：
1. Bun 是否已安装：`bun --version`
2. 网络连接是否正常
3. 端口是否被占用（默认 8765）

### Q: Cursor 中看不到 MCP 工具？

**A**: 
1. 确保已重启 Cursor
2. 检查 `.cursor/mcp.json` 配置是否正确
3. 查看 Cursor 的 MCP 日志（如果有）

### Q: Figma 插件无法连接？

**A**:
1. 确保 WebSocket 服务器正在运行
2. 在插件中使用 `join_channel` 命令
3. 检查浏览器控制台是否有错误

### Q: Windows WSL 用户？

**A**: 
如果使用 WSL，需要在 `src/socket.ts` 中取消注释：
```typescript
hostname: "0.0.0.0",
```

## 📚 参考资源

- **快速开始**：`FIGMA_MCP_快速开始.md`
- **详细文档**：`docs/图片编辑免费模型/FIGMA_MCP_SETUP.md`
- **GitHub 仓库**：https://github.com/grab/cursor-talk-to-figma-mcp
- **MCP 协议**：https://modelcontextprotocol.io/

## 🎯 下一步

配置完成后，你可以：

1. **读取设计**：使用 `read_my_design` 获取设计详情
2. **创建元素**：使用 `create_rectangle`、`create_frame` 等
3. **修改内容**：使用 `set_text_content`、`set_fill_color` 等
4. **批量操作**：使用 `set_multiple_text_contents` 等批量工具
5. **导出设计**：使用 `export_node_as_image` 导出为图片

---

**需要帮助？** 查看详细文档或 GitHub Issues。

