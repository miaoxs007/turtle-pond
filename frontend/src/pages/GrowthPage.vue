<script setup lang="ts">
import { onMounted, ref, computed } from 'vue'
import { Plus, Trash2 } from 'lucide-vue-next'
import { useTurtleStore } from '@/stores/turtles'
import { useGrowthStore } from '@/stores/growth'

const turtleStore = useTurtleStore()
const store = useGrowthStore()
const showForm = ref(false)
const saving = ref(false)
const form = ref({
  turtle: '',
  date: new Date().toISOString().split('T')[0],
  weight: '',
  carapace_length: '',
  ventral_length: '',
  notes: '',
})

const sortedRecords = computed(() =>
  [...store.records].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
)

onMounted(async () => {
  await Promise.all([turtleStore.fetchTurtles(), store.fetchRecords()])
})

async function submit() {
  if (!form.value.turtle) return
  saving.value = true
  try {
    await store.createRecord({
      turtle: form.value.turtle,
      date: form.value.date,
      weight: Number(form.value.weight) || 0,
      carapace_length: Number(form.value.carapace_length) || 0,
      ventral_length: Number(form.value.ventral_length) || 0,
      notes: form.value.notes,
    })
    form.value = { turtle: '', date: new Date().toISOString().split('T')[0], weight: '', carapace_length: '', ventral_length: '', notes: '' }
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
        📈 成长记录
      </h1>
      <button @click="showForm = !showForm" class="btn btn-primary">
        <Plus :size="16" /> 记录成长
      </button>
    </div>

    <!-- Form -->
    <div v-if="showForm" class="card p-5 mb-6 animate-scale-in">
      <h3 class="font-semibold text-sm mb-4" style="color: var(--color-text-primary);">新增记录</h3>
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
        <div class="grid grid-cols-3 gap-3">
          <div>
            <label class="block text-xs mb-1" style="color: var(--color-text-muted);">体重 (g)</label>
            <input v-model="form.weight" type="number" class="input" placeholder="0" />
          </div>
          <div>
            <label class="block text-xs mb-1" style="color: var(--color-text-muted);">背甲 (mm)</label>
            <input v-model="form.carapace_length" type="number" class="input" placeholder="0" />
          </div>
          <div>
            <label class="block text-xs mb-1" style="color: var(--color-text-muted);">腹甲 (mm)</label>
            <input v-model="form.ventral_length" type="number" class="input" placeholder="0" />
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

    <div v-else-if="sortedRecords.length === 0" class="card p-10 text-center">
      <div class="text-5xl mb-3">📈</div>
      <p style="color: var(--color-text-muted);">还没有成长记录，定期记录更科学哦</p>
    </div>

    <div v-else class="card overflow-hidden">
      <div
        v-for="(rec, i) in sortedRecords"
        :key="rec.id"
        class="flex items-center gap-4 px-4 py-3"
        :style="{ borderBottom: i < sortedRecords.length - 1 ? '1px solid var(--color-border)' : 'none' }"
      >
        <div class="text-2xl flex-shrink-0">🐢</div>
        <div class="flex-1 min-w-0">
          <div class="text-sm font-medium" style="color: var(--color-text-primary);">
            {{ (rec as any).expand?.turtle?.name || '未知' }}
          </div>
          <div class="flex gap-3 text-xs mt-0.5" style="color: var(--color-text-muted);">
            <span>体重 <strong class="font-mono">{{ rec.weight }}g</strong></span>
            <span>背甲 <strong class="font-mono">{{ rec.carapace_length }}mm</strong></span>
            <span v-if="rec.ventral_length">腹甲 <strong class="font-mono">{{ rec.ventral_length }}mm</strong></span>
          </div>
          <div v-if="rec.notes" class="text-xs mt-0.5" style="color: var(--color-text-muted);">{{ rec.notes }}</div>
        </div>
        <div class="flex items-center gap-2 flex-shrink-0">
          <span class="text-xs" style="color: var(--color-text-muted);">{{ formatDate(rec.date) }}</span>
          <button @click="store.deleteRecord(rec.id)" class="btn btn-ghost p-1" style="color: var(--color-danger);">
            <Trash2 :size="14" />
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
