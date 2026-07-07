<script setup>
import { RouterLink } from 'vue-router'

const navItems = [
  { label: '首頁', to: '/' },
  { label: '工程作品', to: '/works' },
  { label: '品牌故事', to: '/story' },
  { label: '聯絡諮詢', to: '/contact' },
]
</script>

<template>
  <header class="site-header">
    <RouterLink class="brand" to="/" aria-label="杰森鐵作首頁">
      <span class="brand-mark">JETSEN</span>
      <span class="brand-name">杰森鐵作</span>
    </RouterLink>

    <nav aria-label="主要導覽">
      <RouterLink v-for="item in navItems" :key="item.to" :to="item.to">
        {{ item.label }}
      </RouterLink>
    </nav>
  </header>
</template>
