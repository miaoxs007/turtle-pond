<script setup lang="ts">
import { ref } from 'vue'
import { RouterLink, RouterView, useRoute } from 'vue-router'
import {
  LayoutDashboard, Turtle, UtensilsCrossed, Droplets,
  TrendingUp, Thermometer, HeartPulse, Settings,
  Menu, X
} from 'lucide-vue-next'

const route = useRoute()
const sidebarOpen = ref(true)
const mobileOpen = ref(false)

const navItems = [
  { to: '/dashboard', label: '仪表盘', icon: LayoutDashboard },
  { to: '/turtles', label: '龟龟档案', icon: Turtle },
  { to: '/feeding', label: '喂食记录', icon: UtensilsCrossed },
  { to: '/water', label: '换水记录', icon: Droplets },
  { to: '/growth', label: '成长记录', icon: TrendingUp },
  { to: '/environment', label: '环境监测', icon: Thermometer },
  { to: '/health', label: '健康日志', icon: HeartPulse },
]

function toggleSidebar() {
  sidebarOpen.value = !sidebarOpen.value
}
</script>

<template>
  <div class="flex h-screen overflow-hidden" style="background: var(--color-bg-primary);">
    <!-- Sidebar (desktop) -->
    <aside
      :class="[
        'flex flex-col border-r transition-all duration-300 hidden lg:flex',
        sidebarOpen ? 'w-60' : 'w-16'
      ]"
      style="background: var(--color-bg-card); border-color: var(--color-border);"
    >
      <!-- Logo -->
      <div class="flex items-center gap-3 px-4 h-16 border-b" style="border-color: var(--color-border);">
        <div class="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style="background: var(--color-accent-green);">
          <span class="text-white text-lg">🐢</span>
        </div>
        <span v-if="sidebarOpen" class="font-display text-lg font-semibold" style="color: var(--color-text-primary);">
          龟塘
        </span>
      </div>

      <!-- Toggle -->
      <button
        @click="toggleSidebar"
        class="absolute top-4 -right-3 w-6 h-6 rounded-full flex items-center justify-center text-xs z-10"
        style="background: var(--color-bg-card); border: 1px solid var(--color-border); color: var(--color-text-muted);"
      >
        <Menu v-if="!sidebarOpen" :size="12" />
        <X v-else :size="12" />
      </button>

      <!-- Nav -->
      <nav class="flex-1 py-4 overflow-y-auto">
        <RouterLink
          v-for="item in navItems"
          :key="item.to"
          :to="item.to"
          :class="[
            'flex items-center gap-3 px-4 py-2.5 mx-2 rounded-lg text-sm font-medium transition-colors',
            route.path === item.to || route.path.startsWith(item.to + '/')
              ? 'text-white'
              : ''
          ]"
          :style="{
            background: route.path === item.to || route.path.startsWith(item.to + '/')
              ? 'var(--color-accent-green)' : 'transparent',
            color: route.path === item.to || route.path.startsWith(item.to + '/')
              ? 'white' : 'var(--color-text-secondary)'
          }"
        >
          <component :is="item.icon" :size="18" class="flex-shrink-0" />
          <span v-if="sidebarOpen">{{ item.label }}</span>
        </RouterLink>
      </nav>

      <!-- Settings -->
      <div class="border-t py-4" style="border-color: var(--color-border);">
        <RouterLink
          to="/settings"
          :class="[
            'flex items-center gap-3 px-4 py-2.5 mx-2 rounded-lg text-sm font-medium',
            route.path === '/settings' ? 'text-white' : ''
          ]"
          :style="{
            background: route.path === '/settings' ? 'var(--color-accent-green)' : 'transparent',
            color: route.path === '/settings' ? 'white' : 'var(--color-text-secondary)'
          }"
        >
          <Settings :size="18" class="flex-shrink-0" />
          <span v-if="sidebarOpen">设置</span>
        </RouterLink>
      </div>
    </aside>

    <!-- Mobile overlay -->
    <div
      v-if="mobileOpen"
      class="fixed inset-0 z-30 lg:hidden"
      style="background: rgba(0,0,0,0.4);"
      @click="mobileOpen = false"
    />

    <!-- Mobile sidebar -->
    <aside
      :class="[
        'fixed inset-y-0 left-0 z-40 w-64 flex flex-col transition-transform duration-300 lg:hidden',
        mobileOpen ? 'translate-x-0' : '-translate-x-full'
      ]"
      style="background: var(--color-bg-card);"
    >
      <div class="flex items-center gap-3 px-4 h-16 border-b" style="border-color: var(--color-border);">
        <div class="w-8 h-8 rounded-lg flex items-center justify-center" style="background: var(--color-accent-green);">
          <span class="text-white text-lg">🐢</span>
        </div>
        <span class="font-display text-lg font-semibold" style="color: var(--color-text-primary);">龟塘</span>
      </div>
      <nav class="flex-1 py-4">
        <RouterLink
          v-for="item in navItems"
          :key="item.to"
          :to="item.to"
          @click="mobileOpen = false"
          :class="['flex items-center gap-3 px-4 py-2.5 text-sm font-medium rounded-lg mx-2']"
          :style="{
            background: route.path === item.to || route.path.startsWith(item.to + '/')
              ? 'var(--color-accent-green)' : 'transparent',
            color: route.path === item.to || route.path.startsWith(item.to + '/')
              ? 'white' : 'var(--color-text-secondary)'
          }"
        >
          <component :is="item.icon" :size="18" />
          {{ item.label }}
        </RouterLink>
        <RouterLink
          to="/settings"
          @click="mobileOpen = false"
          class="flex items-center gap-3 px-4 py-2.5 text-sm font-medium rounded-lg mx-2 mt-4"
          style="color: var(--color-text-secondary);"
        >
          <Settings :size="18" />
          设置
        </RouterLink>
      </nav>
    </aside>

    <!-- Main content -->
    <div class="flex-1 flex flex-col min-w-0">
      <!-- Mobile header -->
      <header
        class="flex items-center justify-between h-14 px-4 border-b lg:hidden"
        style="background: var(--color-bg-card); border-color: var(--color-border);"
      >
        <div class="flex items-center gap-3">
          <div class="w-8 h-8 rounded-lg flex items-center justify-center" style="background: var(--color-accent-green);">
            <span class="text-white">🐢</span>
          </div>
          <span class="font-display font-semibold" style="color: var(--color-text-primary);">龟塘</span>
        </div>
        <button @click="mobileOpen = !mobileOpen" class="btn btn-ghost p-2">
          <Menu v-if="!mobileOpen" :size="20" />
          <X v-else :size="20" />
        </button>
      </header>

      <!-- Page -->
      <main class="flex-1 overflow-y-auto p-6">
        <RouterView v-slot="{ Component }">
          <Transition name="page" mode="out-in">
            <component :is="Component" />
          </Transition>
        </RouterView>
      </main>
    </div>
  </div>
</template>
