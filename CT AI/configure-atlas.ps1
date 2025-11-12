# MongoDB Atlas 配置脚本

Write-Host "=== MongoDB Atlas 配置助手 ===" -ForegroundColor Cyan
Write-Host ""

$backendEnvPath = "H:\Cursor\CT AI\backend\.env.local"
$envExamplePath = "H:\Cursor\CT AI\backend\env.example"

# 检查 .env.local 是否存在
if (-not (Test-Path $backendEnvPath)) {
    Write-Host "创建 .env.local 文件..." -ForegroundColor Yellow
    Copy-Item $envExamplePath $backendEnvPath
    Write-Host "✓ 已创建 .env.local 文件" -ForegroundColor Green
} else {
    Write-Host "✓ .env.local 文件已存在" -ForegroundColor Green
}

Write-Host ""
Write-Host "请按照以下步骤操作：" -ForegroundColor Yellow
Write-Host ""
Write-Host "1. 访问 MongoDB Atlas: https://www.mongodb.com/cloud/atlas/register" -ForegroundColor White
Write-Host "2. 注册账户并创建免费集群 (M0)" -ForegroundColor White
Write-Host "3. 设置数据库用户和网络访问" -ForegroundColor White
Write-Host "4. 获取连接字符串" -ForegroundColor White
Write-Host ""
Write-Host "连接字符串格式示例：" -ForegroundColor Cyan
Write-Host "mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/ct-ai?retryWrites=true&w=majority" -ForegroundColor Gray
Write-Host ""

# 提示用户输入连接字符串
$mongodbUri = Read-Host "请输入 MongoDB Atlas 连接字符串（包含用户名、密码和数据库名）"

if ([string]::IsNullOrWhiteSpace($mongodbUri)) {
    Write-Host "未输入连接字符串，跳过配置" -ForegroundColor Yellow
    exit 0
}

# 验证连接字符串格式
if ($mongodbUri -notmatch "mongodb\+srv://") {
    Write-Host "⚠ 警告：连接字符串格式可能不正确" -ForegroundColor Yellow
    Write-Host "   应该以 'mongodb+srv://' 开头" -ForegroundColor Gray
    $continue = Read-Host "是否继续？(Y/N)"
    if ($continue -ne "Y" -and $continue -ne "y") {
        exit 0
    }
}

# 读取现有 .env.local 文件
$envContent = Get-Content $backendEnvPath -Raw

# 更新或添加 MONGODB_URI
if ($envContent -match "MONGODB_URI=.*") {
    $envContent = $envContent -replace "MONGODB_URI=.*", "MONGODB_URI=$mongodbUri"
} else {
    $envContent += "`nMONGODB_URI=$mongodbUri`n"
}

# 确保 MONGODB_DB_NAME 存在
if ($envContent -notmatch "MONGODB_DB_NAME=.*") {
    $envContent += "MONGODB_DB_NAME=ct-ai`n"
}

# 生成 JWT 密钥（如果不存在）
if ($envContent -notmatch "JWT_SECRET=.*") {
    Write-Host ""
    Write-Host "生成 JWT 密钥..." -ForegroundColor Yellow
    $jwtSecret = -join ((65..90) + (97..122) + (48..57) | Get-Random -Count 32 | ForEach-Object {[char]$_})
    $jwtRefreshSecret = -join ((65..90) + (97..122) + (48..57) | Get-Random -Count 32 | ForEach-Object {[char]$_})
    
    $envContent += "`nJWT_SECRET=$jwtSecret`n"
    $envContent += "JWT_EXPIRES_IN=15m`n"
    $envContent += "JWT_REFRESH_SECRET=$jwtRefreshSecret`n"
    $envContent += "JWT_REFRESH_EXPIRES_IN=7d`n"
    
    Write-Host "✓ 已生成 JWT 密钥" -ForegroundColor Green
}

# 写入文件
Set-Content $backendEnvPath $envContent -NoNewline

Write-Host ""
Write-Host "=== 配置完成 ===" -ForegroundColor Green
Write-Host ""
Write-Host "已更新以下配置：" -ForegroundColor Cyan
Write-Host "  ✓ MONGODB_URI" -ForegroundColor Green
Write-Host "  ✓ MONGODB_DB_NAME" -ForegroundColor Green
Write-Host "  ✓ JWT_SECRET 和 JWT_REFRESH_SECRET（如需要）" -ForegroundColor Green
Write-Host ""
Write-Host "下一步操作：" -ForegroundColor Yellow
Write-Host "1. 重启后端服务: cd backend && npm run dev" -ForegroundColor White
Write-Host "2. 测试连接: 访问 http://localhost:3000/api/health" -ForegroundColor White
Write-Host "3. 运行完整测试: powershell -ExecutionPolicy Bypass -File .\test-api.ps1" -ForegroundColor White
Write-Host ""

