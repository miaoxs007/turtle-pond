import { defineStore } from 'pinia'
import { ref } from 'vue'
import { healthLogs as healthApi } from '@/lib/supabase'
import type { HealthLog } from '@/types'

export const useHealthStore = defineStore('health', () => {
  const logs = ref<HealthLog[]>([])
  const loading = ref(false)
  const error = ref('')

  async function fetchLogs() {
    loading.value = true
    error.value = ''
    try {
      const result = await healthApi.list()
      logs.value = result.items as unknown as HealthLog[]
    } catch (e: unknown) {
      error.value = e instanceof Error ? e.message : '加载失败'
    } finally {
      loading.value = false
    }
  }

  async function createLog(data: Partial<HealthLog>) {
    const created = await healthApi.create(data)
    logs.value.unshift(created as unknown as HealthLog)
    return created
  }

  async function deleteLog(id: string) {
    await healthApi.delete(id)
    logs.value = logs.value.filter(l => l.id !== id)
  }

  return { logs, loading, error, fetchLogs, createLog, deleteLog }
})
