# MongoDB Atlas 快速配置指南

## 步骤 1：创建 MongoDB Atlas 账户和集群

### 1.1 注册账户
1. 访问：https://www.mongodb.com/cloud/atlas/register
2. 使用邮箱注册（Google/GitHub 登录也可）
3. 完成邮箱验证

### 1.2 创建免费集群
1. 登录后点击 "Build a Database"
2. 选择 **FREE (M0)** 套餐
3. 选择云提供商和区域（建议选择离你最近的，如 `AWS` → `ap-southeast-1` 新加坡）
4. 集群名称保持默认或自定义（如 `Cluster0`）
5. 点击 "Create"

### 1.3 设置数据库访问
1. 创建用户：
   - Username: `ctai-user`（或自定义）
   - Password: 点击 "Autogenerate Secure Password" 或自定义（**请保存密码**）
   - 点击 "Create User"

2. 设置网络访问：
   - 选择 "Add My Current IP Address"（添加当前 IP）
   - 或选择 "Allow Access from Anywhere"（`0.0.0.0/0`，仅用于开发测试）

### 1.4 获取连接字符串
1. 点击 "Connect"
2. 选择 "Connect your application"
3. 选择 Driver: `Node.js`，Version: `5.5 or later`
4. 复制连接字符串（格式类似）：
   ```
   mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```

## 步骤 2：配置项目

### 2.1 更新连接字符串
将连接字符串中的 `<username>` 和 `<password>` 替换为实际值，并添加数据库名：

```
mongodb+srv://ctai-user:your-password@cluster0.xxxxx.mongodb.net/ct-ai?retryWrites=true&w=majority
```

### 2.2 更新后端环境变量
编辑 `backend/.env.local` 文件：

```env
NODE_ENV=development

# MongoDB Atlas 连接字符串
MONGODB_URI=mongodb+srv://ctai-user:your-password@cluster0.xxxxx.mongodb.net/ct-ai?retryWrites=true&w=majority
MONGODB_DB_NAME=ct-ai

# JWT 配置（如果还没有，使用下面的命令生成）
JWT_SECRET=your-secure-secret-key-min-16-chars
JWT_EXPIRES_IN=15m
JWT_REFRESH_SECRET=your-refresh-secret-key-min-16-chars
JWT_REFRESH_EXPIRES_IN=7d
```

## 步骤 3：生成 JWT 密钥（如果还没有）

在 PowerShell 中运行：

```powershell
# 生成 JWT_SECRET（32 字符）
-join ((65..90) + (97..122) + (48..57) | Get-Random -Count 32 | ForEach-Object {[char]$_})

# 生成 JWT_REFRESH_SECRET（32 字符）
-join ((65..90) + (97..122) + (48..57) | Get-Random -Count 32 | ForEach-Object {[char]$_})
```

将生成的密钥复制到 `.env.local` 文件中。

## 步骤 4：测试连接

### 4.1 重启后端服务
```powershell
cd backend
npm run dev
```

### 4.2 验证连接
访问：http://localhost:3000/api/health

应该返回：
```json
{
  "status": "ok",
  "environment": "development",
  "database": "connected",
  "timestamp": "2025-11-10T..."
}
```

### 4.3 运行完整测试
```powershell
cd "H:\Cursor\CT AI"
powershell -ExecutionPolicy Bypass -File .\test-api.ps1
```

## 常见问题

### 问题 1：连接超时
- 检查网络访问列表是否包含你的 IP
- 验证连接字符串中的用户名和密码是否正确
- 确认集群状态为 "Running"

### 问题 2：认证失败
- 检查用户名和密码是否正确（注意特殊字符需要 URL 编码）
- 确认数据库用户已创建并激活

### 问题 3：SSL/TLS 错误
- MongoDB Atlas 默认使用 SSL，确保连接字符串包含 `?retryWrites=true&w=majority`
- Node.js 驱动会自动处理 SSL 连接

## 下一步

配置完成后：
1. ✅ 运行测试脚本验证所有 API
2. ✅ 启动前端应用测试完整功能
3. ✅ 验证模块和提示词数据是否正确插入数据库
