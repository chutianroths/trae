# 验证 Cursor Talk to Figma MCP 配置

Write-Host "======================================" -ForegroundColor Cyan
Write-Host "  验证 Cursor Talk to Figma MCP 配置" -ForegroundColor Cyan
Write-Host "======================================" -ForegroundColor Cyan
Write-Host ""

$allGood = $true

# 1. 检查 Bun
Write-Host "1. 检查 Bun..." -ForegroundColor Yellow
try {
    $bunVersion = bun --version 2>&1
    if ($LASTEXITCODE -eq 0) {
        Write-Host "   ✓ Bun 已安装: $bunVersion" -ForegroundColor Green
    } else {
        throw "Bun not found"
    }
} catch {
    Write-Host "   ✗ Bun 未安装" -ForegroundColor Red
    Write-Host "   请运行: powershell -c `"irm bun.sh/install.ps1|iex`"" -ForegroundColor Yellow
    $allGood = $false
}

Write-Host ""

# 2. 检查 MCP 配置文件
Write-Host "2. 检查 MCP 配置..." -ForegroundColor Yellow
if (Test-Path ".cursor\mcp.json") {
    Write-Host "   ✓ MCP 配置文件存在" -ForegroundColor Green
    
    try {
        $config = Get-Content ".cursor\mcp.json" -Raw | ConvertFrom-Json
        
        if ($config.mcpServers.PSObject.Properties.Name -contains "TalkToFigma") {
            Write-Host "   ✓ TalkToFigma 配置已添加" -ForegroundColor Green
            Write-Host "     命令: $($config.mcpServers.TalkToFigma.command)" -ForegroundColor Gray
            Write-Host "     参数: $($config.mcpServers.TalkToFigma.args -join ' ')" -ForegroundColor Gray
        } else {
            Write-Host "   ✗ TalkToFigma 配置未找到" -ForegroundColor Red
            Write-Host "   请运行: powershell -ExecutionPolicy Bypass -File `"配置Figma_MCP.ps1`"" -ForegroundColor Yellow
            $allGood = $false
        }
    } catch {
        Write-Host "   ✗ MCP 配置文件格式错误: $_" -ForegroundColor Red
        $allGood = $false
    }
} else {
    Write-Host "   ✗ MCP 配置文件不存在" -ForegroundColor Red
    Write-Host "   请运行: powershell -ExecutionPolicy Bypass -File `"配置Figma_MCP.ps1`"" -ForegroundColor Yellow
    $allGood = $false
}

Write-Host ""

# 3. 检查 WebSocket 服务器端口
Write-Host "3. 检查 WebSocket 服务器端口..." -ForegroundColor Yellow
$port = 8765  # 默认端口，根据实际项目可能不同
$connection = Test-NetConnection -ComputerName localhost -Port $port -WarningAction SilentlyContinue -InformationLevel Quiet 2>$null
if ($connection) {
    Write-Host "   ⚠ 端口 $port 已被占用（可能已有服务器在运行）" -ForegroundColor Yellow
} else {
    Write-Host "   ✓ 端口 $port 可用" -ForegroundColor Green
}

Write-Host ""

# 总结
Write-Host "======================================" -ForegroundColor Cyan
if ($allGood) {
    Write-Host "✓ 配置验证通过！" -ForegroundColor Green
    Write-Host ""
    Write-Host "下一步操作：" -ForegroundColor Cyan
    Write-Host "  1. 启动 WebSocket 服务器：" -ForegroundColor White
    Write-Host "     powershell -ExecutionPolicy Bypass -File `"启动Figma_MCP_WebSocket.ps1`"" -ForegroundColor Gray
    Write-Host ""
    Write-Host "  2. 重启 Cursor 以加载 MCP 配置" -ForegroundColor White
    Write-Host ""
    Write-Host "  3. 在 Figma 中安装 'Cursor MCP Plugin' 插件" -ForegroundColor White
    Write-Host ""
    Write-Host "  4. 在插件中使用 'join_channel' 连接" -ForegroundColor White
} else {
    Write-Host "✗ 配置验证失败，请修复上述问题后重试" -ForegroundColor Red
}
Write-Host "======================================" -ForegroundColor Cyan
Write-Host ""

Read-Host "按 Enter 键退出"

