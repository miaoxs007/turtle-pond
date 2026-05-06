# 龟塘 (Turtle Pond) — PocketBase 数据迁移

本目录包含 PocketBase collections 的 schema 定义。

## 快速启动

1. 下载 PocketBase: https://pocketbase.io/docs/
2. 运行 PocketBase:
   ```bash
   ./pocketbase serve
   ```
3. 访问 http://localhost:8090/_/ 创建超级管理员账号
4. 进入 Settings → Import collections，将下方 JSON 导入

## Collections Schema

```json
[
  {
    "name": "turtles",
    "type": "base",
    "fields": [
      { "name": "name", "type": "text", "required": true },
      { "name": "species", "type": "text" },
      { "name": "purchase_date", "type": "date" },
      { "name": "photo", "type": "file", "options": { "maxSelect": 1, "maxSize": 5242880 } },
      { "name": "weight_latest", "type": "number", "options": { "min": 0 } },
      { "name": "size_latest", "type": "number", "options": { "min": 0 } },
      { "name": "notes", "type": "text" }
    ]
  },
  {
    "name": "feeding_logs",
    "type": "base",
    "fields": [
      { "name": "turtle", "type": "relation", "options": { "collectionId": "_turtles_id_", "cascadeDelete": true } },
      { "name": "date", "type": "datetime", "required": true },
      { "name": "food_type", "type": "select", "options": { "values": ["龟粮", "活鱼", "活虾", "蚯蚓", "饲料鱼", "其他"] } },
      { "name": "quantity", "type": "number", "required": true, "options": { "min": 0 } },
      { "name": "unit", "type": "select", "options": { "values": ["颗", "条", "克"] } },
      { "name": "notes", "type": "text" }
    ]
  },
  {
    "name": "water_changes",
    "type": "base",
    "fields": [
      { "name": "date", "type": "datetime", "required": true },
      { "name": "ratio", "type": "number", "required": true, "options": { "min": 0, "max": 100 } },
      { "name": "water_temp", "type": "number" },
      { "name": "notes", "type": "text" }
    ]
  },
  {
    "name": "growth_records",
    "type": "base",
    "fields": [
      { "name": "turtle", "type": "relation", "options": { "collectionId": "_turtles_id_", "cascadeDelete": true } },
      { "name": "date", "type": "date", "required": true },
      { "name": "weight", "type": "number", "options": { "min": 0 } },
      { "name": "carapace_length", "type": "number", "options": { "min": 0 } },
      { "name": "ventral_length", "type": "number", "options": { "min": 0 } },
      { "name": "photo", "type": "file", "options": { "maxSelect": 1, "maxSize": 10485760 } },
      { "name": "notes", "type": "text" }
    ]
  },
  {
    "name": "environment_logs",
    "type": "base",
    "fields": [
      { "name": "date", "type": "datetime", "required": true },
      { "name": "water_temp", "type": "number" },
      { "name": "air_temp", "type": "number" },
      { "name": "humidity", "type": "number", "options": { "min": 0, "max": 100 } },
      { "name": "filter_status", "type": "select", "options": { "values": ["正常", "需清洗", "更换"] } },
      { "name": "light_status", "type": "select", "options": { "values": ["开", "关"] } },
      { "name": "notes", "type": "text" }
    ]
  },
  {
    "name": "health_logs",
    "type": "base",
    "fields": [
      { "name": "turtle", "type": "relation", "options": { "collectionId": "_turtles_id_", "cascadeDelete": true } },
      { "name": "date", "type": "date", "required": true },
      { "name": "status", "type": "select", "options": { "values": ["正常", "活跃", "拒食", "腐甲", "感冒", "其他异常"] } },
      { "name": "shell_check", "type": "text" },
      { "name": "eye_check", "type": "text" },
      { "name": "notes", "type": "text" }
    ]
  }
]
```

> ⚠️ 导入时需将 `_turtles_id_` 替换为 turtles collection 的实际 ID。
