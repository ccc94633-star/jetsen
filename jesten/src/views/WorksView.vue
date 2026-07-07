<script setup>
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import { RouterLink } from 'vue-router'
import { works } from '@/data/works'

const heroImages = works.map((work) => work.coverImage)
const activeHeroImageIndex = ref(0)
const activeHeroImage = computed(() => heroImages[activeHeroImageIndex.value])
let heroInterval

onMounted(() => {
  heroInterval = window.setInterval(() => {
    activeHeroImageIndex.value = (activeHeroImageIndex.value + 1) % heroImages.length
  }, 3600)
})

onBeforeUnmount(() => {
  window.clearInterval(heroInterval)
})

const categories = works

const scrollToCategory = (slug) => {
  document.getElementById(`work-${slug}`)?.scrollIntoView({
    behavior: 'smooth',
    block: 'start',
  })
}

const highlights = [
  '提供現場照片與尺寸，可以更快判斷施工方式。',
  '依照使用情境規劃材料、結構與表面處理。',
  '報價前會先確認地點、施工條件與客製需求。',
]
</script>

<template>
  <section class="works-hero">
    <div class="hero-image" aria-hidden="true">
      <img
        v-for="(image, index) in heroImages"
        :key="image"
        :src="image"
        :class="{ 'is-active': image === activeHeroImage && index === activeHeroImageIndex }"
        alt=""
      />
    </div>
    <div class="hero-copy">
    <p class="eyebrow">Works</p>
    <h1>工程作品</h1>
    <p>
      收錄杰森鐵作常見施工類型，從遮雨棚、欄杆扶手到造型鐵件與隱形鐵窗，依照現場條件客製規劃。
    </p>
    </div>
  </section>

  <section class="section works-board">
    <div class="works-toolbar">
      <div>
        <p class="eyebrow">Project Categories</p>
        <h2>選擇你想看的鐵件類型</h2>
      </div>
      <div class="category-pills" aria-label="作品分類">
        <button
          v-for="category in categories"
          :key="category.tag"
          type="button"
          @click="scrollToCategory(category.slug)"
        >
          {{ category.title }}
        </button>
      </div>
    </div>

    <div class="project-list">
      <RouterLink
        v-for="category in categories"
        :key="category.slug"
        :id="`work-${category.slug}`"
        class="project-card"
        :to="{ name: 'works-detail', params: { slug: category.slug } }"
        :aria-label="`查看${category.title}作品`"
      >
        <div class="project-image">
          <img :src="category.coverImage" :alt="`${category.title}作品照片`" loading="lazy" />
        </div>
        <div class="project-card-body">
          <span class="project-tag">{{ category.tag }}</span>
          <h3>{{ category.title }}</h3>
          <p>{{ category.description }}</p>
          <div class="project-meta">
            <span>{{ category.count }} photos</span>
            <span>查看作品</span>
          </div>
        </div>
      </RouterLink>
    </div>
  </section>

  <section class="section works-note">
    <div>
      <p class="eyebrow">Before Building</p>
      <h2>估價前先整理幾個重點</h2>
    </div>
    <ul>
      <li v-for="highlight in highlights" :key="highlight">{{ highlight }}</li>
    </ul>
  </section>
</template>

<style scoped>
.works-hero {
  position: relative;
  display: grid;
  overflow: hidden;
  place-items: center start;
  min-height: calc(100vh - 76px);
  min-height: calc(100svh - 76px);
  padding: clamp(96px, 14vw, 160px) clamp(20px, 5vw, 72px) clamp(96px, 12vw, 140px);
  border-bottom: 1px solid var(--color-line);
  background: #000;
}

.works-hero::after {
  position: absolute;
  inset: 0;
  background:
    radial-gradient(circle at 70% 18%, rgba(255, 90, 18, 0.32), transparent 22rem),
    linear-gradient(90deg, rgba(6, 6, 6, 0.94), rgba(6, 6, 6, 0.64) 52%, rgba(6, 6, 6, 0.42)),
    linear-gradient(0deg, rgba(6, 6, 6, 0.96), transparent 42%);
  content: '';
}

.hero-image {
  position: absolute;
  inset: 0 auto 0 0;
  width: 100%;
  opacity: 0.84;
}

.hero-image img {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  opacity: 0;
  filter: saturate(1.1) contrast(1.08) brightness(0.72);
  transition:
    opacity 900ms ease,
    transform 4200ms ease;
  transform: scale(1.02);
}

.hero-image img.is-active {
  opacity: 1;
  transform: scale(1.08);
}

.hero-copy {
  position: relative;
  z-index: 1;
  display: grid;
  justify-items: start;
  width: min(100%, 920px);
  text-align: left;
}

.works-hero h1 {
  margin: 0;
  color: #fff;
  font-size: clamp(3rem, 7.7vw, 7.2rem);
  font-weight: 950;
  line-height: 0.94;
  letter-spacing: 0;
}

.works-hero p:not(.eyebrow) {
  max-width: 720px;
  margin: 24px 0 0;
  color: var(--color-muted);
  font-size: 1.05rem;
  line-height: 1.85;
}

.works-board {
  padding-top: 24px;
  background: #000;
}

.works-toolbar {
  display: grid;
  width: 100%;
  justify-items: center;
  gap: 22px;
  margin-bottom: clamp(34px, 5vw, 58px);
  text-align: center;
}

.works-toolbar > div:not(.category-pills) {
  display: grid;
  justify-items: center;
}

.works-toolbar h2 {
  max-width: 620px;
  color: #fff;
}

.category-pills {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 12px;
}

.category-pills button {
  display: inline-flex;
  min-height: 46px;
  align-items: center;
  justify-content: center;
  padding: 12px 20px;
  border: 0;
  border-radius: 999px;
  color: #fff;
  background: linear-gradient(180deg, #ff7a22 0%, #f0440a 100%);
  box-shadow:
    0 0 28px rgba(255, 90, 18, 0.22),
    inset 0 1px 0 rgba(255, 255, 255, 0.18);
  cursor: pointer;
  font: inherit;
  font-size: 0.9rem;
  font-weight: 900;
  transition:
    box-shadow 180ms ease,
    transform 180ms ease;
}

.category-pills button:hover,
.category-pills button:focus-visible {
  box-shadow:
    0 0 34px rgba(255, 90, 18, 0.34),
    inset 0 1px 0 rgba(255, 255, 255, 0.22);
  outline: none;
  transform: translateY(-2px);
}

.project-list {
  display: grid;
  gap: clamp(16px, 2vw, 22px);
  max-width: 1180px;
  margin-inline: auto;
}

.project-card {
  display: grid;
  grid-template-columns: minmax(260px, 0.9fr) minmax(320px, 1.1fr);
  height: 280px;
  scroll-margin-top: 32px;
  overflow: hidden;
  border: 1px solid rgba(255, 255, 255, 0.045);
  border-radius: 8px;
  background: #111;
  box-shadow: 0 18px 44px rgba(0, 0, 0, 0.36);
  color: inherit;
  text-decoration: none;
  transition:
    transform 180ms ease,
    border-color 180ms ease,
    box-shadow 180ms ease;
}

.project-card:hover {
  border-color: rgba(255, 90, 18, 0.36);
  box-shadow:
    0 26px 64px rgba(0, 0, 0, 0.42),
    0 0 32px rgba(255, 90, 18, 0.1);
  transform: translateY(-4px);
}

.project-image {
  height: 100%;
  overflow: hidden;
  background: #171717;
}

.project-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  filter: saturate(1.2) contrast(1.05) sepia(0.08);
  transition: transform 260ms ease;
}

.project-card:hover img {
  transform: scale(1.04);
}

.project-card-body {
  display: grid;
  grid-template-rows: auto auto 1fr auto;
  gap: 16px;
  min-height: 0;
  padding: clamp(24px, 4vw, 48px);
  background: #111;
}

.project-tag {
  width: fit-content;
  padding: 7px 11px;
  border-radius: 999px;
  color: #ff6b32;
  background: #4a2114;
  font-size: 0.75rem;
  font-weight: 950;
}

.project-card h3 {
  margin: 0;
  color: #fff;
  font-size: clamp(1.45rem, 3vw, 2.4rem);
  line-height: 1.08;
}

.project-card p {
  display: -webkit-box;
  overflow: hidden;
  margin: 0;
  max-width: 560px;
  color: #8f8f8f;
  font-size: 1rem;
  line-height: 1.65;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 3;
}

.project-meta {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin-top: auto;
  color: #7c7c7c;
  font-size: 0.78rem;
  font-weight: 850;
}

.project-meta span:last-child {
  color: #ff5a12;
  text-decoration: none;
}

.works-note {
  display: grid;
  grid-template-columns: minmax(260px, 0.9fr) minmax(280px, 1fr);
  gap: 32px;
  border-block: 1px solid var(--color-line);
  background: #000;
}

.works-note ul {
  display: grid;
  gap: 0;
  margin: 0;
  padding: 0;
  border-top: 1px solid var(--color-line);
  list-style: none;
}

.works-note li {
  padding: 18px 0;
  border-bottom: 1px solid var(--color-line);
  color: #f7f7f2;
  font-size: 1.08rem;
  font-weight: 850;
}

@media (max-width: 760px) {
  .works-hero {
    min-height: 84vh;
    place-items: center start;
  }

  .works-hero::after {
    background:
      radial-gradient(circle at 70% 18%, rgba(255, 90, 18, 0.28), transparent 18rem),
      linear-gradient(90deg, rgba(6, 6, 6, 0.92), rgba(6, 6, 6, 0.66) 58%, rgba(6, 6, 6, 0.42)),
      linear-gradient(0deg, rgba(6, 6, 6, 0.94), transparent 42%);
  }

  .hero-image {
    width: 100vw;
    opacity: 0.62;
  }

  .hero-copy {
    justify-items: start;
    text-align: left;
  }

  .works-note {
    grid-template-columns: 1fr;
  }

  .project-card {
    grid-template-columns: 1fr;
    height: auto;
    min-height: auto;
  }

  .project-image {
    height: auto;
    min-height: 220px;
    aspect-ratio: 16 / 11;
  }

  .project-card p {
    -webkit-line-clamp: unset;
  }
}
</style>
