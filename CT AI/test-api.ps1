# CT AI 项目功能测试脚本

Write-Host "=== CT AI 项目功能测试 ===" -ForegroundColor Cyan
Write-Host ""

# 测试后端健康检查
Write-Host "1. 测试后端健康检查接口..." -ForegroundColor Yellow
try {
    $healthResponse = Invoke-WebRequest -Uri "http://localhost:3000/api/health" -Method GET -ErrorAction Stop
    Write-Host "   ✓ 健康检查接口响应: $($healthResponse.StatusCode)" -ForegroundColor Green
    $healthData = $healthResponse.Content | ConvertFrom-Json
    Write-Host "   状态: $($healthData.status)" -ForegroundColor Gray
    Write-Host "   环境: $($healthData.environment)" -ForegroundColor Gray
    Write-Host "   数据库: $($healthData.database)" -ForegroundColor $(if ($healthData.database -eq "connected") { "Green" } else { "Yellow" })
} catch {
    Write-Host "   ✗ 健康检查失败: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host ""

# 测试模块列表接口
Write-Host "2. 测试模块列表接口..." -ForegroundColor Yellow
try {
    $modulesResponse = Invoke-WebRequest -Uri "http://localhost:3000/api/modules" -Method GET -ErrorAction Stop
    Write-Host "   ✓ 模块列表接口响应: $($modulesResponse.StatusCode)" -ForegroundColor Green
    $modulesData = $modulesResponse.Content | ConvertFrom-Json
    if ($modulesData.success) {
        Write-Host "   模块数量: $($modulesData.data.items.Count)" -ForegroundColor Gray
        Write-Host "   分页信息: 第 $($modulesData.data.pagination.page) 页，共 $($modulesData.data.pagination.total) 条" -ForegroundColor Gray
    }
} catch {
    Write-Host "   ✗ 模块列表接口失败: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host ""

# 测试提示词列表接口
Write-Host "3. 测试提示词列表接口..." -ForegroundColor Yellow
try {
    $promptsResponse = Invoke-WebRequest -Uri "http://localhost:3000/api/prompts" -Method GET -ErrorAction Stop
    Write-Host "   ✓ 提示词列表接口响应: $($promptsResponse.StatusCode)" -ForegroundColor Green
    $promptsData = $promptsResponse.Content | ConvertFrom-Json
    if ($promptsData.success) {
        Write-Host "   提示词数量: $($promptsData.data.items.Count)" -ForegroundColor Gray
        Write-Host "   分页信息: 第 $($promptsData.data.pagination.page) 页，共 $($promptsData.data.pagination.total) 条" -ForegroundColor Gray
    }
} catch {
    Write-Host "   ✗ 提示词列表接口失败: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host ""

# 测试用户注册接口
Write-Host "4. 测试用户注册接口..." -ForegroundColor Yellow
try {
    $registerBody = @{
        name = "测试用户"
        email = "test@example.com"
        password = "test123456"
    } | ConvertTo-Json
    
    $registerResponse = Invoke-WebRequest -Uri "http://localhost:3000/api/auth/register" -Method POST -Body $registerBody -ContentType "application/json" -ErrorAction Stop
    Write-Host "   ✓ 用户注册接口响应: $($registerResponse.StatusCode)" -ForegroundColor Green
    $registerData = $registerResponse.Content | ConvertFrom-Json
    if ($registerData.success) {
        Write-Host "   用户ID: $($registerData.data.user.id)" -ForegroundColor Gray
        Write-Host "   用户角色: $($registerData.data.user.role)" -ForegroundColor Gray
    }
} catch {
    $errorMsg = $_.Exception.Message
    if ($errorMsg -like "*400*" -or $errorMsg -like "*Email already*") {
        Write-Host "   ⚠ 用户已存在（预期行为）" -ForegroundColor Yellow
    } else {
        Write-Host "   ✗ 用户注册接口失败: $errorMsg" -ForegroundColor Red
    }
}

Write-Host ""

# 测试用户登录接口
Write-Host "5. 测试用户登录接口..." -ForegroundColor Yellow
try {
    $loginBody = @{
        email = "test@example.com"
        password = "test123456"
    } | ConvertTo-Json
    
    $loginResponse = Invoke-WebRequest -Uri "http://localhost:3000/api/auth/login" -Method POST -Body $loginBody -ContentType "application/json" -ErrorAction Stop
    Write-Host "   ✓ 用户登录接口响应: $($loginResponse.StatusCode)" -ForegroundColor Green
    $loginData = $loginResponse.Content | ConvertFrom-Json
    if ($loginData.success) {
        Write-Host "   登录成功，已获取访问令牌" -ForegroundColor Gray
        $global:accessToken = $loginData.data.tokens.accessToken
    }
} catch {
    Write-Host "   ✗ 用户登录接口失败: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host ""

# 测试获取当前用户接口
Write-Host "6. 测试获取当前用户接口..." -ForegroundColor Yellow
if ($global:accessToken) {
    try {
        $headers = @{
            "Authorization" = "Bearer $global:accessToken"
        }
        $meResponse = Invoke-WebRequest -Uri "http://localhost:3000/api/auth/me" -Method GET -Headers $headers -ErrorAction Stop
        Write-Host "   ✓ 获取当前用户接口响应: $($meResponse.StatusCode)" -ForegroundColor Green
        $meData = $meResponse.Content | ConvertFrom-Json
        if ($meData.success) {
            Write-Host "   用户邮箱: $($meData.data.email)" -ForegroundColor Gray
            Write-Host "   用户名称: $($meData.data.name)" -ForegroundColor Gray
        }
    } catch {
        Write-Host "   ✗ 获取当前用户接口失败: $($_.Exception.Message)" -ForegroundColor Red
    }
} else {
    Write-Host "   ⚠ 跳过测试（需要先登录）" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "=== 测试完成 ===" -ForegroundColor Cyan

