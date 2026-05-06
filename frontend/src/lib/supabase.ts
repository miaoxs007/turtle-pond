import { createClient } from '@supabase/supabase-js'

const SB_URL = import.meta.env.VITE_SUPABASE_URL
const SB_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!SB_URL || !SB_ANON_KEY) {
  throw new Error('Missing VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY env vars')
}

const supabase = createClient(SB_URL, SB_ANON_KEY)

// ─── Typed wrappers matching the old pb.ts API ──────────────────────────────

export const turtles = {
  list: async (page = 1, perPage = 50) => {
    const from = (page - 1) * perPage
    const { data, error, count } = await supabase
      .from('turtles')
      .select('*', { count: 'exact' })
      .order('created', { ascending: false })
      .range(from, from + perPage - 1)
    if (error) throw error
    return { items: data ?? [], totalItems: count ?? 0 }
  },
  get: (id: string) => supabase.from('turtles').select('*').eq('id', id).single(),
  create: (data: Record<string, unknown>) => supabase.from('turtles').insert(data).select().single(),
  update: (id: string, data: Record<string, unknown>) => supabase.from('turtles').update(data).eq('id', id).select().single(),
  delete: (id: string) => supabase.from('turtles').delete().eq('id', id),
}

export const feedingLogs = {
  list: async (page = 1, perPage = 50) => {
    const from = (page - 1) * perPage
    const { data, error, count } = await supabase
      .from('feeding_logs')
      .select('*, turtles(name)', { count: 'exact' })
      .order('date', { ascending: false })
      .range(from, from + perPage - 1)
    if (error) throw error
    return { items: data ?? [], totalItems: count ?? 0 }
  },
  create: (data: Record<string, unknown>) => supabase.from('feeding_logs').insert(data).select().single(),
  delete: (id: string) => supabase.from('feeding_logs').delete().eq('id', id),
}

export const waterChanges = {
  list: async (page = 1, perPage = 50) => {
    const from = (page - 1) * perPage
    const { data, error, count } = await supabase
      .from('water_changes')
      .select('*', { count: 'exact' })
      .order('date', { ascending: false })
      .range(from, from + perPage - 1)
    if (error) throw error
    return { items: data ?? [], totalItems: count ?? 0 }
  },
  create: (data: Record<string, unknown>) => supabase.from('water_changes').insert(data).select().single(),
  delete: (id: string) => supabase.from('water_changes').delete().eq('id', id),
}

export const growthRecords = {
  list: async (page = 1, perPage = 50) => {
    const from = (page - 1) * perPage
    const { data, error, count } = await supabase
      .from('growth_records')
      .select('*, turtles(name)', { count: 'exact' })
      .order('date', { ascending: false })
      .range(from, from + perPage - 1)
    if (error) throw error
    return { items: data ?? [], totalItems: count ?? 0 }
  },
  create: (data: Record<string, unknown>) => supabase.from('growth_records').insert(data).select().single(),
  delete: (id: string) => supabase.from('growth_records').delete().eq('id', id),
}

export const environmentLogs = {
  list: async (page = 1, perPage = 50) => {
    const from = (page - 1) * perPage
    const { data, error, count } = await supabase
      .from('environment_logs')
      .select('*', { count: 'exact' })
      .order('date', { ascending: false })
      .range(from, from + perPage - 1)
    if (error) throw error
    return { items: data ?? [], totalItems: count ?? 0 }
  },
  create: (data: Record<string, unknown>) => supabase.from('environment_logs').insert(data).select().single(),
  delete: (id: string) => supabase.from('environment_logs').delete().eq('id', id),
}

export const healthLogs = {
  list: async (page = 1, perPage = 50) => {
    const from = (page - 1) * perPage
    const { data, error, count } = await supabase
      .from('health_logs')
      .select('*, turtles(name)', { count: 'exact' })
      .order('date', { ascending: false })
      .range(from, from + perPage - 1)
    if (error) throw error
    return { items: data ?? [], totalItems: count ?? 0 }
  },
  create: (data: Record<string, unknown>) => supabase.from('health_logs').insert(data).select().single(),
  delete: (id: string) => supabase.from('health_logs').delete().eq('id', id),
}

export default supabase
