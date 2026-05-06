import { defineStore } from 'pinia'
import { ref } from 'vue'
import { growthRecords as growthApi } from '@/lib/pb'
import type { GrowthRecord } from '@/types'

export const useGrowthStore = defineStore('growth', () => {
  const records = ref<GrowthRecord[]>([])
  const loading = ref(false)
  const error = ref('')

  async function fetchRecords() {
    loading.value = true
    error.value = ''
    try {
      const result = await growthApi.list()
      records.value = result.items as unknown as GrowthRecord[]
    } catch (e: unknown) {
      error.value = e instanceof Error ? e.message : '加载失败'
    } finally {
      loading.value = false
    }
  }

  async function createRecord(data: Partial<GrowthRecord>) {
    const created = await growthApi.create(data)
    records.value.unshift(created as unknown as GrowthRecord)
    return created
  }

  async function deleteRecord(id: string) {
    await growthApi.delete(id)
    records.value = records.value.filter(r => r.id !== id)
  }

  return { records, loading, error, fetchRecords, createRecord, deleteRecord }
})
