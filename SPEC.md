# 龟塘 (Turtle Pond) — 养龟记录网站

## 1. Concept & Vision

一个专为养龟爱好者设计的记录平台，记录龟龟的饮食、成长、环境和健康数据。界面如同一汪浅池——自然、宁静、略带禅意。数据驱动的设计让养殖过程更科学，同时保持手工记录的温暖感。

## 2. Design Language

### Aesthetic Direction
**自然湿地 (Natural Wetland)** — 参考沼泽池塘的宁静感，融入日本枯山水的克制美学。

### Color Palette
```
--bg-primary:    #F5F0E8   (池水米白)
--bg-secondary:  #E8E0D0   (浅塘沙色)
--bg-card:       #FFFFFF
--text-primary:  #2C3E2D   (深林绿)
--text-secondary:#5A6B5C   (苔藓灰绿)
--text-muted:    #8B9A8C   (薄雾灰)
--accent-green:  #4A7C59   (池畔绿)
--accent-light:  #7FB069   (嫩叶绿)
--accent-warm:   #C17A4A   (秋木棕)
--accent-water:  #5B8FA8   (浅水蓝)
--border:        #D4CBBA
--danger:        #B85C4A
```

### Typography
- **Display / 标题**: "Noto Serif SC" (Google Fonts) — 有书卷气
- **Body / 正文**: "Noto Sans SC" (Google Fonts) — 清晰可读
- **Data / 数字**: "JetBrains Mono" (Google Fonts) — 等宽，数据清晰
- Fallback: system-ui, sans-serif

### Spatial System
- Base unit: 4px
- Spacing scale: 4, 8, 12, 16, 24, 32, 48, 64px
- Border radius: 12px (卡片), 8px (按钮), 4px (输入框)
- Shadows: 柔和的暖灰阴影 `0 2px 8px rgba(44,62,45,0.08)`

### Motion Philosophy
- 入场动画: fade + slide-up, 300ms ease-out, 交错 60ms
- 悬停: scale(1.02) + 阴影加深, 200ms ease
- 页面切换: 淡入淡出, 200ms
- 数字变化: 计数动画, 400ms

### Visual Assets
- **Icons**: Lucide React (stroke-width: 1.5, 风格纤细)
- **Illustrations**: 简笔水彩风乌龟插画 (SVG inline)
- **背景**: 微妙的等高线图案，模拟水面涟漪

## 3. Layout & Structure

### 整体结构
```
┌─────────────────────────────────────────────────────┐
│  Sidebar (240px fixed)  │  Main Content Area        │
│  ┌───────────────────┐  │  ┌─────────────────────┐  │
│  │ 🐢 龟塘            │  │  │ Page Header         │  │
│  │ ─────────────────  │  │  │ (title + actions)   │  │
│  │ 📊 仪表盘          │  │  ├─────────────────────┤  │
│  │ 🐢 龟龟档案        │  │  │                     │  │
│  │ 🍽️ 喂食记录        │  │  │  Page Content       │  │
│  │ 💧 换水记录        │  │  │  (scrollable)       │  │
│  │ 📈 成长记录        │  │  │                     │  │
│  │ 🌡️ 环境监测        │  │  │                     │  │
│  │ 🩺 健康日志        │  │  │                     │  │
│  │ ─────────────────  │  │  └─────────────────────┘  │
│  │ ⚙️ 设置            │  │                           │
│  └───────────────────┘  │                           │
└─────────────────────────────────────────────────────┘
```

### 响应式策略
- **Desktop (≥1024px)**: 侧边栏 + 主内容区
- **Tablet (768-1023px)**: 侧边栏折叠为图标模式
- **Mobile (<768px)**: 底部导航栏 + 全屏内容

### 页面结构
- 侧边栏始终可见 (desktop)
- 卡片网格布局 (dashboard, 龟龟列表)
- 单列表单布局 (新建/编辑页面)
- 日历视图 (独立页面)

## 4. Features & Interactions

### 4.1 仪表盘 (Dashboard)
- **龟龟概览卡片**: 每只龟的名字、物种、最新体重、最新记录时间
- **近期活动时间线**: 最近10条记录，带图标和颜色区分类型
- **统计数字**: 总记录数、本月喂食次数、平均体重变化
- **快速添加按钮**: 浮动按钮，点击展开菜单（+喂食/换水/记录）

### 4.2 龟龟档案 (Turtle Profiles)
- **列表视图**: 卡片网格，每张卡片显示：照片、名字、物种、入养日期、体重趋势迷你图
- **详情视图**: 大照片区 + 基本信息 + 所有相关记录标签页
- **CRUD**: 新增、编辑、删除(确认弹窗)
- **照片上传**: 拖拽或点击上传，自动压缩，存储到 PocketBase 文件字段

### 4.3 喂食记录 (Feeding Records)
- **列表**: 时间倒序，每行显示：时间、龟名、食物类型(龟粮/鱼/虾/其他)、数量、单位
- **快速记录**: 选择龟龟 + 食物类型 + 数量 + 提交 (无需刷新)
- **食物类型**: 龟粮（颗粒）、活鱼、活虾、蚯蚓、饲料鱼、其他
- **数量单位**: 颗、条、克

### 4.4 换水记录 (Water Change)
- **列表**: 时间倒序，显示：时间、换水比例(%)、水温、水质备注
- **快速记录**: 换水比例滑块(10%-100%) + 水温 + 备注
- **颜色提示**: 换水比例越高颜色越深（节水意识）

### 4.5 成长记录 (Growth Records)
- **记录项**: 日期、体重(g)、背甲长度(mm)、腹甲长度(mm)
- **对比视图**: 选择两个日期，照片并排对比
- **图表**: X轴日期，Y轴体重/尺寸，多龟叠加显示
- **照片关联**: 可上传成长照片，缩略图显示在记录行

### 4.6 环境监测 (Environment)
- **记录项**: 时间、水温(°C)、气温(°C)、湿度(%)、过滤器状态、灯光状态
- **手动记录表单**: 简洁数字输入
- **趋势图**: 折线图显示水温/气温历史趋势

### 4.7 健康日志 (Health Log)
- **状态选项**: 正常、活跃、拒食、腐甲、感冒、其他异常
- **记录项**: 日期、龟名、状态、甲壳检查、眼睛检查、备注
- **异常标记**: 红色标签突出显示，汇总在仪表盘

### 4.8 设置 (Settings)
- **龟龟种类管理**: 添加/编辑常见物种列表
- **食物类型管理**: 自定义食物类型
- **数据导出**: JSON 导出所有记录
- **关于**: 版本信息

### 空状态设计
每个列表页都有空状态插图 + 引导文案，例如：
- 喂食记录空状态: "还没有喂食记录，今天先喂一顿？🍽️"

### 错误处理
- 网络错误: 顶部 Toast 提示 "保存失败，请重试"
- 必填字段: 输入框下方红色提示文字
- 删除确认: 红色警告弹窗，需输入龟龟名字确认

## 5. Component Inventory

### 导航组件
| 组件 | 描述 | 状态 |
|------|------|------|
| Sidebar | 固定左侧导航 | default, collapsed(mobile) |
| NavItem | 单个导航项 | default, hover, active |
| MobileNav | 底部导航栏 | visible(mobile only) |
| QuickAddFAB | 浮动快速添加按钮 | default, expanded |

### 卡片组件
| 组件 | 描述 | 状态 |
|------|------|------|
| TurtleCard | 龟龟概览卡片 | default, hover, loading |
| StatCard | 统计数字卡片 | default, loading |
| ActivityItem | 时间线活动项 | default |

### 表单组件
| 组件 | 描述 | 状态 |
|------|------|------|
| BaseInput | 文本输入框 | default, focus, error, disabled |
| BaseSelect | 下拉选择 | default, open, disabled |
| BaseNumber | 数字输入 | default, focus, error |
| DatePicker | 日期选择 | default, open |
| ImageUpload | 图片上传 | default, dragover, uploading, error |
| Slider | 比例滑块 | default, dragging |
| Toggle | 开关 | on, off |

### 反馈组件
| 组件 | 描述 | 状态 |
|------|------|------|
| Toast | 操作反馈提示 | success, error, warning, info |
| Modal | 确认/编辑弹窗 | open, closing |
| ConfirmDialog | 删除确认弹窗 | open |
| Skeleton | 加载占位 | animated |
| EmptyState | 空数据状态 | illustrated + text |

### 数据展示
| 组件 | 描述 |
|------|------|
| DataTable | 记录列表（带排序、分页） |
| GrowthChart | 成长折线图 (Chart.js) |
| MiniSparkline | 迷你趋势线（卡片用） |
| Calendar | 日历视图 |
| Timeline | 活动时间线 |

## 6. Technical Approach

### 技术栈
- **前端**: Vue 3 + Vite + TypeScript + TailwindCSS v4
- **状态管理**: Pinia
- **路由**: Vue Router 4
- **图表**: Chart.js + vue-chartjs
- **后端**: PocketBase (单文件，自托管)
- **图标**: Lucide Vue

### 项目结构
```
turtle-pond/
├── frontend/              # Vue 前端
│   ├── src/
│   │   ├── assets/        # 静态资源
│   │   ├── components/    # 组件
│   │   │   ├── ui/        # 基础UI组件
│   │   │   ├── layout/    # 布局组件
│   │   │   └── features/  # 业务组件
│   │   ├── pages/        # 页面
│   │   ├── stores/       # Pinia stores
│   │   ├── lib/          # 工具函数
│   │   ├── types/        # TypeScript 类型
│   │   └── router/       # 路由配置
│   ├── index.html
│   ├── vite.config.ts
│   └── package.json
├── pocketbase/            # PocketBase 可执行文件
├── pb_migrations/         # 数据库迁移
└── README.md
```

### 数据模型 (PocketBase Collections)

**turtles** (龟龟档案)
```
id: auto
name: text (required)
species: text
purchase_date: date
photo: file (single)
weight_latest: number (g)
size_latest: number (mm)
notes: text
created: datetime
updated: datetime
```

**feeding_logs** (喂食记录)
```
id: auto
turtle: relation(turtles)
date: datetime (required)
food_type: select(龟粮,活鱼,活虾,蚯蚓,饲料鱼,其他)
quantity: number (required)
unit: select(颗,条,克)
notes: text
created: datetime
```

**water_changes** (换水记录)
```
id: auto
date: datetime (required)
ratio: number (10-100%)
water_temp: number (°C)
notes: text
created: datetime
```

**growth_records** (成长记录)
```
id: auto
turtle: relation(turtles)
date: date (required)
weight: number (g)
carapace_length: number (mm)
ventral_length: number (mm)
photo: file
notes: text
created: datetime
```

**environment_logs** (环境记录)
```
id: auto
date: datetime (required)
water_temp: number (°C)
air_temp: number (°C)
humidity: number (%)
filter_status: select(正常,需清洗,更换)
light_status: select(开,关)
notes: text
created: datetime
```

**health_logs** (健康记录)
```
id: auto
turtle: relation(turtles)
date: date (required)
status: select(正常,活跃,拒食,腐甲,感冒,其他异常)
shell_check: text
eye_check: text
notes: text
created: datetime
```

### 部署方案
- **前端**: Vercel (免费) → 静态部署
- **后端 PocketBase**: Railway (免费层) 或 Render 或 Cloudflare Pages (Workers)
- **域名**: 用户自有域名 (可选)

### API 调用 (PocketBase JS SDK)
```typescript
// lib/pb.ts
import PocketBase from 'pocketbase'
const pb = new PocketBase('https://turtle-pond.pb.railway.app')
export default pb

// 示例调用
const records = await pb.collection('feeding_logs').getList(1, 50, {
  sort: '-date',
  expand: 'turtle'
})
```
