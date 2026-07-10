<script setup>
import { computed } from 'vue'
import { RouterView } from 'vue-router'
import { useRoute } from 'vue-router'
import GoTopButton from './components/GoTopButton.vue'
import SiteFooter from './components/SiteFooter.vue'
import SiteHeader from './components/SiteHeader.vue'

const route = useRoute()
const isAdminLayout = computed(() => route.meta.layout === 'admin')
const hidesSiteChrome = computed(() => ['admin', 'blank'].includes(route.meta.layout))
</script>

<template>
  <SiteHeader v-if="!hidesSiteChrome" />
  <main>
    <RouterView />
  </main>
  <SiteFooter v-if="!hidesSiteChrome" />
  <GoTopButton :show-on-desktop="isAdminLayout" />
</template>

<style>
:root {
  color: #f5f5f0;
  background: #090909;
  font-family:
    Inter, 'Noto Sans TC', system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  font-synthesis: none;
  text-rendering: optimizeLegibility;
  --color-bg: #090909;
  --color-panel: #121212;
  --color-panel-soft: #181818;
  --color-line: rgba(255, 255, 255, 0.11);
  --color-line-soft: rgba(255, 255, 255, 0.07);
  --color-text: #f7f7f2;
  --color-muted: #b7b7ad;
  --color-accent: #ff5a12;
  --color-accent-2: #ef493d;
}

* {
  box-sizing: border-box;
}

body {
  position: relative;
  margin: 0;
  min-width: 320px;
  background:
    radial-gradient(ellipse at 80% -8%, rgba(255, 90, 18, 0.2), transparent 34rem),
    radial-gradient(ellipse at 6% 42%, rgba(168, 49, 19, 0.18), transparent 36rem),
    radial-gradient(ellipse at 56% 108%, rgba(255, 90, 18, 0.16), transparent 42rem),
    linear-gradient(150deg, #150b08 0%, #090807 34%, #050505 68%, #120806 100%);
  background-attachment: fixed;
}

body::before,
body::after {
  position: fixed;
  inset: 0;
  z-index: 0;
  pointer-events: none;
  content: '';
}

body::before {
  background:
    linear-gradient(115deg, transparent 0%, rgba(255, 255, 255, 0.035) 46%, transparent 63%),
    radial-gradient(ellipse at 50% 28%, transparent 0 42%, rgba(0, 0, 0, 0.42) 100%);
  mix-blend-mode: screen;
  opacity: 0.5;
}

body::after {
  background:
    repeating-radial-gradient(circle at 20% 30%, rgba(255, 255, 255, 0.035) 0 1px, transparent 1px 5px),
    linear-gradient(180deg, rgba(255, 255, 255, 0.025), rgba(0, 0, 0, 0.18));
  opacity: 0.22;
}

#app {
  position: relative;
  z-index: 1;
  min-height: 100vh;
}

a {
  color: inherit;
}

.eyebrow {
  display: block;
  margin: 0 0 14px;
  color: #ff5a12;
  font-size: 0.78rem;
  font-weight: 950;
  letter-spacing: 0;
  line-height: 1.2;
  text-align: left;
  text-transform: uppercase;
}
</style>

<style scoped>
.site-header {
  position: sticky;
  top: 0;
  z-index: 10;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 24px;
  padding: 18px clamp(20px, 5vw, 72px);
  border-bottom: 1px solid var(--color-line);
  background: rgba(8, 8, 8, 0.86);
  backdrop-filter: blur(16px);
}

:deep(.brand) {
  display: inline-flex;
  align-items: center;
  flex: 0 0 auto;
  text-decoration: none;
}

:deep(.brand-logo) {
  display: block;
  width: clamp(150px, 18vw, 214px);
  height: auto;
}

:deep(nav) {
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-end;
  gap: 8px;
}

:deep(nav a) {
  padding: 8px 10px;
  border: 1px solid transparent;
  color: #c9c9c2;
  font-size: 0.9rem;
  font-weight: 800;
  text-decoration: none;
}

:deep(nav a.router-link-active),
:deep(nav a:hover) {
  border-color: rgba(255, 90, 18, 0.42);
  color: #fff;
  background: rgba(255, 90, 18, 0.08);
}

main {
  min-height: 70vh;
}

:deep(.hero-section),
:deep(.page-hero),
:deep(.section) {
  padding-inline: clamp(20px, 5vw, 72px);
}

:deep(.page-hero) {
  max-width: 900px;
  padding-block: 84px 48px;
}

:deep(.page-hero h1) {
  max-width: 840px;
  margin: 0;
  color: #fff;
  font-size: clamp(2.5rem, 7vw, 5.75rem);
  line-height: 1.02;
}

:deep(.page-hero p),
:deep(.section p) {
  max-width: 720px;
  color: var(--color-muted);
  font-size: 1.3rem;
  line-height: 2; 
}

:deep(.eyebrow),
:deep(.page-hero .eyebrow),
:deep(.section .eyebrow) {
  display: block;
  margin: 0 0 14px;
  color: #ff5a12;
  font-size: 1.3rem;
  font-weight: 950;
  letter-spacing: 0;
  line-height: 1.2;
  text-align: left;
  text-transform: uppercase;
}

:deep(.section) {
  padding-block: 76px;
}

:deep(.section-heading) {
  margin-bottom: 30px;
}

:deep(.section h2) {
  margin: 0;
  color: #fff;
  font-size: clamp(1.8rem, 3vw, 2.65rem);
  line-height: 1.05;
}

:deep(.card-grid) {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 0;
  border-top: 1px solid var(--color-line);
  border-left: 1px solid var(--color-line);
}

:deep(.service-card),
:deep(.faq-item),
:deep(.placeholder-panel) {
  border-right: 1px solid var(--color-line);
  border-bottom: 1px solid var(--color-line);
  padding: 24px;
  color: #f8f8f4;
  background:
    linear-gradient(135deg, rgba(255, 90, 18, 0.08), transparent 42%),
    var(--color-panel);
}

:deep(.service-card h3),
:deep(.faq-item h2),
:deep(.placeholder-panel h2) {
  margin-top: 0;
}

:deep(.muted-section) {
  border-block: 1px solid var(--color-line);
  background: rgba(255, 255, 255, 0.025);
}

:deep(.primary-link),
:deep(.text-link),
:deep(.secondary-link) {
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: 44px;
  width: fit-content;
  margin-top: 20px;
  padding: 12px 48px 12px 18px;
  border-radius: 999px;
  font-size: 0.82rem;
  font-weight: 950;
  text-decoration: none;
  text-transform: uppercase;
}

:deep(.primary-link),
:deep(.text-link) {
  border: 1px solid rgba(255, 90, 18, 0.72);
  color: #fff;
  background: linear-gradient(180deg, #ff6a18, #f04a0a);
  box-shadow: 0 0 28px rgba(255, 90, 18, 0.22);
}

:deep(.secondary-link) {
  border: 1px solid var(--color-line);
  color: #fff;
  background: rgba(255, 255, 255, 0.055);
}

:deep(.primary-link::after),
:deep(.text-link::after),
:deep(.secondary-link::after) {
  position: absolute;
  right: 8px;
  display: grid;
  width: 28px;
  height: 28px;
  place-items: center;
  border-radius: 50%;
  color: #fff;
  background: rgba(0, 0, 0, 0.24);
  content: '↗';
  font-size: 0.85rem;
}

:deep(.primary-link:hover),
:deep(.text-link:hover),
:deep(.secondary-link:hover) {
  transform: translateY(-1px);
}

:deep(.category-list) {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-bottom: 24px;
}

:deep(.category-list span) {
  padding: 8px 12px;
  border: 1px solid var(--color-line);
  border-radius: 999px;
  color: #f8f8f4;
  background: var(--color-panel);
  font-weight: 800;
}

:deep(.story-layout),
:deep(.contact-layout) {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: 28px;
}

:deep(.faq-list) {
  display: grid;
  gap: 16px;
}

@media (max-width: 720px) {
  .site-header {
    align-items: flex-start;
    grid-template-columns: 1fr;
  }

  .site-header {
    flex-direction: column;
  }

  :deep(nav) {
    justify-content: flex-start;
  }

  :deep(.brand-logo) {
    width: clamp(132px, 46vw, 176px);
  }

  :deep(.page-hero h1) {
    font-size: clamp(2.25rem, 6.3vw, 5.18rem);
    line-height: 1.14;
  }
}
</style>
