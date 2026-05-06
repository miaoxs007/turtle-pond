import { defineStore } from 'pinia'
import { ref } from 'vue'
import { waterChanges as waterApi } from '@/lib/pb'
import type { WaterChange } from '@/types'

export const useWaterStore = defineStore('water', () => {
  const logs = ref<WaterChange[]>([])
  const loading = ref(false)
  const error = ref('')

  async function fetchLogs() {
    loading.value = true
    error.value = ''
    try {
      const result = await waterApi.list()
      logs.value = result.items as unknown as WaterChange[]
    } catch (e: unknown) {
      error.value = e instanceof Error ? e.message : '加载失败'
    } finally {
      loading.value = false
    }
  }

  async function createLog(data: Partial<WaterChange>) {
    const created = await waterApi.create(data)
    logs.value.unshift(created as unknown as WaterChange)
    return created
  }

  async function deleteLog(id: string) {
    await waterApi.delete(id)
    logs.value = logs.value.filter(l => l.id !== id)
  }

  return { logs, loading, error, fetchLogs, createLog, deleteLog }
})
