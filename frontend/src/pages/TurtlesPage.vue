<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { RouterLink } from 'vue-router'
import { Plus, Pencil, Trash2 } from 'lucide-vue-next'
import { useTurtleStore } from '@/stores/turtles'

const store = useTurtleStore()
const showDelete = ref<string | null>(null)
const deleteName = ref('')

onMounted(() => store.fetchTurtles())

async function confirmDelete(id: string, name: string) {
  if (deleteName.value === name) {
    await store.deleteTurtle(id)
    showDelete.value = null
    deleteName.value = ''
  }
}

function formatDate(d: string) {
  return d ? new Date(d).toLocaleDateString('zh-CN', { year: 'numeric', month: 'short', day: 'numeric' }) : '—'
}
</script>

<template>
  <div class="max-w-5xl mx-auto">
    <div class="flex items-center justify-between mb-6">
      <h1 class="text-2xl font-display font-semibold" style="color: var(--color-text-primary);">龟龟档案</h1>
      <RouterLink to="/turtles/new" class="btn btn-primary">
        <Plus :size="16" /> 新增龟龟
      </RouterLink>
    </div>

    <div v-if="store.loading" class="text-sm" style="color: var(--color-text-muted);">加载中...</div>

    <div v-else-if="store.turtleList.length === 0" class="card p-12 text-center">
      <div class="text-5xl mb-4">🐢</div>
      <h3 class="text-lg font-display mb-2" style="color: var(--color-text-primary);">还没有龟龟</h3>
      <p class="text-sm mb-6" style="color: var(--color-text-muted);">添加第一只龟龟，开始记录养殖过程</p>
      <RouterLink to="/turtles/new" class="btn btn-primary">
        <Plus :size="16" /> 添加龟龟
      </RouterLink>
    </div>

    <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      <div
        v-for="turtle in store.turtleList"
        :key="turtle.id"
        class="card overflow-hidden animate-fade-in-up"
      >
        <!-- Photo area -->
        <div
          class="h-32 flex items-center justify-center relative"
          style="background: linear-gradient(135deg, rgba(74,124,89,0.15) 0%, rgba(127,176,105,0.1) 100%);"
        >
          <div class="text-6xl">🐢</div>
          <div class="absolute top-3 right-3 flex gap-1">
            <RouterLink
              :to="'/turtles/' + turtle.id + '/edit'"
              class="w-7 h-7 rounded-lg flex items-center justify-center"
              style="background: rgba(255,255,255,0.8);"
            >
              <Pencil :size="13" style="color: var(--color-text-secondary);" />
            </RouterLink>
            <button
              @click="showDelete = turtle.id; deleteName = ''"
              class="w-7 h-7 rounded-lg flex items-center justify-center"
              style="background: rgba(255,255,255,0.8);"
            >
              <Trash2 :size="13" style="color: var(--color-danger);" />
            </button>
          </div>
        </div>

        <!-- Info -->
        <div class="p-4">
          <RouterLink :to="'/turtles/' + turtle.id" style="text-decoration: none;">
            <h3 class="font-semibold text-base mb-1" style="color: var(--color-text-primary);">{{ turtle.name }}</h3>
          </RouterLink>
          <p class="text-xs mb-3" style="color: var(--color-text-muted);">
            {{ turtle.species || '未分类' }} · 入养 {{ formatDate(turtle.purchase_date) }}
          </p>
          <div class="flex gap-3 text-xs" style="color: var(--color-text-secondary);">
            <span>体重 <strong class="font-mono">{{ turtle.weight_latest || '—' }}g</strong></span>
            <span>背甲 <strong class="font-mono">{{ turtle.size_latest || '—' }}mm</strong></span>
          </div>
        </div>

        <!-- Delete confirm -->
        <div
          v-if="showDelete === turtle.id"
          class="p-4 border-t"
          style="background: rgba(184,92,74,0.05); border-color: var(--color-border);"
        >
          <p class="text-xs mb-2" style="color: var(--color-danger);">
            删除后无法恢复，请输入龟龟名字确认：
          </p>
          <input
            v-model="deleteName"
            :placeholder="turtle.name"
            class="input mb-2 text-sm"
            @keyup.enter="confirmDelete(turtle.id, turtle.name)"
          />
          <div class="flex gap-2">
            <button
              @click="confirmDelete(turtle.id, turtle.name)"
              :disabled="deleteName !== turtle.name"
              class="btn btn-danger text-xs flex-1"
              :style="{ opacity: deleteName !== turtle.name ? 0.5 : 1 }"
            >
              确认删除
            </button>
            <button @click="showDelete = null; deleteName = ''" class="btn btn-secondary text-xs">
              取消
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
