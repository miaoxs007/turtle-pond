<script setup lang="ts">
import { onMounted, ref, computed } from 'vue'
import { Plus, Trash2 } from 'lucide-vue-next'
import { useTurtleStore } from '@/stores/turtles'
import { useFeedingStore } from '@/stores/feeding'
import type { FoodType, FoodUnit } from '@/types'

const turtleStore = useTurtleStore()
const store = useFeedingStore()

const showForm = ref(false)
const saving = ref(false)
const form = ref({
  turtle: '',
  date: new Date().toISOString().slice(0, 16),
  food_type: '龟粮' as FoodType,
  quantity: '',
  unit: '颗' as FoodUnit,
  notes: '',
})

const foodTypes: FoodType[] = ['龟粮', '活鱼', '活虾', '蚯蚓', '饲料鱼', '其他']
const units: FoodUnit[] = ['颗', '条', '克']

const sortedLogs = computed(() =>
  [...store.logs].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
)

onMounted(async () => {
  await Promise.all([turtleStore.fetchTurtles(), store.fetchLogs()])
})

async function submit() {
  if (!form.value.turtle || !form.value.quantity) return
  saving.value = true
  try {
    await store.createLog({
      turtle: form.value.turtle,
      date: new Date(form.value.date).toISOString(),
      food_type: form.value.food_type,
      quantity: Number(form.value.quantity),
      unit: form.value.unit,
      notes: form.value.notes,
    })
    form.value = {
      turtle: '',
      date: new Date().toISOString().slice(0, 16),
      food_type: '龟粮',
      quantity: '',
      unit: '颗',
      notes: '',
    }
    showForm.value = false
  } catch (e) {
    console.error(e)
  } finally {
    saving.value = false
  }
}

function formatDate(d: string) {
  return new Date(d).toLocaleDateString('zh-CN', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })
}
</script>

<template>
  <div class="max-w-3xl mx-auto">
    <div class="flex items-center justify-between mb-6">
      <h1 class="text-2xl font-display font-semibold" style="color: var(--color-text-primary);">
        🍽️ 喂食记录
      </h1>
      <button @click="showForm = !showForm" class="btn btn-primary">
        <Plus :size="16" /> 记录喂食
      </button>
    </div>

    <!-- Quick add form -->
    <div v-if="showForm" class="card p-5 mb-6 animate-scale-in">
      <h3 class="font-semibold text-sm mb-4" style="color: var(--color-text-primary);">快速记录</h3>
      <div class="space-y-3">
        <div class="grid grid-cols-2 gap-3">
          <div>
            <label class="block text-xs mb-1" style="color: var(--color-text-muted);">龟龟</label>
            <select v-model="form.turtle" class="input">
              <option value="">选择龟龟</option>
              <option v-for="t in turtleStore.turtleList" :key="t.id" :value="t.id">{{ t.name }}</option>
            </select>
          </div>
          <div>
            <label class="block text-xs mb-1" style="color: var(--color-text-muted);">时间</label>
            <input v-model="form.date" type="datetime-local" class="input" />
          </div>
        </div>
        <div class="grid grid-cols-3 gap-3">
          <div>
            <label class="block text-xs mb-1" style="color: var(--color-text-muted);">食物</label>
            <select v-model="form.food_type" class="input">
              <option v-for="f in foodTypes" :key="f" :value="f">{{ f }}</option>
            </select>
          </div>
          <div>
            <label class="block text-xs mb-1" style="color: var(--color-text-muted);">数量</label>
            <input v-model="form.quantity" type="number" class="input" placeholder="数量" />
          </div>
          <div>
            <label class="block text-xs mb-1" style="color: var(--color-text-muted);">单位</label>
            <select v-model="form.unit" class="input">
              <option v-for="u in units" :key="u" :value="u">{{ u }}</option>
            </select>
          </div>
        </div>
        <div class="flex gap-2">
          <button @click="submit" class="btn btn-primary flex-1 justify-center" :disabled="saving">
            {{ saving ? '保存中...' : '保存' }}
          </button>
          <button @click="showForm = false" class="btn btn-secondary">取消</button>
        </div>
      </div>
    </div>

    <!-- Loading -->
    <div v-if="store.loading" class="text-sm" style="color: var(--color-text-muted);">加载中...</div>

    <!-- Empty -->
    <div v-else-if="sortedLogs.length === 0" class="card p-10 text-center">
      <div class="text-5xl mb-3">🍽️</div>
      <p style="color: var(--color-text-muted);">还没有喂食记录，今天先喂一顿？</p>
    </div>

    <!-- List -->
    <div v-else class="card overflow-hidden">
      <div
        v-for="(log, i) in sortedLogs"
        :key="log.id"
        class="flex items-center gap-4 px-4 py-3 animate-fade-in"
        :style="{ borderBottom: i < sortedLogs.length - 1 ? '1px solid var(--color-border)' : 'none' }"
      >
        <div class="text-2xl flex-shrink-0">🐢</div>
        <div class="flex-1 min-w-0">
          <div class="text-sm font-medium" style="color: var(--color-text-primary);">
            {{ (log as any).expand?.turtle?.name || '未知龟龟' }}
          </div>
          <div class="text-xs" style="color: var(--color-text-muted);">
            {{ log.food_type }} × {{ log.quantity }}{{ log.unit }}
            <span v-if="log.notes"> · {{ log.notes }}</span>
          </div>
        </div>
        <div class="flex items-center gap-2 flex-shrink-0">
          <span class="text-xs" style="color: var(--color-text-muted);">{{ formatDate(log.date) }}</span>
          <button
            @click="store.deleteLog(log.id)"
            class="btn btn-ghost p-1"
            style="color: var(--color-danger);"
          >
            <Trash2 :size="14" />
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
