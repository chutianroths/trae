## CT AI Frontend

基于 Expo + React Native + TypeScript 的跨平台客户端，用于提供 CT AI 链式图像编辑的移动与桌面界面。

### 启动开发环境

```powershell
# 安装依赖
npm install

# 复制环境变量（如需）
copy env.example .env

# 启动 Expo
npm start
```

使用 Expo Go 扫描二维码，或运行 `npm run android` / `npm run web` 启动对应平台。

### 技术栈

- 导航：React Navigation (Native Stack)
- UI 组件：React Native Paper (MD3)
- 状态管理：Zustand
- 主题：亮色 / 暗色自动切换，封装于 `AppProviders`

### 目录结构

```
frontend/
├── App.tsx                 # 应用入口，挂载导航与全局 Provider
├── src/
│   ├── components/         # 通用 UI 组件
│   ├── navigation/         # 导航定义
│   ├── providers/          # 全局 Provider
│   ├── screens/            # 页面
│   ├── stores/             # Zustand 状态
│   └── theme/              # 主题配置
```

### 常用脚本

```powershell
npm start          # 启动开发服务器
npm run lint       # 运行 ESLint 检查
npm run lint:fix   # 自动修复可修复的问题
npm run format     # Prettier 自动格式化
```
