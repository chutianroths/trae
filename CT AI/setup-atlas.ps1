# MongoDB Atlas 配置脚本

Write-Host "=== MongoDB Atlas 配置向导 ===" -ForegroundColor Cyan
Write-Host ""

Write-Host "步骤 1: 创建 MongoDB Atlas 账户" -ForegroundColor Yellow
Write-Host "1. 访问: https://www.mongodb.com/cloud/atlas/register" -ForegroundColor White
Write-Host "2. 注册免费账户（使用邮箱注册）" -ForegroundColor White
Write-Host "3. 创建免费集群（选择 M0 Free Tier）" -ForegroundColor White
Write-Host "4. 等待集群创建完成（约 3-5 分钟）" -ForegroundColor White
Write-Host ""

Write-Host "步骤 2: 配置数据库访问" -ForegroundColor Yellow
Write-Host "1. 在 Atlas 控制台，点击 'Database Access'" -ForegroundColor White
Write-Host "2. 点击 'Add New Database User'" -ForegroundColor White
Write-Host "3. 选择 'Password' 认证方式" -ForegroundColor White
Write-Host "4. 设置用户名和密码（请记住这些信息）" -ForegroundColor White
Write-Host "5. 权限选择 'Atlas admin' 或 'Read and write to any database'" -ForegroundColor White
Write-Host "6. 点击 'Add User'" -ForegroundColor White
Write-Host ""

Write-Host "步骤 3: 配置网络访问" -ForegroundColor Yellow
Write-Host "1. 在 Atlas 控制台，点击 'Network Access'" -ForegroundColor White
Write-Host "2. 点击 'Add IP Address'" -ForegroundColor White
Write-Host "3. 选择 'Allow Access from Anywhere' (0.0.0.0/0) 用于开发" -ForegroundColor White
Write-Host "   或添加当前 IP 地址" -ForegroundColor White
Write-Host "4. 点击 'Confirm'" -ForegroundColor White
Write-Host ""

Write-Host "步骤 4: 获取连接字符串" -ForegroundColor Yellow
Write-Host "1. 在 Atlas 控制台，点击 'Connect'" -ForegroundColor White
Write-Host "2. 选择 'Connect your application'" -ForegroundColor White
Write-Host "3. Driver 选择 'Node.js'，Version 选择最新版本" -ForegroundColor White
Write-Host "4. 复制连接字符串（类似：mongodb+srv://username:password@cluster.mongodb.net/...）" -ForegroundColor White
Write-Host ""

$connectionString = Read-Host "请粘贴 MongoDB Atlas 连接字符串"

if ([string]::IsNullOrWhiteSpace($connectionString)) {
    Write-Host "连接字符串不能为空！" -ForegroundColor Red
    exit 1
}

# 解析连接字符串
if ($connectionString -match "mongodb\+srv://(.+):(.+)@(.+)/(.+)\?") {
    $username = $matches[1]
    $password = $matches[2]
    $cluster = $matches[3]
    $database = $matches[4]
    
    # 构建完整的连接字符串，包含数据库名
    $fullConnectionString = $connectionString
    if ($fullConnectionString -notmatch "/ct-ai") {
        $fullConnectionString = $fullConnectionString -replace "/([^?]+)\?", "/ct-ai?"
        if ($fullConnectionString -notmatch "\?") {
            $fullConnectionString = $fullConnectionString + "?retryWrites=true&w=majority"
        }
    }
} else {
    Write-Host "连接字符串格式不正确，请检查！" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "步骤 5: 更新项目配置..." -ForegroundColor Yellow

# 检查并创建 .env.local
$envPath = "H:\Cursor\CT AI\backend\.env.local"
$envExamplePath = "H:\Cursor\CT AI\backend\env.example"

if (!(Test-Path $envPath)) {
    Write-Host "   创建 .env.local 文件..." -ForegroundColor Gray
    Copy-Item $envExamplePath $envPath
}

# 读取现有配置
$envContent = Get-Content $envPath -Raw

# 生成随机密钥（如果不存在）
if ($envContent -notmatch "JWT_SECRET=") {
    $jwtSecret = -join ((65..90) + (97..122) + (48..57) | Get-Random -Count 32 | ForEach-Object {[char]$_})
    $jwtRefreshSecret = -join ((65..90) + (97..122) + (48..57) | Get-Random -Count 32 | ForEach-Object {[char]$_})
    
    Add-Content $envPath "`n# Auth configuration"
    Add-Content $envPath "JWT_SECRET=$jwtSecret"
    Add-Content $envPath "JWT_EXPIRES_IN=15m"
    Add-Content $envPath "JWT_REFRESH_SECRET=$jwtRefreshSecret"
    Add-Content $envPath "JWT_REFRESH_EXPIRES_IN=7d"
}

# 更新 MongoDB URI
$envContent = Get-Content $envPath
$updatedContent = $envContent | ForEach-Object {
    if ($_ -match "^MONGODB_URI=") {
        "MONGODB_URI=$fullConnectionString"
    } elseif ($_ -match "^MONGODB_DB_NAME=") {
        "MONGODB_DB_NAME=ct-ai"
    } else {
        $_
    }
}

# 如果 MONGODB_URI 不存在，添加它
if (($updatedContent | Select-String "MONGODB_URI=") -eq $null) {
    $updatedContent = @($updatedContent | Where-Object { $_ -notmatch "^# Database configuration" })
    $dbConfigIndex = 0
    for ($i = 0; $i -lt $updatedContent.Length; $i++) {
        if ($updatedContent[$i] -match "^# Database configuration") {
            $dbConfigIndex = $i
            break
        }
    }
    $updatedContent = $updatedContent[0..$dbConfigIndex] + "MONGODB_URI=$fullConnectionString" + "MONGODB_DB_NAME=ct-ai" + $updatedContent[($dbConfigIndex+1)..($updatedContent.Length-1)]
}

$updatedContent | Set-Content $envPath

Write-Host "   ✓ 配置文件已更新" -ForegroundColor Green
Write-Host ""

Write-Host "步骤 6: 测试连接..." -ForegroundColor Yellow

# 等待用户确认
Write-Host ""
Write-Host "配置完成！" -ForegroundColor Green
Write-Host ""
Write-Host "下一步操作:" -ForegroundColor Cyan
Write-Host "1. 重启后端服务: cd backend && npm run dev" -ForegroundColor White
Write-Host "2. 等待服务启动后，运行测试: powershell -ExecutionPolicy Bypass -File .\test-api.ps1" -ForegroundColor White
Write-Host "3. 如果测试通过，启动前端: cd frontend && npm start" -ForegroundColor White
Write-Host ""

