<script setup>
import panelWatermark from '@/assets/images/brand/jetsen-wordmark-white.png'
</script>

<template>
  <main class="not-found-page">
    <section class="not-found-panel" aria-labelledby="not-found-title">
      <img class="not-found-watermark" :src="panelWatermark" alt="" aria-hidden="true" />
      <p class="eyebrow">404 Not Found</p>
      <h1 id="not-found-title">找不到這個頁面</h1>
      <p>
        這個網址可能輸入錯誤、頁面已經移動，或目前沒有開放。你可以回到首頁重新瀏覽，
        也可以前往管理登入頁。
      </p>
      <div class="not-found-actions">
        <RouterLink class="primary-action" :to="{ name: 'home' }">回到首頁</RouterLink>
        <RouterLink class="secondary-action" :to="{ name: 'admin-login' }">管理登入</RouterLink>
      </div>
    </section>
  </main>
</template>

<style scoped>
.not-found-page {
  display: grid;
  height: 100vh;
  max-height: 100vh;
  place-items: center;
  overflow: hidden;
  padding: clamp(18px, 4vw, 56px);
  background:
    radial-gradient(circle at 70% 18%, rgba(255, 90, 18, 0.24), transparent 22rem),
    linear-gradient(90deg, rgba(6, 6, 6, 0.98), rgba(6, 6, 6, 0.88)),
    #050505;
}

.not-found-page::before {
  position: fixed;
  inset: 0;
  pointer-events: none;
  background:
    linear-gradient(115deg, transparent 0%, rgba(255, 255, 255, 0.045) 46%, transparent 63%),
    radial-gradient(ellipse at 50% 28%, transparent 0 42%, rgba(0, 0, 0, 0.48) 100%);
  content: '';
}

.not-found-panel {
  position: relative;
  z-index: 1;
  display: grid;
  width: min(100%, 760px);
  max-height: calc(100vh - clamp(36px, 8vw, 112px));
  gap: clamp(16px, 2.4vw, 22px);
  overflow: hidden;
  padding: clamp(26px, 4.6vw, 52px);
  border: 1px solid var(--color-line);
  border-radius: 8px;
  background:
    radial-gradient(ellipse at 48% 118%, rgba(255, 90, 18, 0.16), transparent 34rem),
    linear-gradient(90deg, rgba(4, 4, 4, 0.96), rgba(22, 8, 4, 0.94) 52%, rgba(5, 5, 5, 0.98)),
    #050505;
  box-shadow: 0 28px 80px rgba(0, 0, 0, 0.42);
}

.not-found-panel::after {
  position: absolute;
  inset: 0;
  z-index: 0;
  background: linear-gradient(90deg, rgba(5, 5, 5, 0.9), rgba(10, 5, 3, 0.72) 48%, rgba(5, 5, 5, 0.92));
  content: '';
  pointer-events: none;
}

.not-found-watermark {
  position: absolute;
  right: 0;
  bottom: 0;
  z-index: 1;
  width: min(68vw, 740px);
  opacity: 0.055;
  filter: grayscale(1) invert(1) brightness(0.86) contrast(0.82);
  pointer-events: none;
  transform: translate(16%, 40%);
  transform-origin: right bottom;
}

.eyebrow,
h1,
p:not(.eyebrow),
.not-found-actions {
  position: relative;
  z-index: 2;
}

.eyebrow {
  margin: 0;
  color: var(--color-accent);
  font-size: 1rem;
}

h1,
p {
  margin: 0;
}

h1 {
  max-width: 680px;
  color: #fff;
  font-size: clamp(2.43rem, 7.29vw, 5.67rem);
  font-weight: 950;
  line-height: 0.94;
}

p:not(.eyebrow) {
  max-width: 640px;
  color: #d8d8d2;
  font-size: clamp(1rem, 2vw, 1.18rem);
  line-height: 1.8;
}

.not-found-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  margin-top: 8px;
}

.primary-action,
.secondary-action {
  position: relative;
  display: inline-flex;
  min-height: 46px;
  align-items: center;
  justify-content: center;
  width: fit-content;
  padding: 12px 48px 12px 18px;
  border-radius: 999px;
  color: #fff;
  font-size: 0.9rem;
  font-weight: 950;
  text-decoration: none;
  transition:
    border-color 180ms ease,
    box-shadow 180ms ease,
    transform 180ms ease;
}

.primary-action {
  border: 1px solid rgba(255, 90, 18, 0.72);
  background: linear-gradient(180deg, #ff6a18, #f04a0a);
  box-shadow: 0 0 28px rgba(255, 90, 18, 0.22);
}

.secondary-action {
  border: 1px solid var(--color-line);
  background: rgba(255, 255, 255, 0.055);
}

.primary-action::after,
.secondary-action::after {
  position: absolute;
  right: 8px;
  display: grid;
  width: 28px;
  height: 28px;
  place-items: center;
  border-radius: 50%;
  color: #fff;
  background: rgba(0, 0, 0, 0.24);
  content: '>';
  font-size: 0.85rem;
}

.primary-action:hover,
.secondary-action:hover {
  border-color: rgba(255, 90, 18, 0.72);
  transform: translateY(-1px);
}

@media (max-width: 560px) {
  .not-found-panel {
    padding: 26px 22px;
  }

  .not-found-watermark {
    top: 50%;
    right: calc(5px - (clamp(324px, 86.4vw, 468px) / 2));
    bottom: auto;
    left: auto;
    width: clamp(324px, 86.4vw, 468px);
    max-width: none;
    opacity: 0.055;
    transform: translateY(-50%) rotate(90deg);
    transform-origin: center;
  }

  .not-found-actions {
    align-items: stretch;
    flex-direction: column;
  }

  .primary-action,
  .secondary-action {
    width: 100%;
  }
}
</style>
