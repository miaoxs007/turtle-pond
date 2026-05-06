<script setup lang="ts">
import { onMounted, ref, computed } from 'vue'
import { Plus, Trash2 } from 'lucide-vue-next'
import { useEnvironmentStore } from '@/stores/environment'
import type { FilterStatus, LightStatus } from '@/types'

const store = useEnvironmentStore()
const showForm = ref(false)
const saving = ref(false)
const form = ref({
  date: new Date().toISOString().slice(0, 16),
  water_temp: '',
  air_temp: '',
  humidity: '',
  filter_status: '正常' as FilterStatus,
  light_status: '开' as LightStatus,
  notes: '',
})

const filterOptions: FilterStatus[] = ['正常', '需清洗', '更换']
const lightOptions: LightStatus[] = ['开', '关']

const sortedLogs = computed(() =>
  [...store.logs].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
)

onMounted(() => store.fetchLogs())

async function submit() {
  saving.value = true
  try {
    await store.createLog({
      date: new Date(form.value.date).toISOString(),
      water_temp: Number(form.value.water_temp) || 0,
      air_temp: Number(form.value.air_temp) || 0,
      humidity: Number(form.value.humidity) || 0,
      filter_status: form.value.filter_status,
      light_status: form.value.light_status,
      notes: form.value.notes,
    })
    form.value = { date: new Date().toISOString().slice(0, 16), water_temp: '', air_temp: '', humidity: '', filter_status: '正常', light_status: '开', notes: '' }
    showForm.value = false
  } catch (e) { console.error(e) }
  finally { saving.value = false }
}

function formatDate(d: string) {
  return new Date(d).toLocaleDateString('zh-CN', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })
}
</script>

<template>
  <div class="max-w-3xl mx-auto">
    <div class="flex items-center justify-between mb-6">
      <h1 class="text-2xl font-display font-semibold" style="color: var(--color-text-primary);">
        🌡️ 环境监测
      </h1>
      <button @click="showForm = !showForm" class="btn btn-primary">
        <Plus :size="16" /> 记录环境
      </button>
    </div>

    <!-- Form -->
    <div v-if="showForm" class="card p-5 mb-6 animate-scale-in">
      <h3 class="font-semibold text-sm mb-4" style="color: var(--color-text-primary);">环境记录</h3>
      <div class="space-y-3">
        <div>
          <label class="block text-xs mb-1" style="color: var(--color-text-muted);">时间</label>
          <input v-model="form.date" type="datetime-local" class="input" />
        </div>
        <div class="grid grid-cols-3 gap-3">
          <div>
            <label class="block text-xs mb-1" style="color: var(--color-text-muted);">水温 (°C)</label>
            <input v-model="form.water_temp" type="number" class="input" placeholder="25" />
          </div>
          <div>
            <label class="block text-xs mb-1" style="color: var(--color-text-muted);">气温 (°C)</label>
            <input v-model="form.air_temp" type="number" class="input" placeholder="28" />
          </div>
          <div>
            <label class="block text-xs mb-1" style="color: var(--color-text-muted);">湿度 (%)</label>
            <input v-model="form.humidity" type="number" class="input" placeholder="70" />
          </div>
        </div>
        <div class="grid grid-cols-2 gap-3">
          <div>
            <label class="block text-xs mb-1" style="color: var(--color-text-muted);">过滤器</label>
            <select v-model="form.filter_status" class="input">
              <option v-for="o in filterOptions" :key="o" :value="o">{{ o }}</option>
            </select>
          </div>
          <div>
            <label class="block text-xs mb-1" style="color: var(--color-text-muted);">灯光</label>
            <select v-model="form.light_status" class="input">
              <option v-for="o in lightOptions" :key="o" :value="o">{{ o }}</option>
            </select>
          </div>
        </div>
        <div>
          <label class="block text-xs mb-1" style="color: var(--color-text-muted);">备注</label>
          <input v-model="form.notes" class="input" placeholder="可选备注..." />
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
      <div class="text-5xl mb-3">🌡️</div>
      <p style="color: var(--color-text-muted);">还没有环境记录</p>
    </div>

    <div v-else class="space-y-3">
      <div
        v-for="log in sortedLogs"
        :key="log.id"
        class="card p-4 animate-fade-in-up"
      >
        <div class="flex items-start justify-between mb-3">
          <span class="text-xs" style="color: var(--color-text-muted);">{{ formatDate(log.date) }}</span>
          <button @click="store.deleteLog(log.id)" class="btn btn-ghost p-1" style="color: var(--color-danger);">
            <Trash2 :size="14" />
          </button>
        </div>
        <div class="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div v-if="log.water_temp" class="text-center p-2 rounded-lg" style="background: rgba(91,143,168,0.08);">
            <div class="text-xs mb-1" style="color: var(--color-text-muted);">💧 水温</div>
            <div class="font-mono font-bold" style="color: var(--color-accent-water);">{{ log.water_temp }}°C</div>
          </div>
          <div v-if="log.air_temp" class="text-center p-2 rounded-lg" style="background: rgba(193,122,74,0.08);">
            <div class="text-xs mb-1" style="color: var(--color-text-muted);">🌡️ 气温</div>
            <div class="font-mono font-bold" style="color: var(--color-accent-warm);">{{ log.air_temp }}°C</div>
          </div>
          <div v-if="log.humidity" class="text-center p-2 rounded-lg" style="background: rgba(74,124,89,0.08);">
            <div class="text-xs mb-1" style="color: var(--color-text-muted);">💨 湿度</div>
            <div class="font-mono font-bold" style="color: var(--color-accent-green);">{{ log.humidity }}%</div>
          </div>
          <div class="text-center p-2 rounded-lg" style="background: rgba(74,124,89,0.05);">
            <div class="text-xs mb-1" style="color: var(--color-text-muted);">🔘 过滤器</div>
            <span :class="['badge', log.filter_status === '正常' ? 'badge-green' : 'badge-warm']">
              {{ log.filter_status }}
            </span>
          </div>
          <div v-if="log.light_status" class="text-center p-2 rounded-lg" style="background: rgba(193,122,74,0.05);">
            <div class="text-xs mb-1" style="color: var(--color-text-muted);">💡 灯光</div>
            <span class="badge" :style="{ background: log.light_status === '开' ? 'rgba(193,122,74,0.12)' : 'rgba(139,154,140,0.12)', color: log.light_status === '开' ? 'var(--color-accent-warm)' : 'var(--color-text-muted)' }">
              {{ log.light_status }}
            </span>
          </div>
        </div>
        <div v-if="log.notes" class="mt-2 text-xs" style="color: var(--color-text-muted);">{{ log.notes }}</div>
      </div>
    </div>
  </div>
</template>
