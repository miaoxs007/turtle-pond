import { createClient } from '@supabase/supabase-js'
import type { Turtle, FeedingLog, WaterChange, GrowthRecord, EnvironmentLog, HealthLog } from '@/types'

const SB_URL = import.meta.env.VITE_SUPABASE_URL
const SB_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!SB_URL || !SB_ANON_KEY) {
  throw new Error('Missing VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY env vars')
}

const supabase = createClient(SB_URL, SB_ANON_KEY)

// ─── Normalize Supabase join: { turtles: { name } } → { turtleName } ─────────

interface SupabaseRow {
  turtles?: { name: string }
  [key: string]: unknown
}

function normalize(row: SupabaseRow): SupabaseRow & { turtleName?: string } {
  if (row.turtles && typeof row.turtles === 'object') {
    return { ...row, turtleName: row.turtles.name }
  }
  return row as SupabaseRow & { turtleName?: string }
}

// ─── List helpers ───────────────────────────────────────────────────────────

async function listTable<T>(
  table: string,
  page = 1,
  perPage = 50,
  orderColumn = 'created_at',
  select = '*'
): Promise<{ items: T[]; totalItems: number }> {
  const from = (page - 1) * perPage
  const { data, error, count } = await supabase
    .from(table)
    .select(select, { count: 'exact' })
    .order(orderColumn, { ascending: false })
    .range(from, from + perPage - 1)
  if (error) throw error
  const rows = data as unknown as SupabaseRow[]
  return { items: rows.map(r => normalize(r) as unknown as T), totalItems: count ?? 0 }
}

// ─── Typed wrappers matching the old pb.ts API ──────────────────────────────

export const turtles = {
  list: (page = 1, perPage = 50) =>
    listTable<Turtle>('turtles', page, perPage, 'created_at'),
  get: (id: string) => supabase.from('turtles').select('*').eq('id', id).single(),
  create: (data: Record<string, unknown>) => supabase.from('turtles').insert(data as never).select().single(),
  update: (id: string, data: Record<string, unknown>) => supabase.from('turtles').update(data as never).eq('id', id).select().single(),
  delete: (id: string) => supabase.from('turtles').delete().eq('id', id),
}

export const feedingLogs = {
  list: (page = 1, perPage = 50) =>
    listTable<FeedingLog>('feeding_logs', page, perPage, 'date', '*, turtles(name)'),
  create: (data: Record<string, unknown>) => supabase.from('feeding_logs').insert(data as never).select().single(),
  delete: (id: string) => supabase.from('feeding_logs').delete().eq('id', id),
}

export const waterChanges = {
  list: (page = 1, perPage = 50) =>
    listTable<WaterChange>('water_changes', page, perPage, 'date'),
  create: (data: Record<string, unknown>) => supabase.from('water_changes').insert(data as never).select().single(),
  delete: (id: string) => supabase.from('water_changes').delete().eq('id', id),
}

export const growthRecords = {
  list: (page = 1, perPage = 50) =>
    listTable<GrowthRecord>('growth_records', page, perPage, 'date', '*, turtles(name)'),
  create: (data: Record<string, unknown>) => supabase.from('growth_records').insert(data as never).select().single(),
  delete: (id: string) => supabase.from('growth_records').delete().eq('id', id),
}

export const environmentLogs = {
  list: (page = 1, perPage = 50) =>
    listTable<EnvironmentLog>('environment_logs', page, perPage, 'date'),
  create: (data: Record<string, unknown>) => supabase.from('environment_logs').insert(data as never).select().single(),
  delete: (id: string) => supabase.from('environment_logs').delete().eq('id', id),
}

export const healthLogs = {
  list: (page = 1, perPage = 50) =>
    listTable<HealthLog>('health_logs', page, perPage, 'date', '*, turtles(name)'),
  create: (data: Record<string, unknown>) => supabase.from('health_logs').insert(data as never).select().single(),
  delete: (id: string) => supabase.from('health_logs').delete().eq('id', id),
}

export default supabase
