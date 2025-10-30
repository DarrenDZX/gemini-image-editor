# Gemini Image Editor - 部署指南

这个应用已经集成了 Gemini AI 图片生成和 remove.bg 自动去背景功能。

## 功能特性

- 使用 Gemini 2.5 Flash Image 模型生成/编辑图片
- 自动使用 remove.bg API 去除生成图片的背景
- 可选择是否启用背景去除功能

## 本地运行

1. 安装依赖：
```bash
npm install
```

2. 配置环境变量：
```bash
# 复制模板文件
cp .env.local.example .env.local

# 编辑 .env.local 文件，填入你的 API keys
# GEMINI_API_KEY=你的_gemini_api_key
# REMOVEBG_API_KEY=你的_removebg_api_key
```

获取 API Keys：
- Gemini API Key: https://aistudio.google.com/app/apikey
- remove.bg API Key: https://www.remove.bg/users/sign_in

3. 启动开发服务器：
```bash
npm run dev
```

4. 访问 http://localhost:3000

## GitHub Pages 部署步骤

### 1. 创建 GitHub 仓库

1. 访问 https://github.com/new
2. Repository name: 输入 `gemini-image-editor`
3. 选择 `Public`
4. **不要勾选任何初始化选项**
5. 点击 `Create repository`

### 2. 推送代码到 GitHub

```bash
# 如果还没有初始化 git（通常已经初始化了）
git init
git branch -m main

# 添加远程仓库（替换为你的仓库地址）
git remote add origin https://github.com/你的用户名/gemini-image-editor.git

# 提交并推送
git add .
git commit -m "Initial commit"
git push -u origin main
```

### 3. 配置 GitHub Secrets（重要！）

1. 进入仓库的 **Settings** > **Secrets and variables** > **Actions**
2. 点击 **New repository secret**
3. 添加两个 secrets：
   - Name: `GEMINI_API_KEY`，Value: 你的 Gemini API key
   - Name: `REMOVEBG_API_KEY`，Value: 你的 remove.bg API key

### 4. 启用 GitHub Pages

1. 进入 **Settings** > **Pages**
2. 在 **Source** 下拉菜单中选择 `GitHub Actions`

### 5. 触发部署

1. 代码推送后，GitHub Actions 会自动运行
2. 进入 **Actions** 标签查看部署进度
3. 部署成功后，访问：`https://你的用户名.github.io/gemini-image-editor/`

## 其他部署选项

### Vercel（推荐用于生产环境）

1. 访问 https://vercel.com
2. 导入你的 GitHub 仓库
3. 在环境变量中添加：
   - `GEMINI_API_KEY`
   - `REMOVEBG_API_KEY`
4. 点击部署

### Netlify

1. 访问 https://netlify.com
2. 拖拽 `dist` 文件夹到 Netlify
3. 或连接 GitHub 仓库自动部署
4. 在 Site settings > Environment variables 中添加 API keys

## 安全注意事项

⚠️ **重要提醒**：
- 这个应用的 API keys 在客户端使用，会暴露在浏览器中
- 建议设置 API key 的使用限制：
  - Gemini API: 在 Google Cloud Console 设置 API 限制和配额
  - remove.bg API: 监控使用量，设置预算提醒
- 对于生产环境，建议使用后端代理来保护 API keys

## 故障排除

### 部署时 Actions 失败
- 检查是否已在 GitHub Secrets 中添加了两个 API keys
- 确保 API keys 有效且有配额

### 页面空白或无内容
- 打开浏览器开发者工具（F12）查看控制台错误
- 检查 API keys 是否正确配置
- 确保网络可以访问 cdn.tailwindcss.com

### API 调用失败
- 检查 API keys 是否有效
- 检查 API 配额是否用完
- 查看浏览器开发者工具的 Network 标签查看详细错误

## 项目结构

```
.
├── components/          # React 组件
│   ├── Header.tsx
│   ├── InputPanel.tsx   # 输入面板（含去背景选项）
│   ├── OutputPanel.tsx
│   └── Icon.tsx
├── utils/
│   ├── fileUtils.ts     # 文件处理工具
│   └── removebg.ts      # remove.bg API 集成
├── App.tsx              # 主应用组件
├── index.tsx            # 入口文件
├── index.html           # HTML 模板
├── vite.config.ts       # Vite 配置
├── .env.local.example   # 环境变量模板
└── .github/workflows/
    └── deploy.yml       # GitHub Actions 部署配置
```

