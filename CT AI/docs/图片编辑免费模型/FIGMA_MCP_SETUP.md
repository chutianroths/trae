# Cursor Talk to Figma MCP 安装指南

## 概述
Cursor Talk to Figma MCP 是一个 Model Context Protocol (MCP) 集成，允许 Cursor AI 与 Figma 通信，实现读取设计、修改设计等功能。

参考：https://github.com/grab/cursor-talk-to-figma-mcp

## Windows 安装步骤

### 1. 安装 Bun（如果尚未安装）

在 PowerShell 中运行：

```powershell
powershell -c "irm bun.sh/install.ps1|iex"
```

安装完成后，重启终端或重新加载 PATH 环境变量。

### 2. 配置 MCP 服务器

MCP 配置已添加到 `.cursor/mcp.json`：

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

### 3. 启动 WebSocket 服务器

**重要**：WebSocket 服务器必须在后台运行，才能让 Cursor 与 Figma 通信。

在项目根目录运行：

```powershell
bunx cursor-talk-to-figma-mcp@latest socket
```

或者，如果已克隆仓库：

```powershell
bun socket
```

**Windows + WSL 用户**：需要在 `src/socket.ts` 中取消注释 `hostname: "0.0.0.0"` 以允许连接。

### 4. 安装 Figma 插件

#### 方法一：从 Figma 社区安装（推荐）
1. 打开 Figma Desktop 或 Web
2. 进入 `Plugins > Browse plugins in Community`
3. 搜索 "Cursor MCP Plugin" 或 "Talk to Figma"
4. 点击安装

#### 方法二：本地开发模式安装
1. 在 Figma 中，进入 `Plugins > Development > New Plugin`
2. 选择 "Link existing plugin"
3. 如果已克隆仓库，选择 `src/cursor_mcp_plugin/manifest.json` 文件
4. 插件将出现在开发插件列表中

### 5. 使用流程

1. **启动 WebSocket 服务器**（步骤 3）
2. **重启 Cursor** 以加载 MCP 配置
3. **打开 Figma** 并运行 "Cursor MCP Plugin"
4. **连接插件到 WebSocket**：在插件中使用 `join_channel` 命令加入频道
5. **在 Cursor 中使用 MCP 工具**：现在可以在 Cursor 中与 Figma 交互

## 可用的 MCP 工具

### 文档与选择
- `get_document_info` - 获取当前 Figma 文档信息
- `get_selection` - 获取当前选择的信息
- `read_my_design` - 获取当前选择的详细节点信息
- `get_node_info` - 获取特定节点的详细信息
- `set_focus` - 聚焦到特定节点
- `set_selections` - 设置多个节点的选择

### 创建元素
- `create_rectangle` - 创建矩形
- `create_frame` - 创建框架
- `create_text` - 创建文本节点

### 修改文本
- `scan_text_nodes` - 扫描文本节点
- `set_text_content` - 设置单个文本内容
- `set_multiple_text_contents` - 批量更新文本

### 样式与布局
- `set_fill_color` - 设置填充颜色
- `set_stroke_color` - 设置描边颜色
- `set_corner_radius` - 设置圆角
- `set_layout_mode` - 设置布局模式（Auto Layout）
- `set_padding` - 设置内边距

### 组件与实例
- `get_local_components` - 获取本地组件
- `create_component_instance` - 创建组件实例
- `get_instance_overrides` - 获取实例覆盖
- `set_instance_overrides` - 设置实例覆盖

### 导出
- `export_node_as_image` - 导出节点为图片（PNG/JPG/SVG/PDF）

## 使用示例

### 示例 1：读取当前设计

```
在 Cursor 中：
1. 使用 get_document_info 获取文档概览
2. 使用 get_selection 查看当前选择
3. 使用 read_my_design 获取详细设计信息
```

### 示例 2：批量替换文本

```
1. 使用 scan_text_nodes 扫描所有文本节点
2. 使用 set_multiple_text_contents 批量更新
```

### 示例 3：创建组件

```
1. 使用 create_frame 创建框架
2. 使用 create_text 添加文本
3. 使用 set_fill_color 设置颜色
4. 使用 set_layout_mode 启用 Auto Layout
```

## 故障排除

### WebSocket 连接失败
- 确保 WebSocket 服务器正在运行
- 检查防火墙设置
- Windows WSL 用户需要设置 `hostname: "0.0.0.0"`

### MCP 服务器未加载
- 重启 Cursor
- 检查 `.cursor/mcp.json` 配置是否正确
- 确保 `bunx` 命令可用

### Figma 插件无法连接
- 确保 WebSocket 服务器运行在正确的端口
- 在插件中使用 `join_channel` 加入频道
- 检查浏览器控制台是否有错误

## 参考资源

- GitHub 仓库：https://github.com/grab/cursor-talk-to-figma-mcp
- MCP 文档：https://modelcontextprotocol.io/
- Figma 插件开发：https://www.figma.com/plugin-docs/

