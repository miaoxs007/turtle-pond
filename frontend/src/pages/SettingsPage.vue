<script setup lang="ts">
import { ref } from 'vue'
import supabase from '@/lib/supabase'

const exporting = ref(false)
const exportMsg = ref('')

async function exportData() {
  exporting.value = true
  exportMsg.value = ''
  try {
    const fetchAll = async (table: string) => {
      const { data, error } = await supabase.from(table).select('*')
      if (error) throw error
      return data
    }
    const turtles = await fetchAll('turtles')
    const feeding = await fetchAll('feeding_logs')
    const water = await fetchAll('water_changes')
    const growth = await fetchAll('growth_records')
    const env = await fetchAll('environment_logs')
    const health = await fetchAll('health_logs')

    const data = {
      exported_at: new Date().toISOString(),
      turtles,
      feeding_logs: feeding,
      water_changes: water,
      growth_records: growth,
      environment_logs: env,
      health_logs: health,
    }

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `龟塘数据_${new Date().toISOString().split('T')[0]}.json`
    a.click()
    URL.revokeObjectURL(url)
    exportMsg.value = '导出成功！'
  } catch (e) {
    exportMsg.value = '导出失败，请检查 Supabase 连接'
  } finally {
    exporting.value = false
  }
}
</script>

<template>
  <div class="max-w-lg mx-auto">
    <h1 class="text-2xl font-display font-semibold mb-6" style="color: var(--color-text-primary);">
      ⚙️ 设置
    </h1>

    <div class="space-y-4">
      <!-- Export -->
      <div class="card p-5">
        <h3 class="font-semibold text-sm mb-2" style="color: var(--color-text-primary);">数据导出</h3>
        <p class="text-xs mb-4" style="color: var(--color-text-muted);">
          将所有记录导出为 JSON 文件，可在其他地方导入。
        </p>
        <button @click="exportData" class="btn btn-secondary" :disabled="exporting">
          {{ exporting ? '导出中...' : '导出所有数据' }}
        </button>
        <p v-if="exportMsg" class="text-xs mt-2" :style="{ color: exportMsg.includes('成功') ? 'var(--color-accent-green)' : 'var(--color-danger)' }">
          {{ exportMsg }}
        </p>
      </div>

      <!-- About -->
      <div class="card p-5">
        <h3 class="font-semibold text-sm mb-2" style="color: var(--color-text-primary);">关于龟塘</h3>
        <div class="text-xs space-y-1" style="color: var(--color-text-secondary);">
          <p>版本 1.0.0</p>
          <p>专为养龟爱好者设计的记录平台</p>
          <p class="mt-2">🐢 愿每一只龟龟都健康成长</p>
        </div>
      </div>
    </div>
  </div>
</template>
