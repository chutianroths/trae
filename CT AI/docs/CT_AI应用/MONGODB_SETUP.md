# MongoDB 安装与配置指南

## 方法一：使用 Docker（推荐，最简单）

### 1. 安装 Docker Desktop
- 下载地址：https://www.docker.com/products/docker-desktop
- 安装后启动 Docker Desktop

### 2. 启动 MongoDB 容器
```powershell
docker run -d `
  --name mongodb `
  -p 27017:27017 `
  -v mongodb-data:/data/db `
  mongo:6.0
```

### 3. 验证 MongoDB 运行
```powershell
docker ps | Select-String mongodb
```

### 4. 测试连接
```powershell
docker exec -it mongodb mongosh
```

## 方法二：Windows 本地安装

### 1. 下载 MongoDB Community Server
- 访问：https://www.mongodb.com/try/download/community
- 选择 Windows 版本，下载 MSI 安装包

### 2. 安装步骤
1. 运行安装程序
2. 选择 "Complete" 完整安装
3. 选择 "Install MongoDB as a Service"
4. 使用默认端口 27017
5. 完成安装

### 3. 启动 MongoDB 服务
```powershell
# 检查服务状态
Get-Service MongoDB

# 如果服务未启动，启动服务
Start-Service MongoDB
```

### 4. 验证安装
```powershell
# 测试连接
mongosh mongodb://localhost:27017
```

## 方法三：使用 Chocolatey（如果已安装）

```powershell
# 安装 MongoDB
choco install mongodb

# 启动服务
Start-Service MongoDB
```

## 配置项目连接

### 1. 确保后端 `.env.local` 配置正确
```env
MONGODB_URI=mongodb://localhost:27017
MONGODB_DB_NAME=ct-ai
JWT_SECRET=your-secure-secret-key-here-min-16-chars
JWT_EXPIRES_IN=15m
JWT_REFRESH_SECRET=your-refresh-secret-key-here-min-16-chars
JWT_REFRESH_EXPIRES_IN=7d
```

### 2. 重启后端服务
```powershell
cd backend
npm run dev
```

### 3. 验证连接
访问 `http://localhost:3000/api/health`，应该返回：
```json
{
  "status": "ok",
  "environment": "development",
  "database": "connected",
  "timestamp": "..."
}
```

## 快速测试脚本

安装 MongoDB 后，运行以下命令测试所有功能：

```powershell
cd "H:\Cursor\CT AI"
powershell -ExecutionPolicy Bypass -File .\test-api.ps1
```

## 常见问题

### 问题1：端口 27017 被占用
```powershell
# 查找占用端口的进程
Get-NetTCPConnection -LocalPort 27017 | Select-Object OwningProcess

# 结束进程（替换 PID）
Stop-Process -Id <PID> -Force
```

### 问题2：MongoDB 服务无法启动
- 检查日志文件：`C:\Program Files\MongoDB\Server\6.0\log\mongod.log`
- 确保数据目录存在且有写入权限：`C:\data\db`

### 问题3：连接超时
- 检查防火墙设置
- 确认 MongoDB 服务正在运行
- 验证连接字符串格式

## 下一步

MongoDB 安装并启动后：
1. ✅ 运行测试脚本验证所有 API 接口
2. ✅ 启动前端应用测试完整功能
3. ✅ 验证模块和提示词数据是否正确插入

