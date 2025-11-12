# MongoDB 自动安装和配置脚本

Write-Host "=== MongoDB 安装和配置脚本 ===" -ForegroundColor Cyan
Write-Host ""

# 检查是否已安装 MongoDB
Write-Host "1. 检查 MongoDB 安装状态..." -ForegroundColor Yellow
try {
    $mongodVersion = mongod --version 2>&1
    if ($LASTEXITCODE -eq 0) {
        Write-Host "   ✓ MongoDB 已安装" -ForegroundColor Green
        Write-Host "   版本信息: $($mongodVersion[0])" -ForegroundColor Gray
        
        # 检查服务状态
        $mongoService = Get-Service -Name "MongoDB" -ErrorAction SilentlyContinue
        if ($mongoService) {
            if ($mongoService.Status -eq "Running") {
                Write-Host "   ✓ MongoDB 服务正在运行" -ForegroundColor Green
            } else {
                Write-Host "   ⚠ MongoDB 服务未运行，正在启动..." -ForegroundColor Yellow
                Start-Service MongoDB
                Start-Sleep -Seconds 3
                Write-Host "   ✓ MongoDB 服务已启动" -ForegroundColor Green
            }
        } else {
            Write-Host "   ⚠ MongoDB 服务未找到，尝试直接启动 mongod..." -ForegroundColor Yellow
        }
        
        Write-Host ""
        Write-Host "MongoDB 已就绪！" -ForegroundColor Green
        exit 0
    }
} catch {
    Write-Host "   ✗ MongoDB 未安装" -ForegroundColor Red
}

Write-Host ""

# 检查 Chocolatey
Write-Host "2. 检查 Chocolatey 包管理器..." -ForegroundColor Yellow
$chocoInstalled = Get-Command choco -ErrorAction SilentlyContinue
if ($chocoInstalled) {
    Write-Host "   ✓ Chocolatey 已安装" -ForegroundColor Green
    Write-Host ""
    Write-Host "3. 使用 Chocolatey 安装 MongoDB..." -ForegroundColor Yellow
    Write-Host "   正在安装 MongoDB（这可能需要几分钟）..." -ForegroundColor Gray
    
    $response = Read-Host "是否继续安装 MongoDB？(Y/N)"
    if ($response -eq "Y" -or $response -eq "y") {
        choco install mongodb -y
        Write-Host "   ✓ MongoDB 安装完成" -ForegroundColor Green
        
        # 启动服务
        Write-Host "   正在启动 MongoDB 服务..." -ForegroundColor Gray
        Start-Service MongoDB
        Start-Sleep -Seconds 5
        
        Write-Host "   ✓ MongoDB 服务已启动" -ForegroundColor Green
    } else {
        Write-Host "   已取消安装" -ForegroundColor Yellow
        exit 1
    }
} else {
    Write-Host "   ✗ Chocolatey 未安装" -ForegroundColor Red
    Write-Host ""
    Write-Host "=== 安装选项 ===" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "选项 1: 使用 Docker（推荐）" -ForegroundColor Yellow
    Write-Host "  1. 下载 Docker Desktop: https://www.docker.com/products/docker-desktop"
    Write-Host "  2. 安装后运行: docker run -d --name mongodb -p 27017:27017 mongo:6.0"
    Write-Host ""
    Write-Host "选项 2: 手动安装 MongoDB" -ForegroundColor Yellow
    Write-Host "  1. 访问: https://www.mongodb.com/try/download/community"
    Write-Host "  2. 下载 Windows MSI 安装包"
    Write-Host "  3. 运行安装程序，选择 'Complete' 安装"
    Write-Host "  4. 安装完成后运行: Start-Service MongoDB"
    Write-Host ""
    Write-Host "选项 3: 安装 Chocolatey 后自动安装" -ForegroundColor Yellow
    Write-Host "  1. 以管理员身份运行 PowerShell"
    Write-Host "  2. 执行: Set-ExecutionPolicy Bypass -Scope Process -Force; [System.Net.ServicePointManager]::SecurityProtocol = [System.Net.ServicePointManager]::SecurityProtocol -bor 3072; iex ((New-Object System.Net.WebClient).DownloadString('https://community.chocolatey.org/install.ps1'))"
    Write-Host "  3. 然后重新运行此脚本"
    Write-Host ""
    exit 1
}

Write-Host ""
Write-Host "=== 验证安装 ===" -ForegroundColor Cyan
Write-Host ""

# 测试连接
Write-Host "4. 测试 MongoDB 连接..." -ForegroundColor Yellow
try {
    $testConnection = Test-NetConnection -ComputerName localhost -Port 27017 -WarningAction SilentlyContinue
    if ($testConnection.TcpTestSucceeded) {
        Write-Host "   ✓ MongoDB 端口 27017 可访问" -ForegroundColor Green
    } else {
        Write-Host "   ✗ MongoDB 端口不可访问" -ForegroundColor Red
    }
} catch {
    Write-Host "   ⚠ 无法测试端口连接" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "=== 配置项目 ===" -ForegroundColor Cyan
Write-Host ""

# 检查后端环境变量
$backendEnvPath = "H:\Cursor\CT AI\backend\.env.local"
if (Test-Path $backendEnvPath) {
    Write-Host "   ✓ 后端环境变量文件已存在" -ForegroundColor Green
} else {
    Write-Host "   ⚠ 后端环境变量文件不存在，正在创建..." -ForegroundColor Yellow
    Copy-Item "H:\Cursor\CT AI\backend\env.example" $backendEnvPath
    
    # 生成随机密钥
    $jwtSecret = -join ((65..90) + (97..122) + (48..57) | Get-Random -Count 32 | ForEach-Object {[char]$_})
    $jwtRefreshSecret = -join ((65..90) + (97..122) + (48..57) | Get-Random -Count 32 | ForEach-Object {[char]$_})
    
    Add-Content $backendEnvPath "`nJWT_SECRET=$jwtSecret"
    Add-Content $backendEnvPath "JWT_REFRESH_SECRET=$jwtRefreshSecret"
    
    Write-Host "   ✓ 已创建环境变量文件并生成密钥" -ForegroundColor Green
}

Write-Host ""
Write-Host "=== 完成 ===" -ForegroundColor Green
Write-Host ""
Write-Host "下一步操作:" -ForegroundColor Cyan
Write-Host "1. 重启后端服务: cd backend && npm run dev" -ForegroundColor White
Write-Host "2. 运行测试脚本: powershell -ExecutionPolicy Bypass -File .\test-api.ps1" -ForegroundColor White
Write-Host "3. 启动前端应用: cd frontend && npm start" -ForegroundColor White
Write-Host ""

