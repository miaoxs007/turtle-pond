# 🐢 龟塘 (Turtle Pond)

专为养龟爱好者设计的记录平台——记录龟龟的饮食、成长、环境和健康数据。

## 技术栈

- **前端**: Vue 3 + Vite + TypeScript + TailwindCSS v4
- **后端**: PocketBase (自托管，一体化后端+数据库)
- **图标**: Lucide Vue
- **状态**: Pinia
- **路由**: Vue Router 4

## 快速开始

### 1. 启动后端 (PocketBase)

```bash
# 下载 PocketBase (https://pocketbase.io/docs/)
# Linux/macOS:
./pocketbase serve

# Windows:
pocketbase.exe serve
```

访问 http://localhost:8090/_/ 创建管理员账号，然后创建以下 Collections（参考 `pocketbase/` 目录下的 schema）。

### 2. 启动前端

```bash
cd frontend
npm install
npm run dev
```

访问 http://localhost:5173

### 3. 配置后端地址

创建 `frontend/.env` 文件：

```env
VITE_PB_URL=http://localhost:8090
```

## 功能

- 📊 **仪表盘** — 龟龟概览、近期活动、统计数字
- 🐢 **龟龟档案** — 添加/编辑/删除龟龟，记录基本信息
- 🍽️ **喂食记录** — 记录每次喂食的食物类型和数量
- 💧 **换水记录** — 记录换水比例和水温
- 📈 **成长记录** — 记录体重、背甲/腹甲长度
- 🌡️ **环境监测** — 记录水温、气温、湿度、过滤器/灯光状态
- 🩺 **健康日志** — 记录健康状态、甲壳和眼睛检查
- ⚙️ **设置** — 数据导出、关于信息

## 部署

### 前端 (Vercel)

```bash
cd frontend
npm run build
# 将 dist 目录部署到 Vercel
```

构建产物是纯静态文件，可部署到任意静态托管平台。

### 后端 (PocketBase)

PocketBase 是一个单文件，可部署到：

- **Railway** (免费层): ` railway login && railway init && railway up`
- **Render**: 连接到 Git 仓库，使用官方 Dockerfile
- **自己服务器**: 直接运行 `./pocketbase serve`

### 域名 & HTTPS

- Vercel: 自动提供 HTTPS + CDN
- PocketBase: 建议使用 Nginx/Caddy 反向代理提供 HTTPS

## 项目结构

```
turtle-pond/
├── frontend/           # Vue 前端
│   ├── src/
│   │   ├── assets/     # 全局样式
│   │   ├── components/ # 组件
│   │   │   └── layout/ # 布局
│   │   ├── pages/      # 页面
│   │   ├── stores/     # Pinia 状态管理
│   │   ├── lib/        # PocketBase 客户端
│   │   ├── types/      # TypeScript 类型
│   │   └── router/     # 路由
│   └── index.html
├── pocketbase/         # PocketBase schema 文档
└── SPEC.md            # 设计规范
```
