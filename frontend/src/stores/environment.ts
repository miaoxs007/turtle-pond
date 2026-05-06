import { defineStore } from 'pinia'
import { ref } from 'vue'
import { environmentLogs as envApi } from '@/lib/pb'
import type { EnvironmentLog } from '@/types'

export const useEnvironmentStore = defineStore('environment', () => {
  const logs = ref<EnvironmentLog[]>([])
  const loading = ref(false)
  const error = ref('')

  async function fetchLogs() {
    loading.value = true
    error.value = ''
    try {
      const result = await envApi.list()
      logs.value = result.items as unknown as EnvironmentLog[]
    } catch (e: unknown) {
      error.value = e instanceof Error ? e.message : '加载失败'
    } finally {
      loading.value = false
    }
  }

  async function createLog(data: Partial<EnvironmentLog>) {
    const created = await envApi.create(data)
    logs.value.unshift(created as unknown as EnvironmentLog)
    return created
  }

  async function deleteLog(id: string) {
    await envApi.delete(id)
    logs.value = logs.value.filter(l => l.id !== id)
  }

  return { logs, loading, error, fetchLogs, createLog, deleteLog }
})
