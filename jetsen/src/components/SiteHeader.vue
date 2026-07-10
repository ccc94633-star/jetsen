<script setup>
import { RouterLink } from 'vue-router'
import founderLogo from '@/assets/images/brand/jetsen-wordmark-orange-transparent-with-cn.png'

const navItems = [
  { label: '首頁', to: '/' },
  { label: '杰森作品', to: '/works' },
  { label: '品牌故事', to: '/story' },
  { label: '聯絡諮詢', to: '/contact' },
]
</script>

<template>
  <header class="site-header">
    <RouterLink class="brand" to="/" aria-label="杰森鐵作首頁">
      <img class="brand-logo" :src="founderLogo" alt="JETSEN" />
    </RouterLink>

    <nav aria-label="主要導覽">
      <RouterLink v-for="item in navItems" :key="item.to" :to="item.to">
        {{ item.label }}
      </RouterLink>
    </nav>
  </header>
</template>

<style scoped>
.brand-logo {
  transform: translateX(-8px);
}
</style>
