# Cursor Talk to Figma MCP - WebSocket 服务器启动脚本
# 此脚本用于启动 WebSocket 服务器，使 Cursor 能够与 Figma 通信

Write-Host "======================================" -ForegroundColor Cyan
Write-Host "  Cursor Talk to Figma MCP" -ForegroundColor Cyan
Write-Host "  WebSocket 服务器启动" -ForegroundColor Cyan
Write-Host "======================================" -ForegroundColor Cyan
Write-Host ""

# 检查 Bun 是否安装
try {
    $bunVersion = bun --version 2>&1
    if ($LASTEXITCODE -ne 0) {
        throw "Bun not found"
    }
    Write-Host "✓ 检测到 Bun 版本: $bunVersion" -ForegroundColor Green
} catch {
    Write-Host "✗ 未检测到 Bun，正在安装..." -ForegroundColor Yellow
    powershell -c "irm bun.sh/install.ps1|iex"
    Write-Host "  请重启终端后再次运行此脚本" -ForegroundColor Yellow
    Read-Host "按 Enter 键退出"
    exit 1
}

Write-Host ""
Write-Host "正在启动 WebSocket 服务器..." -ForegroundColor Yellow
Write-Host ""
Write-Host "提示：" -ForegroundColor Cyan
Write-Host "  - 服务器启动后，请在 Figma 中运行 'Cursor MCP Plugin'" -ForegroundColor White
Write-Host "  - 在插件中使用 'join_channel' 命令连接" -ForegroundColor White
Write-Host "  - 保持此窗口打开以维持连接" -ForegroundColor White
Write-Host "  - 按 Ctrl+C 停止服务器" -ForegroundColor White
Write-Host ""

# 启动 WebSocket 服务器
try {
    bunx cursor-talk-to-figma-mcp@latest socket
} catch {
    Write-Host ""
    Write-Host "错误: 无法启动 WebSocket 服务器" -ForegroundColor Red
    Write-Host "请确保已安装 Bun 并且网络连接正常" -ForegroundColor Yellow
    Read-Host "按 Enter 键退出"
    exit 1
}

