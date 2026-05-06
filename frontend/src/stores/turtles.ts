import { defineStore } from 'pinia'
import { ref } from 'vue'
import { turtles as turtlesApi } from '@/lib/pb'
import type { Turtle } from '@/types'

export const useTurtleStore = defineStore('turtles', () => {
  const turtleList = ref<Turtle[]>([])
  const loading = ref(false)
  const error = ref('')

  async function fetchTurtles() {
    loading.value = true
    error.value = ''
    try {
      const result = await turtlesApi.list()
      turtleList.value = result.items as unknown as Turtle[]
    } catch (e: unknown) {
      error.value = e instanceof Error ? e.message : '加载失败'
    } finally {
      loading.value = false
    }
  }

  async function createTurtle(data: Partial<Turtle>) {
    const created = await turtlesApi.create(data)
    turtleList.value.unshift(created as unknown as Turtle)
    return created
  }

  async function updateTurtle(id: string, data: Partial<Turtle>) {
    const updated = await turtlesApi.update(id, data)
    const idx = turtleList.value.findIndex(t => t.id === id)
    if (idx !== -1) turtleList.value[idx] = updated as unknown as Turtle
    return updated
  }

  async function deleteTurtle(id: string) {
    await turtlesApi.delete(id)
    turtleList.value = turtleList.value.filter(t => t.id !== id)
  }

  return { turtleList, loading, error, fetchTurtles, createTurtle, updateTurtle, deleteTurtle }
})
