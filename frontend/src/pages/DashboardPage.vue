<script setup lang="ts">
import { onMounted, ref, computed } from 'vue'
import { RouterLink } from 'vue-router'
import { Turtle, UtensilsCrossed, Droplets, TrendingUp, ChevronRight } from 'lucide-vue-next'
import { useTurtleStore } from '@/stores/turtles'
import { useFeedingStore } from '@/stores/feeding'
import { useWaterStore } from '@/stores/water'
import { useGrowthStore } from '@/stores/growth'
import { useHealthStore } from '@/stores/health'

const turtleStore = useTurtleStore()
const feedingStore = useFeedingStore()
const waterStore = useWaterStore()
const growthStore = useGrowthStore()
const healthStore = useHealthStore()

const loading = ref(true)

const stats = computed(() => [
  {
    label: '龟龟总数',
    value: turtleStore.turtleList.length,
    icon: Turtle,
    color: 'var(--color-accent-green)',
    bg: 'rgba(74,124,89,0.1)',
    to: '/turtles'
  },
  {
    label: '喂食记录',
    value: feedingStore.logs.length,
    icon: UtensilsCrossed,
    color: 'var(--color-accent-warm)',
    bg: 'rgba(193,122,74,0.1)',
    to: '/feeding'
  },
  {
    label: '换水记录',
    value: waterStore.logs.length,
    icon: Droplets,
    color: 'var(--color-accent-water)',
    bg: 'rgba(91,143,168,0.1)',
    to: '/water'
  },
  {
    label: '成长记录',
    value: growthStore.records.length,
    icon: TrendingUp,
    color: 'var(--color-accent-green)',
    bg: 'rgba(74,124,89,0.1)',
    to: '/growth'
  },
])

// Recent activity combined
const recentActivity = computed(() => {
  type RawActivity = { id: string; date: string; type: string; title: string; subtitle: string; turtleName?: string }
  const items: RawActivity[] = [
    ...feedingStore.logs.slice(0, 5).map(l => ({
      id: l.id,
      date: l.date,
      type: 'feeding',
      title: `🍽️ 喂食`,
      subtitle: `${l.food_type} × ${l.quantity}${l.unit}`,
      turtleName: l.turtleName || ''
    })),
    ...waterStore.logs.slice(0, 5).map(l => ({
      id: l.id,
      date: l.date,
      type: 'water',
      title: `💧 换水`,
      subtitle: `${l.ratio}%换水${l.water_temp ? ` · ${l.water_temp}°C` : ''}`,
      turtleName: ''
    })),
    ...growthStore.records.slice(0, 5).map(l => ({
      id: l.id,
      date: l.date,
      type: 'growth',
      title: `📈 成长`,
      subtitle: `${l.weight}g · ${l.carapace_length}mm`,
      turtleName: l.turtleName || ''
    })),
    ...healthStore.logs.slice(0, 5).map(l => ({
      id: l.id,
      date: l.date,
      type: 'health',
      title: `🩺 健康`,
      subtitle: l.status,
      turtleName: l.turtleName || ''
    })),
  ]
  return items
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 8)
})

const typeColors: Record<string, string> = {
  feeding: 'var(--color-accent-warm)',
  water: 'var(--color-accent-water)',
  growth: 'var(--color-accent-green)',
  health: 'var(--color-danger)',
}

onMounted(async () => {
  await Promise.all([
    turtleStore.fetchTurtles(),
    feedingStore.fetchLogs(),
    waterStore.fetchLogs(),
    growthStore.fetchRecords(),
    healthStore.fetchLogs(),
  ])
  loading.value = false
})

function formatDate(d: string) {
  return new Date(d).toLocaleDateString('zh-CN', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })
}
</script>

<template>
  <div class="max-w-5xl mx-auto">
    <!-- Header -->
    <div class="flex items-center justify-between mb-8">
      <div>
        <h1 class="text-2xl font-display font-semibold" style="color: var(--color-text-primary);">仪表盘</h1>
        <p class="text-sm mt-1" style="color: var(--color-text-muted);">欢迎回到龟塘，今天也要好好照顾龟龟哦 🐢</p>
      </div>
      <RouterLink to="/turtles/new" class="btn btn-primary">
        <Plus :size="16" />
        新增龟龟
      </RouterLink>
    </div>

    <!-- Stats -->
    <div class="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      <RouterLink
        v-for="(stat, i) in stats"
        :key="stat.label"
        :to="stat.to"
        :class="['card p-4 flex items-center gap-4 animate-fade-in-up stagger-' + i]"
        style="text-decoration: none;"
      >
        <div
          class="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
          :style="{ background: stat.bg }"
        >
          <component :is="stat.icon" :size="20" :style="{ color: stat.color }" />
        </div>
        <div>
          <div class="text-2xl font-mono font-bold" :style="{ color: stat.color }">{{ stat.value }}</div>
          <div class="text-xs" style="color: var(--color-text-muted);">{{ stat.label }}</div>
        </div>
      </RouterLink>
    </div>

    <!-- Turtles overview -->
    <div class="mb-8">
      <div class="flex items-center justify-between mb-4">
        <h2 class="text-lg font-display font-semibold" style="color: var(--color-text-primary);">龟龟档案</h2>
        <RouterLink to="/turtles" class="text-sm flex items-center gap-1" style="color: var(--color-accent-green);">
          查看全部 <ChevronRight :size="14" />
        </RouterLink>
      </div>
      <div v-if="loading" class="text-sm" style="color: var(--color-text-muted);">加载中...</div>
      <div v-else-if="turtleStore.turtleList.length === 0" class="card p-8 text-center">
        <div class="text-4xl mb-3">🐢</div>
        <p style="color: var(--color-text-muted);">还没有龟龟，快来添加第一只吧！</p>
        <RouterLink to="/turtles/new" class="btn btn-primary mt-4">
          <Plus :size="16" /> 添加龟龟
        </RouterLink>
      </div>
      <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <RouterLink
          v-for="turtle in turtleStore.turtleList.slice(0, 3)"
          :key="turtle.id"
          :to="'/turtles/' + turtle.id"
          class="card p-4 animate-fade-in-up"
          style="text-decoration: none;"
        >
          <div class="flex items-center gap-3 mb-3">
            <div
              class="w-12 h-12 rounded-xl flex items-center justify-center text-2xl"
              style="background: rgba(74,124,89,0.1);"
            >
              🐢
            </div>
            <div>
              <div class="font-semibold" style="color: var(--color-text-primary);">{{ turtle.name }}</div>
              <div class="text-xs" style="color: var(--color-text-muted);">{{ turtle.species || '未分类' }}</div>
            </div>
          </div>
          <div class="flex gap-4 text-xs" style="color: var(--color-text-secondary);">
            <span>体重 <strong class="font-mono">{{ turtle.weight_latest || '—' }}g</strong></span>
            <span>背甲 <strong class="font-mono">{{ turtle.size_latest || '—' }}mm</strong></span>
          </div>
        </RouterLink>
      </div>
    </div>

    <!-- Recent activity -->
    <div>
      <h2 class="text-lg font-display font-semibold mb-4" style="color: var(--color-text-primary);">近期活动</h2>
      <div v-if="loading" class="text-sm" style="color: var(--color-text-muted);">加载中...</div>
      <div v-else-if="recentActivity.length === 0" class="card p-8 text-center">
        <div class="text-4xl mb-3">📝</div>
        <p style="color: var(--color-text-muted);">还没有任何记录，开始记录吧！</p>
      </div>
      <div v-else class="card overflow-hidden">
        <div
          v-for="(item, i) in recentActivity"
          :key="item.id"
          class="flex items-center gap-4 px-4 py-3"
          :style="{
            borderBottom: i < recentActivity.length - 1 ? '1px solid var(--color-border)' : 'none'
          }"
        >
          <div
            class="w-2 h-2 rounded-full flex-shrink-0"
            :style="{ background: typeColors[item.type] }"
          />
          <div class="flex-1 min-w-0">
            <div class="text-sm font-medium" style="color: var(--color-text-primary);">
              {{ item.title }}
              <span v-if="item.turtleName" class="ml-1 text-xs" style="color: var(--color-text-muted);">
                · {{ item.turtleName }}
              </span>
            </div>
            <div class="text-xs" style="color: var(--color-text-muted);">{{ item.subtitle }}</div>
          </div>
          <div class="text-xs flex-shrink-0" style="color: var(--color-text-muted);">
            {{ formatDate(item.date) }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
