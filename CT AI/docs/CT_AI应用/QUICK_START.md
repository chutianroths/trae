# CT AI 快速启动指南

## 方案一：使用 MongoDB Atlas（推荐，最快）

### 1. 创建免费 MongoDB Atlas 账户
1. 访问：https://www.mongodb.com/cloud/atlas/register
2. 注册免费账户
3. 创建免费集群（M0，512MB）

### 2. 获取连接字符串
1. 在 Atlas 控制台点击 "Connect"
2. 选择 "Connect your application"
3. 复制连接字符串（类似：`mongodb+srv://username:password@cluster.mongodb.net/?retryWrites=true&w=majority`）

### 3. 配置项目
编辑 `backend/.env.local`：
```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/ct-ai?retryWrites=true&w=majority
MONGODB_DB_NAME=ct-ai
JWT_SECRET=your-secure-secret-key-min-16-chars
JWT_EXPIRES_IN=15m
JWT_REFRESH_SECRET=your-refresh-secret-key-min-16-chars
JWT_REFRESH_EXPIRES_IN=7d
```

### 4. 启动服务
```powershell
# 后端
cd backend
npm run dev

# 前端（新终端）
cd frontend
npm start
```

## 方案二：本地安装 MongoDB

### 使用安装脚本（需要管理员权限）
```powershell
powershell -ExecutionPolicy Bypass -File .\setup-mongodb.ps1
```

### 手动安装
1. 下载：https://www.mongodb.com/try/download/community
2. 安装 MongoDB Community Server
3. 启动服务：`Start-Service MongoDB`

## 验证安装

### 1. 测试后端 API
```powershell
powershell -ExecutionPolicy Bypass -File .\test-api.ps1
```

### 2. 检查健康状态
访问：http://localhost:3000/api/health

应该返回：
```json
{
  "status": "ok",
  "environment": "development",
  "database": "connected",
  "timestamp": "..."
}
```

## 常见问题

### 问题：连接超时
- 检查防火墙设置
- 验证连接字符串格式
- 确认 MongoDB 服务运行中

### 问题：认证失败
- 检查 JWT_SECRET 和 JWT_REFRESH_SECRET 是否已设置
- 确保密钥长度至少 16 个字符

