import { defineStore } from 'pinia'
import { ref } from 'vue'
import { feedingLogs as feedingApi } from '@/lib/pb'
import type { FeedingLog } from '@/types'

export const useFeedingStore = defineStore('feeding', () => {
  const logs = ref<FeedingLog[]>([])
  const loading = ref(false)
  const error = ref('')

  async function fetchLogs() {
    loading.value = true
    error.value = ''
    try {
      const result = await feedingApi.list()
      logs.value = result.items as unknown as FeedingLog[]
    } catch (e: unknown) {
      error.value = e instanceof Error ? e.message : '加载失败'
    } finally {
      loading.value = false
    }
  }

  async function createLog(data: Partial<FeedingLog>) {
    const created = await feedingApi.create(data)
    logs.value.unshift(created as unknown as FeedingLog)
    return created
  }

  async function deleteLog(id: string) {
    await feedingApi.delete(id)
    logs.value = logs.value.filter(l => l.id !== id)
  }

  return { logs, loading, error, fetchLogs, createLog, deleteLog }
})
