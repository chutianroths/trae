# CT AI 应用启动脚本
# 此脚本用于启动后端和前端服务，并自动打开浏览器

Write-Host "======================================" -ForegroundColor Cyan
Write-Host "      CT AI 智能图像编辑应用" -ForegroundColor Cyan
Write-Host "======================================" -ForegroundColor Cyan
Write-Host ""

$scriptPath = Split-Path -Parent $MyInvocation.MyCommand.Path
$backendPath = Join-Path $scriptPath "backend"
$frontendPath = Join-Path $scriptPath "ct-ai-web"

# 检查路径是否存在
if (-not (Test-Path $backendPath)) {
    Write-Host "错误: 找不到后端目录: $backendPath" -ForegroundColor Red
    Read-Host "按 Enter 键退出"
    exit 1
}

if (-not (Test-Path $frontendPath)) {
    Write-Host "错误: 找不到前端目录: $frontendPath" -ForegroundColor Red
    Read-Host "按 Enter 键退出"
    exit 1
}

# 检查 Node.js 是否安装
try {
    $nodeVersion = node --version
    Write-Host "检测到 Node.js 版本: $nodeVersion" -ForegroundColor Green
} catch {
    Write-Host "错误: 未检测到 Node.js，请先安装 Node.js" -ForegroundColor Red
    Read-Host "按 Enter 键退出"
    exit 1
}

Write-Host ""
Write-Host "正在启动服务..." -ForegroundColor Yellow
Write-Host ""

# 启动后端服务
Write-Host "1. 启动后端服务 (端口 3000)..." -ForegroundColor Cyan
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$backendPath'; Write-Host '后端服务正在启动...' -ForegroundColor Green; npm run dev" -WindowStyle Minimized

# 等待后端服务启动
Write-Host "   等待后端服务启动..." -ForegroundColor Gray
Start-Sleep -Seconds 3

# 检查后端服务是否运行
$backendRunning = $false
for ($i = 0; $i -lt 10; $i++) {
    try {
        $response = Invoke-WebRequest -Uri "http://localhost:3000/api/health" -TimeoutSec 2 -ErrorAction SilentlyContinue
        if ($response.StatusCode -eq 200) {
            $backendRunning = $true
            Write-Host "   ✓ 后端服务已启动" -ForegroundColor Green
            break
        }
    } catch {
        Start-Sleep -Seconds 1
    }
}

if (-not $backendRunning) {
    Write-Host "   ⚠ 后端服务可能未完全启动，但将继续启动前端" -ForegroundColor Yellow
}

Write-Host ""

# 启动前端服务
Write-Host "2. 启动前端服务 (端口 5173)..." -ForegroundColor Cyan
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$frontendPath'; Write-Host '前端服务正在启动...' -ForegroundColor Green; npm run dev" -WindowStyle Minimized

# 等待前端服务启动
Write-Host "   等待前端服务启动..." -ForegroundColor Gray
Start-Sleep -Seconds 5

# 打开浏览器
Write-Host ""
Write-Host "3. 打开浏览器..." -ForegroundColor Cyan
try {
    Start-Process "http://localhost:5173"
    Write-Host "   ✓ 浏览器已打开" -ForegroundColor Green
} catch {
    Write-Host "   ⚠ 无法自动打开浏览器，请手动访问: http://localhost:5173" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "======================================" -ForegroundColor Cyan
Write-Host "     服务启动完成！" -ForegroundColor Green
Write-Host "======================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "前端地址: http://localhost:5173" -ForegroundColor White
Write-Host "后端地址: http://localhost:3000" -ForegroundColor White
Write-Host ""
Write-Host "提示: 请保持此窗口打开，关闭此窗口不会停止服务" -ForegroundColor Yellow
Write-Host "      要停止服务，请关闭相应的 PowerShell 窗口" -ForegroundColor Yellow
Write-Host ""

Read-Host "按 Enter 键退出此窗口（服务将继续运行）"

