<script setup lang="ts">
import { onMounted, ref, computed } from 'vue'
import { Plus, Trash2 } from 'lucide-vue-next'
import { useWaterStore } from '@/stores/water'

const store = useWaterStore()
const showForm = ref(false)
const saving = ref(false)
const form = ref({
  date: new Date().toISOString().slice(0, 16),
  ratio: 50,
  water_temp: '',
  notes: '',
})

const sortedLogs = computed(() =>
  [...store.logs].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
)

onMounted(() => store.fetchLogs())

async function submit() {
  saving.value = true
  try {
    await store.createLog({
      date: new Date(form.value.date).toISOString(),
      ratio: form.value.ratio,
      water_temp: Number(form.value.water_temp) || 0,
      notes: form.value.notes,
    })
    form.value = { date: new Date().toISOString().slice(0, 16), ratio: 50, water_temp: '', notes: '' }
    showForm.value = false
  } catch (e) { console.error(e) }
  finally { saving.value = false }
}

function formatDate(d: string) {
  return new Date(d).toLocaleDateString('zh-CN', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })
}

function ratioColor(r: number) {
  if (r >= 80) return 'var(--color-accent-water)'
  if (r >= 50) return 'var(--color-accent-light)'
  return 'var(--color-text-muted)'
}
</script>

<template>
  <div class="max-w-3xl mx-auto">
    <div class="flex items-center justify-between mb-6">
      <h1 class="text-2xl font-display font-semibold" style="color: var(--color-text-primary);">
        💧 换水记录
      </h1>
      <button @click="showForm = !showForm" class="btn btn-primary">
        <Plus :size="16" /> 记录换水
      </button>
    </div>

    <!-- Form -->
    <div v-if="showForm" class="card p-5 mb-6 animate-scale-in">
      <h3 class="font-semibold text-sm mb-4" style="color: var(--color-text-primary);">快速记录</h3>
      <div class="space-y-3">
        <div>
          <label class="block text-xs mb-1" style="color: var(--color-text-muted);">时间</label>
          <input v-model="form.date" type="datetime-local" class="input" />
        </div>
        <div>
          <label class="block text-xs mb-2" style="color: var(--color-text-muted);">
            换水比例: <strong :style="{ color: ratioColor(form.ratio) }">{{ form.ratio }}%</strong>
          </label>
          <input v-model="form.ratio" type="range" min="10" max="100" step="5" class="w-full" />
          <div class="flex justify-between text-xs mt-1" style="color: var(--color-text-muted);">
            <span>10%</span><span>50%</span><span>100%</span>
          </div>
        </div>
        <div>
          <label class="block text-xs mb-1" style="color: var(--color-text-muted);">水温 (°C)</label>
          <input v-model="form.water_temp" type="number" class="input" placeholder="例如：25" />
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
      <div class="text-5xl mb-3">💧</div>
      <p style="color: var(--color-text-muted);">还没有换水记录</p>
    </div>

    <div v-else class="space-y-3">
      <div
        v-for="log in sortedLogs"
        :key="log.id"
        class="card p-4 flex items-center gap-4 animate-fade-in-up"
      >
        <div
          class="w-12 h-12 rounded-xl flex items-center justify-center text-xl flex-shrink-0"
          :style="{ background: `rgba(91,143,168,${log.ratio / 200})` }"
        >
          💧
        </div>
        <div class="flex-1 min-w-0">
          <div class="flex items-center gap-2 mb-1">
            <span
              class="text-sm font-semibold"
              :style="{ color: ratioColor(log.ratio) }"
            >
              {{ log.ratio }}% 换水
            </span>
            <span v-if="log.water_temp" class="text-xs badge badge-blue">
              {{ log.water_temp }}°C
            </span>
          </div>
          <div v-if="log.notes" class="text-xs" style="color: var(--color-text-muted);">{{ log.notes }}</div>
        </div>
        <div class="flex items-center gap-2 flex-shrink-0">
          <span class="text-xs" style="color: var(--color-text-muted);">{{ formatDate(log.date) }}</span>
          <button @click="store.deleteLog(log.id)" class="btn btn-ghost p-1" style="color: var(--color-danger);">
            <Trash2 :size="14" />
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
