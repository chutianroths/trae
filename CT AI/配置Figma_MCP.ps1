# 配置 Cursor Talk to Figma MCP
# 此脚本将更新 .cursor/mcp.json 文件，添加 TalkToFigma MCP 服务器配置

$mcpConfigPath = ".cursor\mcp.json"
$mcpExamplePath = ".cursor\mcp.json.example"

Write-Host "======================================" -ForegroundColor Cyan
Write-Host "  配置 Cursor Talk to Figma MCP" -ForegroundColor Cyan
Write-Host "======================================" -ForegroundColor Cyan
Write-Host ""

# 检查示例文件是否存在
if (-not (Test-Path $mcpExamplePath)) {
    Write-Host "✗ 未找到 $mcpExamplePath" -ForegroundColor Red
    Write-Host "  请确保在项目根目录运行此脚本" -ForegroundColor Yellow
    Read-Host "按 Enter 键退出"
    exit 1
}

# 读取现有配置或创建新配置
if (Test-Path $mcpConfigPath) {
    Write-Host "✓ 找到现有 MCP 配置" -ForegroundColor Green
    $config = Get-Content $mcpConfigPath -Raw | ConvertFrom-Json
} else {
    Write-Host "✓ 从示例文件创建新配置" -ForegroundColor Green
    $config = Get-Content $mcpExamplePath -Raw | ConvertFrom-Json
}

# 检查是否已存在 TalkToFigma 配置
if ($config.mcpServers.PSObject.Properties.Name -contains "TalkToFigma") {
    Write-Host "✓ TalkToFigma MCP 服务器已配置" -ForegroundColor Green
} else {
    Write-Host "正在添加 TalkToFigma MCP 服务器配置..." -ForegroundColor Yellow
    
    # 添加 TalkToFigma 配置
    $talkToFigmaConfig = @{
        command = "bunx"
        args = @("cursor-talk-to-figma-mcp@latest")
    }
    
    $config.mcpServers | Add-Member -MemberType NoteProperty -Name "TalkToFigma" -Value $talkToFigmaConfig -Force
    
    # 保存配置
    $config | ConvertTo-Json -Depth 10 | Out-File -FilePath $mcpConfigPath -Encoding UTF8 -Force
    
    Write-Host "✓ TalkToFigma MCP 服务器配置已添加" -ForegroundColor Green
}

Write-Host ""
Write-Host "配置完成！" -ForegroundColor Green
Write-Host ""
Write-Host "下一步：" -ForegroundColor Cyan
Write-Host "  1. 重启 Cursor 以加载新的 MCP 配置" -ForegroundColor White
Write-Host "  2. 运行 '启动Figma_MCP_WebSocket.ps1' 启动 WebSocket 服务器" -ForegroundColor White
Write-Host "  3. 在 Figma 中安装并运行 'Cursor MCP Plugin'" -ForegroundColor White
Write-Host "  4. 在插件中使用 'join_channel' 连接" -ForegroundColor White
Write-Host ""
Write-Host "详细说明请查看: docs/图片编辑免费模型/FIGMA_MCP_SETUP.md" -ForegroundColor Gray
Write-Host ""

Read-Host "按 Enter 键退出"

