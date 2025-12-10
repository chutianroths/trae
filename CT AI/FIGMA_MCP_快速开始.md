# Cursor Talk to Figma MCP - 快速开始指南

## 📋 安装步骤（Windows）

### 步骤 1：安装 Bun（如果尚未安装）

在 PowerShell 中运行：

```powershell
powershell -c "irm bun.sh/install.ps1|iex"
```

安装完成后，**重启 PowerShell 终端**。

### 步骤 2：配置 MCP 服务器

运行配置脚本：

```powershell
powershell -ExecutionPolicy Bypass -File "配置Figma_MCP.ps1"
```

或者手动编辑 `.cursor/mcp.json`，添加以下配置：

```json
{
  "mcpServers": {
    "TalkToFigma": {
      "command": "bunx",
      "args": ["cursor-talk-to-figma-mcp@latest"]
    }
  }
}
```

### 步骤 3：启动 WebSocket 服务器

运行启动脚本：

```powershell
powershell -ExecutionPolicy Bypass -File "启动Figma_MCP_WebSocket.ps1"
```

或者手动运行：

```powershell
bunx cursor-talk-to-figma-mcp@latest socket
```

**重要**：保持此窗口打开，WebSocket 服务器需要持续运行。

### 步骤 4：安装 Figma 插件

#### 方法一：从社区安装（推荐）
1. 打开 Figma Desktop 或 Web
2. 进入 `Plugins > Browse plugins in Community`
3. 搜索 "Cursor MCP Plugin" 或访问：https://www.figma.com/community/plugin/[插件ID]
4. 点击 "Install" 安装

#### 方法二：本地开发模式
1. 克隆仓库：`git clone https://github.com/grab/cursor-talk-to-figma-mcp.git`
2. 在 Figma 中：`Plugins > Development > New Plugin > Link existing plugin`
3. 选择 `src/cursor_mcp_plugin/manifest.json`

### 步骤 5：连接插件

1. **重启 Cursor** 以加载 MCP 配置
2. **打开 Figma** 并运行 "Cursor MCP Plugin"
3. **在插件中**：使用 `join_channel` 命令加入频道（例如：`join_channel my-channel`）
4. **在 Cursor 中**：现在可以使用 MCP 工具与 Figma 交互了！

## 🚀 使用示例

### 示例 1：读取当前设计

在 Cursor 的 AI 聊天中输入：

```
请使用 get_document_info 获取当前 Figma 文档的信息
```

### 示例 2：获取选中的元素

```
使用 get_selection 查看我在 Figma 中选中的元素
```

### 示例 3：创建新元素

```
在 Figma 中创建一个 200x100 的矩形，位置在 (100, 100)，颜色为 #7C3AED
```

### 示例 4：批量替换文本

```
扫描所有文本节点，并将 "旧文本" 替换为 "新文本"
```

## 🛠️ 可用的 MCP 工具

### 文档操作
- `get_document_info` - 获取文档信息
- `get_selection` - 获取当前选择
- `read_my_design` - 读取设计详情
- `get_node_info` - 获取节点信息
- `set_focus` - 聚焦节点

### 创建元素
- `create_rectangle` - 创建矩形
- `create_frame` - 创建框架
- `create_text` - 创建文本

### 修改内容
- `set_text_content` - 设置文本内容
- `set_multiple_text_contents` - 批量设置文本
- `set_fill_color` - 设置填充色
- `set_stroke_color` - 设置描边
- `set_corner_radius` - 设置圆角

### 布局
- `set_layout_mode` - 设置 Auto Layout
- `set_padding` - 设置内边距
- `set_item_spacing` - 设置间距

### 组件
- `get_local_components` - 获取组件
- `create_component_instance` - 创建实例
- `set_instance_overrides` - 设置覆盖

### 导出
- `export_node_as_image` - 导出为图片

## ❓ 故障排除

### WebSocket 连接失败
- ✅ 确保 WebSocket 服务器正在运行（步骤 3）
- ✅ 检查防火墙是否阻止了连接
- ✅ Windows WSL 用户需要在 `src/socket.ts` 中设置 `hostname: "0.0.0.0"`

### MCP 服务器未加载
- ✅ 重启 Cursor
- ✅ 检查 `.cursor/mcp.json` 配置是否正确
- ✅ 确保 `bunx` 命令可用（已安装 Bun）

### Figma 插件无法连接
- ✅ 确保 WebSocket 服务器运行中
- ✅ 在插件中使用 `join_channel` 加入频道
- ✅ 检查浏览器控制台是否有错误信息

## 📚 参考资源

- **GitHub 仓库**：https://github.com/grab/cursor-talk-to-figma-mcp
- **详细文档**：`docs/图片编辑免费模型/FIGMA_MCP_SETUP.md`
- **MCP 协议**：https://modelcontextprotocol.io/
- **Figma 插件开发**：https://www.figma.com/plugin-docs/

## 💡 提示

1. **保持 WebSocket 服务器运行**：服务器必须持续运行才能维持连接
2. **使用频道**：多个用户可以使用不同的频道名称避免冲突
3. **批量操作**：对于大量元素，使用批量操作工具（如 `set_multiple_text_contents`）更高效
4. **先读取再修改**：修改前先使用 `get_selection` 或 `read_my_design` 了解当前状态

---

**需要帮助？** 查看详细文档：`docs/图片编辑免费模型/FIGMA_MCP_SETUP.md`

