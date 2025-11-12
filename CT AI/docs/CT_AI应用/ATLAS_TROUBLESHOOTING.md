# MongoDB Atlas 连接问题排查指南

## 当前问题：SSL 连接错误

**错误信息**：
```
tlsv1 alert internal error: SSL alert number 80
```

## 排查步骤

### 1. 确认集群状态
- 登录 MongoDB Atlas 控制台
- 检查集群状态是否为 **"Running"**（绿色）
- 如果状态为 "Creating" 或 "Paused"，请等待集群完全就绪

### 2. 确认数据库用户已创建
- 在 Atlas 控制台，进入 **Database Access**
- 确认用户 `chutianroths_db_user` 已存在且状态为 **Active**
- 如果用户未创建，请完成创建流程

### 3. 确认网络访问设置
- 在 Atlas 控制台，进入 **Network Access**
- 确认当前 IP `5.34.217.55` 已在访问列表中
- 如果未添加，点击 "Add IP Address" → "Add Current IP Address"
- 等待 1-2 分钟让设置生效

### 4. 验证连接字符串格式
当前连接字符串：
```
mongodb+srv://chutianroths_db_user:NOgRGcdFDfbDELJO@cluster0.np4pjfy.mongodb.net/ct-ai
```

**检查要点**：
- ✅ 用户名和密码正确
- ✅ 集群地址正确（`cluster0.np4pjfy.mongodb.net`）
- ✅ 数据库名已包含（`/ct-ai`）

### 5. 尝试使用 MongoDB Compass 测试连接
1. 下载 MongoDB Compass：https://www.mongodb.com/products/compass
2. 使用连接字符串测试连接
3. 如果 Compass 可以连接，说明问题在 Node.js 环境
4. 如果 Compass 也无法连接，说明问题在 Atlas 配置

### 6. 检查 Node.js 和 OpenSSL 版本
```powershell
node --version
# 应该 >= 18.0.0

openssl version
# 检查 OpenSSL 版本
```

### 7. 尝试添加 TLS 参数
如果上述步骤都正常，可以尝试在连接字符串中添加 TLS 参数：

```
mongodb+srv://chutianroths_db_user:NOgRGcdFDfbDELJO@cluster0.np4pjfy.mongodb.net/ct-ai?tls=true&tlsAllowInvalidCertificates=false
```

### 8. 等待集群完全就绪
- 免费集群 (M0) 创建可能需要 3-5 分钟
- 如果刚刚创建集群，请等待几分钟后重试

## 常见解决方案

### 方案 A：重新创建数据库用户
1. 在 Atlas 控制台删除现有用户
2. 重新创建用户，使用新的密码
3. 更新 `.env.local` 中的连接字符串

### 方案 B：使用标准连接字符串（非 SRV）
如果 SRV 连接有问题，可以尝试标准连接字符串：
1. 在 Atlas 控制台获取标准连接字符串
2. 格式类似：`mongodb://username:password@host1:port1,host2:port2/database`

### 方案 C：检查防火墙/代理设置
- 确保没有防火墙阻止 MongoDB 连接
- 如果使用代理，可能需要配置代理设置

## 下一步

完成上述排查后：
1. 重新运行测试：`cd backend && node test-mongodb-connection.js`
2. 如果连接成功，重启后端服务：`npm run dev`
3. 运行完整测试：`powershell -ExecutionPolicy Bypass -File .\test-api.ps1`

## 需要帮助？

如果问题仍然存在，请提供：
- Atlas 集群状态截图
- 网络访问列表截图
- 数据库用户列表截图
- 完整的错误信息

