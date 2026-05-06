// ─── Supabase Record Types ───────────────────────────────

export interface Turtle {
  id: string
  name: string
  species: string
  purchase_date: string
  photo: string
  weight_latest: number
  size_latest: number
  notes: string
  created_at: string
  updated_at: string
}

export type FoodType = '龟粮' | '活鱼' | '活虾' | '蚯蚓' | '饲料鱼' | '其他'
export type FoodUnit = '颗' | '条' | '克'

export interface FeedingLog {
  id: string
  turtle_id: string
  turtleName?: string  // from join
  date: string
  food_type: FoodType
  quantity: number
  unit: FoodUnit
  notes: string
  created_at: string
}

export interface WaterChange {
  id: string
  date: string
  ratio: number
  water_temp: number
  notes: string
  created_at: string
}

export interface GrowthRecord {
  id: string
  turtle_id: string
  turtleName?: string  // from join
  date: string
  weight: number
  carapace_length: number
  ventral_length: number
  photo: string
  notes: string
  created_at: string
}

export type FilterStatus = '正常' | '需清洗' | '更换'
export type LightStatus = '开' | '关'

export interface EnvironmentLog {
  id: string
  date: string
  water_temp: number
  air_temp: number
  humidity: number
  filter_status: FilterStatus
  light_status: LightStatus
  notes: string
  created_at: string
}

export type HealthStatus = '正常' | '活跃' | '拒食' | '腐甲' | '感冒' | '其他异常'

export interface HealthLog {
  id: string
  turtle_id: string
  turtleName?: string  // from join
  date: string
  status: HealthStatus
  shell_check: string
  eye_check: string
  notes: string
  created_at: string
}

// ─── UI Types ──────────────────────────────────────────────

export type ActivityType = 'feeding' | 'water' | 'growth' | 'health' | 'environment'

export interface ActivityItem {
  id: string
  type: ActivityType
  title: string
  subtitle: string
  date: string
  turtleId?: string
  turtleName?: string
}
