## CT AI Backend

基于 Next.js 14 App Router 的后端服务，用于支撑 CT AI 链式图像编辑应用。

### 本地开发

```powershell
# Install dependencies
npm install

# Copy environment variables
copy env.example .env.local

# Start dev server
npm run dev
```

服务器启动后访问 `http://localhost:3000/api/health` 确认服务与本地存储状态。

### 环境变量

| 变量名           | 说明                     |
| ---------------- | ------------------------ |
| `NODE_ENV`       | 运行环境，默认 `development` |
| `JWT_SECRET`     | 访问令牌签名密钥（至少 16 位） |
| `JWT_EXPIRES_IN` | 访问令牌有效期，默认 `15m`   |
| `JWT_REFRESH_SECRET` | 刷新令牌签名密钥（至少 16 位） |
| `JWT_REFRESH_EXPIRES_IN` | 刷新令牌有效期，默认 `7d` |

更多详细信息参考 `src/config/env.ts` 与 `src/lib/localDb.ts`。
