<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ArrowLeft, Save } from 'lucide-vue-next'
import { useTurtleStore } from '@/stores/turtles'

const route = useRoute()
const router = useRouter()
const store = useTurtleStore()

const isEdit = !!route.params.id
const saving = ref(false)
const error = ref('')

const form = ref({
  name: '',
  species: '',
  purchase_date: new Date().toISOString().split('T')[0],
  weight_latest: '',
  size_latest: '',
  notes: '',
})

onMounted(async () => {
  if (isEdit) {
    await store.fetchTurtles()
    const t = store.turtleList.find(t => t.id === route.params.id)
    if (t) {
      form.value = {
        name: t.name,
        species: t.species,
        purchase_date: t.purchase_date,
        weight_latest: String(t.weight_latest || ''),
        size_latest: String(t.size_latest || ''),
        notes: t.notes,
      }
    }
  }
})

async function save() {
  if (!form.value.name.trim()) {
    error.value = '请输入龟龟名字'
    return
  }
  saving.value = true
  error.value = ''
  try {
    const data = {
      name: form.value.name,
      species: form.value.species,
      purchase_date: form.value.purchase_date,
      weight_latest: Number(form.value.weight_latest) || 0,
      size_latest: Number(form.value.size_latest) || 0,
      notes: form.value.notes,
    }
    if (isEdit) {
      await store.updateTurtle(route.params.id as string, data)
    } else {
      await store.createTurtle(data)
    }
    router.push('/turtles')
  } catch (e: unknown) {
    error.value = e instanceof Error ? e.message : '保存失败'
  } finally {
    saving.value = false
  }
}
</script>

<template>
  <div class="max-w-lg mx-auto">
    <!-- Header -->
    <div class="flex items-center gap-3 mb-6">
      <button @click="router.back()" class="btn btn-ghost p-2">
        <ArrowLeft :size="20" />
      </button>
      <h1 class="text-xl font-display font-semibold" style="color: var(--color-text-primary);">
        {{ isEdit ? '编辑龟龟' : '新增龟龟' }}
      </h1>
    </div>

    <div class="card p-6">
      <!-- Avatar placeholder -->
      <div class="flex justify-center mb-6">
        <div
          class="w-20 h-20 rounded-2xl flex items-center justify-center text-4xl"
          style="background: rgba(74,124,89,0.1);"
        >
          🐢
        </div>
      </div>

      <div class="space-y-4">
        <div>
          <label class="block text-sm font-medium mb-1.5" style="color: var(--color-text-secondary);">
            名字 <span style="color: var(--color-danger);">*</span>
          </label>
          <input v-model="form.name" class="input" placeholder="给龟龟起个名字" />
        </div>

        <div>
          <label class="block text-sm font-medium mb-1.5" style="color: var(--color-text-secondary);">
            物种
          </label>
          <input v-model="form.species" class="input" placeholder="例如：头盔龟、麝香龟" />
        </div>

        <div>
          <label class="block text-sm font-medium mb-1.5" style="color: var(--color-text-secondary);">
            入养日期
          </label>
          <input v-model="form.purchase_date" type="date" class="input" />
        </div>

        <div class="grid grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium mb-1.5" style="color: var(--color-text-secondary);">
              最新体重 (g)
            </label>
            <input v-model="form.weight_latest" type="number" class="input" placeholder="0" />
          </div>
          <div>
            <label class="block text-sm font-medium mb-1.5" style="color: var(--color-text-secondary);">
              背甲长度 (mm)
            </label>
            <input v-model="form.size_latest" type="number" class="input" placeholder="0" />
          </div>
        </div>

        <div>
          <label class="block text-sm font-medium mb-1.5" style="color: var(--color-text-secondary);">
            备注
          </label>
          <textarea
            v-model="form.notes"
            class="input"
            rows="3"
            placeholder="其他备注..."
            style="resize: vertical;"
          />
        </div>

        <div v-if="error" class="text-sm" style="color: var(--color-danger);">{{ error }}</div>

        <button @click="save" class="btn btn-primary w-full justify-center" :disabled="saving">
          <Save :size="16" />
          {{ saving ? '保存中...' : (isEdit ? '保存修改' : '添加龟龟') }}
        </button>
      </div>
    </div>
  </div>
</template>
