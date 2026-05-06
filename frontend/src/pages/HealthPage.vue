<script setup lang="ts">
import { onMounted, ref, computed } from 'vue'
import { Plus, Trash2 } from 'lucide-vue-next'
import { useTurtleStore } from '@/stores/turtles'
import { useHealthStore } from '@/stores/health'
import type { HealthStatus } from '@/types'

const turtleStore = useTurtleStore()
const store = useHealthStore()
const showForm = ref(false)
const saving = ref(false)
const form = ref({
  turtle: '',
  date: new Date().toISOString().split('T')[0],
  status: '正常' as HealthStatus,
  shell_check: '',
  eye_check: '',
  notes: '',
})

const statusOptions: HealthStatus[] = ['正常', '活跃', '拒食', '腐甲', '感冒', '其他异常']

const sortedLogs = computed(() =>
  [...store.logs].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
)

const statusBadge = (s: HealthStatus) => {
  if (s === '正常' || s === '活跃') return 'badge-green'
  return 'badge-danger'
}

onMounted(async () => {
  await Promise.all([turtleStore.fetchTurtles(), store.fetchLogs()])
})

async function submit() {
  if (!form.value.turtle) return
  saving.value = true
  try {
    await store.createLog({
      turtle: form.value.turtle,
      date: form.value.date,
      status: form.value.status,
      shell_check: form.value.shell_check,
      eye_check: form.value.eye_check,
      notes: form.value.notes,
    })
    form.value = { turtle: '', date: new Date().toISOString().split('T')[0], status: '正常', shell_check: '', eye_check: '', notes: '' }
    showForm.value = false
  } catch (e) { console.error(e) }
  finally { saving.value = false }
}

function formatDate(d: string) {
  return new Date(d).toLocaleDateString('zh-CN', { month: 'short', day: 'numeric', year: 'numeric' })
}
</script>

<template>
  <div class="max-w-3xl mx-auto">
    <div class="flex items-center justify-between mb-6">
      <h1 class="text-2xl font-display font-semibold" style="color: var(--color-text-primary);">
        🩺 健康日志
      </h1>
      <button @click="showForm = !showForm" class="btn btn-primary">
        <Plus :size="16" /> 记录健康
      </button>
    </div>

    <!-- Form -->
    <div v-if="showForm" class="card p-5 mb-6 animate-scale-in">
      <h3 class="font-semibold text-sm mb-4" style="color: var(--color-text-primary);">健康检查</h3>
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
            <label class="block text-xs mb-1" style="color: var(--color-text-muted);">日期</label>
            <input v-model="form.date" type="date" class="input" />
          </div>
        </div>
        <div>
          <label class="block text-xs mb-2" style="color: var(--color-text-muted);">健康状态</label>
          <div class="flex flex-wrap gap-2">
            <button
              v-for="s in statusOptions"
              :key="s"
              @click="form.status = s"
              :class="['badge cursor-pointer', statusBadge(s as HealthStatus)]"
              :style="{ opacity: form.status === s ? 1 : 0.5 }"
            >
              {{ s }}
            </button>
          </div>
        </div>
        <div class="grid grid-cols-2 gap-3">
          <div>
            <label class="block text-xs mb-1" style="color: var(--color-text-muted);">甲壳检查</label>
            <input v-model="form.shell_check" class="input" placeholder="正常/轻微划痕..." />
          </div>
          <div>
            <label class="block text-xs mb-1" style="color: var(--color-text-muted);">眼睛检查</label>
            <input v-model="form.eye_check" class="input" placeholder="明亮/有分泌物..." />
          </div>
        </div>
        <div>
          <label class="block text-xs mb-1" style="color: var(--color-text-muted);">备注</label>
          <input v-model="form.notes" class="input" placeholder="其他观察..." />
        </div>
        <div class="flex gap-2">
          <button @click="submit" class="btn btn-primary flex-1 justify-center" :disabled="saving">
            {{ saving ? '保存中...' : '保存' }}
          </button>
          <button @click="showForm = false" class="btn btn-secondary">取消</button>
        </div>
      </div>
    </div>

    <div v-if="store.loading" class="text-sm" style="color: var(--color-text-muted);">加载中...</div>

    <div v-else-if="sortedLogs.length === 0" class="card p-10 text-center">
      <div class="text-5xl mb-3">🩺</div>
      <p style="color: var(--color-text-muted);">还没有健康记录，定期检查很重要</p>
    </div>

    <div v-else class="card overflow-hidden">
      <div
        v-for="(log, i) in sortedLogs"
        :key="log.id"
        class="px-4 py-3"
        :style="{ borderBottom: i < sortedLogs.length - 1 ? '1px solid var(--color-border)' : 'none' }"
      >
        <div class="flex items-center justify-between mb-2">
          <div class="flex items-center gap-2">
            <span class="text-lg">🐢</span>
            <span class="text-sm font-medium" style="color: var(--color-text-primary);">
              {{ (log as any).expand?.turtle?.name || '未知' }}
            </span>
            <span :class="['badge', statusBadge(log.status as HealthStatus)]">{{ log.status }}</span>
          </div>
          <div class="flex items-center gap-2">
            <span class="text-xs" style="color: var(--color-text-muted);">{{ formatDate(log.date) }}</span>
            <button @click="store.deleteLog(log.id)" class="btn btn-ghost p-1" style="color: var(--color-danger);">
              <Trash2 :size="14" />
            </button>
          </div>
        </div>
        <div class="flex gap-4 text-xs" style="color: var(--color-text-muted);">
          <span v-if="log.shell_check">甲壳: {{ log.shell_check }}</span>
          <span v-if="log.eye_check">眼睛: {{ log.eye_check }}</span>
          <span v-if="log.notes">{{ log.notes }}</span>
        </div>
      </div>
    </div>
  </div>
</template>
