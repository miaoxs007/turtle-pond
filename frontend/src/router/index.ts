import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      component: () => import('@/components/layout/AppLayout.vue'),
      children: [
        { path: '', redirect: '/dashboard' },
        { path: 'dashboard', name: 'dashboard', component: () => import('@/pages/DashboardPage.vue') },
        { path: 'turtles', name: 'turtles', component: () => import('@/pages/TurtlesPage.vue') },
        { path: 'turtles/new', name: 'turtle-new', component: () => import('@/pages/TurtleFormPage.vue') },
        { path: 'turtles/:id', name: 'turtle-detail', component: () => import('@/pages/TurtleDetailPage.vue') },
        { path: 'turtles/:id/edit', name: 'turtle-edit', component: () => import('@/pages/TurtleFormPage.vue') },
        { path: 'feeding', name: 'feeding', component: () => import('@/pages/FeedingPage.vue') },
        { path: 'water', name: 'water', component: () => import('@/pages/WaterPage.vue') },
        { path: 'growth', name: 'growth', component: () => import('@/pages/GrowthPage.vue') },
        { path: 'environment', name: 'environment', component: () => import('@/pages/EnvironmentPage.vue') },
        { path: 'health', name: 'health', component: () => import('@/pages/HealthPage.vue') },
        { path: 'settings', name: 'settings', component: () => import('@/pages/SettingsPage.vue') },
      ]
    }
  ]
})

export default router
