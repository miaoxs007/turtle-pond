<script setup lang="ts">
import { onMounted, ref, computed } from 'vue'
import { useRoute, useRouter, RouterLink } from 'vue-router'
import { ArrowLeft, Pencil, Trash2, TrendingUp, HeartPulse } from 'lucide-vue-next'
import { useTurtleStore } from '@/stores/turtles'
import { useFeedingStore } from '@/stores/feeding'
import { useGrowthStore } from '@/stores/growth'
import { useHealthStore } from '@/stores/health'

const route = useRoute()
const router = useRouter()
const turtleStore = useTurtleStore()
const feedingStore = useFeedingStore()
const growthStore = useGrowthStore()
const healthStore = useHealthStore()

const loading = ref(true)
const showDelete = ref(false)
const deleteConfirm = ref('')

const turtle = computed(() =>
  turtleStore.turtleList.find(t => t.id === route.params.id)
)

const feedingLogs = computed(() =>
  feedingStore.logs.filter(l => (l as any).turtle === route.params.id).slice(0, 5)
)
const growthLogs = computed(() =>
  growthStore.records.filter(r => (r as any).turtle === route.params.id).slice(0, 5)
)
const healthLogs = computed(() =>
  healthStore.logs.filter(l => (l as any).turtle === route.params.id).slice(0, 5)
)

onMounted(async () => {
  await Promise.all([
    turtleStore.fetchTurtles(),
    feedingStore.fetchLogs(),
    growthStore.fetchRecords(),
    healthStore.fetchLogs(),
  ])
  loading.value = false
})

async function confirmDelete() {
  if (deleteConfirm.value === turtle.value?.name) {
    await turtleStore.deleteTurtle(route.params.id as string)
    router.push('/turtles')
  }
}

function formatDate(d: string) {
  return new Date(d).toLocaleDateString('zh-CN', { month: 'short', day: 'numeric', year: 'numeric' })
}
</script>

<template>
  <div class="max-w-3xl mx-auto">
    <!-- Header -->
    <div class="flex items-center gap-3 mb-6">
      <button @click="router.back()" class="btn btn-ghost p-2">
        <ArrowLeft :size="20" />
      </button>
      <div class="flex-1" />
      <RouterLink :to="'/turtles/' + route.params.id + '/edit'" class="btn btn-secondary">
        <Pencil :size="16" /> 编辑
      </RouterLink>
      <button @click="showDelete = true" class="btn btn-ghost text-xs" style="color: var(--color-danger);">
        <Trash2 :size="16" />
      </button>
    </div>

    <div v-if="loading" style="color: var(--color-text-muted);">加载中...</div>

    <div v-else-if="!turtle" style="color: var(--color-text-muted);">
      龟龟不存在或已被删除。
    </div>

    <div v-else>
      <!-- Profile card -->
      <div class="card overflow-hidden mb-6 animate-fade-in-up">
        <div
          class="h-32 flex items-center justify-center"
          style="background: linear-gradient(135deg, rgba(74,124,89,0.2) 0%, rgba(127,176,105,0.1) 100%);"
        >
          <div class="text-7xl">🐢</div>
        </div>
        <div class="p-6">
          <h1 class="text-2xl font-display font-semibold mb-1" style="color: var(--color-text-primary);">
            {{ turtle.name }}
          </h1>
          <p class="text-sm mb-4" style="color: var(--color-text-muted);">
            {{ turtle.species || '未分类' }} · 入养 {{ formatDate(turtle.purchase_date) }}
          </p>
          <div class="grid grid-cols-2 gap-4">
            <div class="p-3 rounded-xl" style="background: rgba(74,124,89,0.08);">
              <div class="text-xs mb-1" style="color: var(--color-text-muted);">最新体重</div>
              <div class="text-xl font-mono font-bold" style="color: var(--color-accent-green);">
                {{ turtle.weight_latest || '—' }}g
              </div>
            </div>
            <div class="p-3 rounded-xl" style="background: rgba(91,143,168,0.08);">
              <div class="text-xs mb-1" style="color: var(--color-text-muted);">背甲长度</div>
              <div class="text-xl font-mono font-bold" style="color: var(--color-accent-water);">
                {{ turtle.size_latest || '—' }}mm
              </div>
            </div>
          </div>
          <div v-if="turtle.notes" class="mt-4 text-sm" style="color: var(--color-text-secondary);">
            {{ turtle.notes }}
          </div>
        </div>
      </div>

      <!-- Quick links -->
      <div class="grid grid-cols-3 gap-3 mb-6">
        <RouterLink to="/feeding" class="btn btn-secondary justify-center text-sm">
          <UtensilsCrossed :size="14" /> 喂食
        </RouterLink>
        <RouterLink to="/growth" class="btn btn-secondary justify-center text-sm">
          <TrendingUp :size="14" /> 成长
        </RouterLink>
        <RouterLink to="/health" class="btn btn-secondary justify-center text-sm">
          <HeartPulse :size="14" /> 健康
        </RouterLink>
      </div>

      <!-- Recent feeding -->
      <div class="card mb-4 animate-fade-in-up stagger-1">
        <div class="flex items-center justify-between px-4 py-3 border-b" style="border-color: var(--color-border);">
          <h3 class="font-semibold text-sm" style="color: var(--color-text-primary);">🍽️ 最近喂食</h3>
          <RouterLink to="/feeding" class="text-xs" style="color: var(--color-accent-green);">查看全部</RouterLink>
        </div>
        <div v-if="feedingLogs.length === 0" class="p-4 text-sm text-center" style="color: var(--color-text-muted);">
          暂无记录
        </div>
        <div v-else>
          <div
            v-for="(log, i) in feedingLogs"
            :key="log.id"
            class="flex items-center justify-between px-4 py-2.5 text-sm"
            :style="{ borderBottom: i < feedingLogs.length - 1 ? '1px solid var(--color-border)' : 'none' }"
          >
            <span style="color: var(--color-text-secondary);">
              {{ log.food_type }} × {{ log.quantity }}{{ log.unit }}
            </span>
            <span style="color: var(--color-text-muted);">{{ formatDate(log.date) }}</span>
          </div>
        </div>
      </div>

      <!-- Recent growth -->
      <div class="card mb-4 animate-fade-in-up stagger-2">
        <div class="flex items-center justify-between px-4 py-3 border-b" style="border-color: var(--color-border);">
          <h3 class="font-semibold text-sm" style="color: var(--color-text-primary);">📈 最近成长</h3>
          <RouterLink to="/growth" class="text-xs" style="color: var(--color-accent-green);">查看全部</RouterLink>
        </div>
        <div v-if="growthLogs.length === 0" class="p-4 text-sm text-center" style="color: var(--color-text-muted);">
          暂无记录
        </div>
        <div v-else>
          <div
            v-for="(rec, i) in growthLogs"
            :key="rec.id"
            class="flex items-center justify-between px-4 py-2.5 text-sm"
            :style="{ borderBottom: i < growthLogs.length - 1 ? '1px solid var(--color-border)' : 'none' }"
          >
            <span style="color: var(--color-text-secondary);">
              {{ rec.weight }}g · {{ rec.carapace_length }}mm
            </span>
            <span style="color: var(--color-text-muted);">{{ formatDate(rec.date) }}</span>
          </div>
        </div>
      </div>

      <!-- Recent health -->
      <div class="card animate-fade-in-up stagger-3">
        <div class="flex items-center justify-between px-4 py-3 border-b" style="border-color: var(--color-border);">
          <h3 class="font-semibold text-sm" style="color: var(--color-text-primary);">🩺 最近健康</h3>
          <RouterLink to="/health" class="text-xs" style="color: var(--color-accent-green);">查看全部</RouterLink>
        </div>
        <div v-if="healthLogs.length === 0" class="p-4 text-sm text-center" style="color: var(--color-text-muted);">
          暂无记录
        </div>
        <div v-else>
          <div
            v-for="(log, i) in healthLogs"
            :key="log.id"
            class="flex items-center justify-between px-4 py-2.5 text-sm"
            :style="{ borderBottom: i < healthLogs.length - 1 ? '1px solid var(--color-border)' : 'none' }"
          >
            <div class="flex items-center gap-2">
              <span
                :class="['badge', log.status === '正常' ? 'badge-green' : 'badge-danger']"
              >{{ log.status }}</span>
            </div>
            <span style="color: var(--color-text-muted);">{{ formatDate(log.date) }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Delete confirm modal -->
    <div
      v-if="showDelete"
      class="fixed inset-0 z-50 flex items-center justify-center p-4"
      style="background: rgba(0,0,0,0.5);"
      @click.self="showDelete = false"
    >
      <div class="card p-6 w-full max-w-sm animate-scale-in">
        <h3 class="text-lg font-display font-semibold mb-2" style="color: var(--color-danger);">删除龟龟</h3>
        <p class="text-sm mb-4" style="color: var(--color-text-secondary);">
          删除 <strong>{{ turtle?.name }}</strong> 将同时删除所有相关记录，此操作不可撤销。
        </p>
        <p class="text-xs mb-3" style="color: var(--color-text-muted);">请输入龟龟名字确认：</p>
        <input
          v-model="deleteConfirm"
          class="input mb-4"
          :placeholder="turtle?.name"
        />
        <div class="flex gap-3">
          <button
            @click="confirmDelete"
            :disabled="deleteConfirm !== turtle?.name"
            class="btn btn-danger flex-1 justify-center"
            :style="{ opacity: deleteConfirm !== turtle?.name ? 0.5 : 1 }"
          >
            确认删除
          </button>
          <button @click="showDelete = false" class="btn btn-secondary">取消</button>
        </div>
      </div>
    </div>
  </div>
</template>
