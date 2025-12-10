# Failed to Fetch 错误修复报告

## 问题描述

前端执行步骤时出现 "Failed to fetch" 错误：
- **错误信息**：`Failed to fetch`
- **发生位置**：执行步骤时调用后端 API
- **影响**：无法执行图像生成步骤

## 问题分析

### 根本原因

1. **CORS 配置缺失**：后端 API 未配置 CORS 头，导致浏览器阻止跨域请求
2. **后端服务未运行**：执行时后端服务可能未启动（端口 3000 无法连接）
3. **错误处理不完善**：前端未正确处理和显示网络错误

### 详细分析

#### 1. CORS 问题
- **症状**：浏览器控制台显示 CORS 错误
- **原因**：Next.js API 路由默认不包含 CORS 头
- **影响**：前端无法访问后端 API

#### 2. 后端服务状态
- **检查结果**：后端服务有时未运行
- **端口**：3000
- **影响**：网络请求失败

#### 3. 错误处理
- **问题**：前端仅显示 "Failed to fetch"，未提供详细错误信息
- **影响**：用户无法了解具体问题

## 修复方案

### ✅ 1. 添加 CORS 支持

**文件**：`backend/src/app/api/modules/route.ts`

添加了：
- `OPTIONS` 处理函数：处理 CORS 预检请求
- CORS 响应头：在所有响应中添加 `Access-Control-Allow-Origin: *`

**修改内容**：
```typescript
// 添加 OPTIONS 处理
export async function OPTIONS(request: NextRequest) {
  return new NextResponse(null, {
    status: 200,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
    },
  });
}

// 在 GET 和 POST 响应中添加 CORS 头
response.headers.set("Access-Control-Allow-Origin", "*");
```

### ✅ 2. 改进前端错误处理

**文件**：`ct-ai-web/src/lib/store.ts`

改进内容：
- 检测 `Failed to fetch` 错误：提供更友好的错误提示
- 检查配额限制：识别 API 配额错误并显示相应提示
- 显示详细错误：保留原始错误信息以便调试

**修改内容**：
```typescript
} catch (error) {
  let errorMessage = '处理失败: 未知错误';
  
  if (error instanceof TypeError && error.message === 'Failed to fetch') {
    errorMessage = '无法连接到后端服务。请确保后端服务运行在 http://localhost:3000';
  } else if (error instanceof Error) {
    errorMessage = error.message;
    // 检查是否是配额限制错误
    if (error.message.includes('quota') || error.message.includes('429')) {
      errorMessage = 'API 配额已用完。请等待配额重置或升级计划。详细错误: ' + error.message;
    }
  }
  
  // ... 更新状态并显示错误
}
```

## 验证步骤

### 1. 检查后端服务
```powershell
Test-NetConnection -ComputerName localhost -Port 3000
```

### 2. 测试 CORS 配置
```bash
curl -X OPTIONS http://localhost:3000/api/modules \
  -H "Origin: http://localhost:5173" \
  -H "Access-Control-Request-Method: POST" \
  -v
```

### 3. 测试 API 调用
```bash
curl -X POST http://localhost:3000/api/modules \
  -H "Content-Type: application/json" \
  -H "Origin: http://localhost:5173" \
  -d '{"prompt":"测试提示词"}'
```

### 4. 前端测试
1. 打开 `http://localhost:5173`
2. 创建项目
3. 添加编辑模块步骤
4. 执行步骤
5. 验证错误信息是否正确显示

## 常见错误及解决方案

### 错误 1: "Failed to fetch"
**原因**：后端服务未运行或网络连接问题

**解决方案**：
1. 检查后端服务是否运行在 `http://localhost:3000`
2. 启动后端服务：`cd backend && npm run dev`
3. 检查防火墙设置

### 错误 2: CORS 错误
**原因**：浏览器阻止跨域请求

**解决方案**：
1. 确认已添加 CORS 响应头（已修复）
2. 检查 `Access-Control-Allow-Origin` 头是否存在
3. 如果仍有问题，检查浏览器控制台的详细错误信息

### 错误 3: API 配额限制
**原因**：Gemini API 免费配额已用完

**解决方案**：
1. 等待配额重置（通常 24 小时）
2. 升级到付费计划
3. 检查配额使用：https://ai.dev/usage?tab=rate-limit

### 错误 4: 后端服务启动失败
**原因**：环境变量未配置或代码错误

**解决方案**：
1. 检查 `.env.local` 文件是否存在
2. 确认 `GEMINI_API_KEY` 已配置
3. 查看后端服务日志中的错误信息

## 修复后的预期行为

### ✅ 正常流程
1. 用户点击"执行此步骤"
2. 前端显示处理进度（0% → 30% → 70% → 90% → 100%）
3. 调用后端 API（无 CORS 错误）
4. 后端调用 Gemini API 生成图像
5. 返回生成的图像数据
6. 前端显示结果图像

### ⚠️ 错误场景
1. **后端服务未运行**：
   - 显示："无法连接到后端服务。请确保后端服务运行在 http://localhost:3000"
   
2. **API 配额限制**：
   - 显示："API 配额已用完。请等待配额重置或升级计划。详细错误: [具体错误信息]"
   
3. **其他错误**：
   - 显示原始错误信息

## 测试结果

### ✅ CORS 配置
- OPTIONS 请求处理正确
- CORS 响应头正确添加
- 跨域请求可以正常发送

### ✅ 错误处理
- 网络错误正确识别
- 配额错误友好提示
- 错误信息正确显示在 UI 中

### ⚠️ 当前限制
- API 配额限制（非代码问题）
- 需要等待配额重置或升级计划

## 下一步

1. ✅ **已完成**：添加 CORS 支持
2. ✅ **已完成**：改进错误处理
3. ⏳ **待完成**：等待配额重置后测试完整流程
4. ⏳ **可选**：实现请求重试机制
5. ⏳ **可选**：添加后端服务状态检查

## 相关文件

### 修改的文件
- `backend/src/app/api/modules/route.ts` - 添加 CORS 支持
- `ct-ai-web/src/lib/store.ts` - 改进错误处理

### 相关文档
- `docs/AI模型调用增强/VERIFICATION_REPORT.md` - 详细验证报告
- `docs/AI模型调用增强/VERIFICATION_SUMMARY.md` - 验证总结

