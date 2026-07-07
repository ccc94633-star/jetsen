<script setup>
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { RouterLink, useRoute } from 'vue-router'
import ScrollDownButton from '@/components/ScrollDownButton.vue'
import { findWorkBySlug, works } from '@/data/works'

const route = useRoute()
const work = computed(() => findWorkBySlug(route.params.slug) ?? works[0])
const relatedWorks = computed(() => works.filter((item) => item.slug !== work.value.slug).slice(0, 3))
const activeImage = ref(null)
const selectedServiceIndex = ref(null)
const hoveredServiceIndex = ref(null)

const scopeTrack = ref(null)
const isScopeDragging = ref(false)

const createDragScroll = (trackRef, draggingRef) => {
  const drag = { pointerId: null, startX: 0, scrollLeft: 0 }

  const start = (event) => {
    const track = trackRef.value

    if (!track || event.pointerType !== 'mouse' || event.button !== 0) return

    drag.pointerId = event.pointerId
    drag.startX = event.clientX
    drag.scrollLeft = track.scrollLeft
    draggingRef.value = true
    track.setPointerCapture?.(event.pointerId)
  }

  const move = (event) => {
    const track = trackRef.value

    if (!track || !draggingRef.value || event.pointerId !== drag.pointerId) return

    track.scrollLeft = drag.scrollLeft - (event.clientX - drag.startX)
  }

  const stop = (event) => {
    const track = trackRef.value

    if (!draggingRef.value || event.pointerId !== drag.pointerId) return

    if (track?.hasPointerCapture?.(event.pointerId)) {
      track.releasePointerCapture(event.pointerId)
    }
    drag.pointerId = null
    draggingRef.value = false
  }

  return { start, move, stop }
}

const scopeDrag = createDragScroll(scopeTrack, isScopeDragging)

const scopeCardEls = ref([])

const setScopeCardRef = (el, index) => {
  scopeCardEls.value[index] = el
}

const createViewportHighlight = (trackRef, cardEls, hoveredRef, query) => {
  const ratios = new Map()
  let observer = null

  const pickActive = () => {
    let bestIndex = null
    let bestRatio = 0

    ratios.forEach((ratio, index) => {
      if (ratio > bestRatio) {
        bestRatio = ratio
        bestIndex = index
      }
    })

    hoveredRef.value = bestIndex
  }

  const disconnect = () => {
    observer?.disconnect()
    observer = null
    ratios.clear()
  }

  const refresh = () => {
    disconnect()

    const track = trackRef.value

    if (!track || !window.matchMedia(query).matches) {
      hoveredRef.value = null
      return
    }

    observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          ratios.set(Number(entry.target.dataset.viewportIndex), entry.intersectionRatio)
        })
        pickActive()
      },
      { root: track, threshold: [0, 0.25, 0.5, 0.6, 0.75, 1] },
    )

    cardEls.value.forEach((el, index) => {
      if (!el) return
      el.dataset.viewportIndex = index
      observer.observe(el)
    })
  }

  return { refresh, disconnect }
}

const scopeViewportHighlight = createViewportHighlight(
  scopeTrack,
  scopeCardEls,
  hoveredServiceIndex,
  '(max-width: 900px)',
)

const relatedTrack = ref(null)
const relatedPage = ref(0)
const relatedPageCount = ref(1)

const getRelatedStep = (track) => {
  const isMobile = window.matchMedia('(max-width: 720px)').matches
  return isMobile ? track.clientWidth * 0.9 : track.clientWidth
}

const scrollRelated = (direction) => {
  const track = relatedTrack.value

  if (!track) return

  track.scrollBy({
    left: direction * getRelatedStep(track),
    behavior: 'smooth',
  })
}

const updateRelatedPagination = () => {
  const track = relatedTrack.value

  if (!track) return

  const step = getRelatedStep(track)
  const maxScroll = track.scrollWidth - track.clientWidth

  if (step <= 0 || maxScroll <= 0) {
    relatedPageCount.value = 1
    relatedPage.value = 0
    return
  }

  relatedPageCount.value = Math.round(maxScroll / step) + 1
  relatedPage.value = Math.min(
    relatedPageCount.value - 1,
    Math.round(track.scrollLeft / step),
  )
}

const goToRelatedPage = (index) => {
  const track = relatedTrack.value

  if (!track) return

  const maxScroll = track.scrollWidth - track.clientWidth

  track.scrollTo({
    left: Math.min(maxScroll, index * getRelatedStep(track)),
    behavior: 'smooth',
  })
}

const scopeDescriptions = {
  canopy: [
    '依現場採光、排水與動線規劃尺寸，讓遮雨棚兼顧遮蔽效果與外觀比例。',
    '選用適合戶外的骨架與板材，降低鏽蝕、變形與長期噪音問題。',
    '加強牆面、柱位與接點固定，讓棚架在日常風雨中維持穩定。',
    '收邊、矽利康與排水方向一併處理，讓完成面俐落也更好維護。',
  ],
  'railings-handrails': [
    '依樓梯、陽台或走道高度製作扶手，握感、轉角與收尾都會一起確認。',
    '現場丈量欄杆位置與間距，兼顧安全規範、視線穿透與空間風格。',
    '針對牆面、地面或既有結構補強固定，減少晃動並提升使用安全。',
    '可依需求做不鏽鋼、烤漆或防鏽處理，讓表面更耐用也更容易清潔。',
  ],
  'designer-metalwork': [
    '從設計圖、照片或現場需求轉成可施工尺寸，保留造型也顧到結構。',
    '依照空間比例、材質搭配與使用方式客製，讓鐵件融入整體設計。',
    '焊接、研磨與接縫收邊細緻處理，讓完成品有穩定且乾淨的線條。',
    '安裝前確認定位與固定方式，減少現場誤差並提升完工質感。',
  ],
  'invisible-grilles': [
    '依窗型與開口尺寸配置鋼索間距，兼顧防護、安全與視野通透。',
    '使用耐候鋼索與固定座，適合陽台、窗邊與高樓層日常防護。',
    '確認牆面強度與固定點，讓鋼索張力穩定、不易鬆脫或變形。',
    '收線、端點與整體張力細修，讓外觀清爽並保留採光與通風。',
  ],
}

const activeScopeDescriptions = computed(() => scopeDescriptions[work.value.slug] ?? work.value.services.map(() => work.value.detail))
const activeServiceIndex = computed(() => hoveredServiceIndex.value ?? selectedServiceIndex.value ?? 0)

const closeLightbox = () => {
  activeImage.value = null
}

const handleKeydown = (event) => {
  if (event.key === 'Escape') {
    closeLightbox()
  }
}

watch(activeImage, (image) => {
  document.body.style.overflow = image ? 'hidden' : ''
})

watch(relatedWorks, () => {
  nextTick(updateRelatedPagination)
})

onMounted(() => {
  window.addEventListener('keydown', handleKeydown)
  window.addEventListener('resize', updateRelatedPagination)
  nextTick(updateRelatedPagination)

  scopeViewportHighlight.refresh()
  window.addEventListener('resize', scopeViewportHighlight.refresh)
})

onBeforeUnmount(() => {
  window.removeEventListener('keydown', handleKeydown)
  window.removeEventListener('resize', updateRelatedPagination)
  window.removeEventListener('resize', scopeViewportHighlight.refresh)
  scopeViewportHighlight.disconnect()
  document.body.style.overflow = ''
})
</script>

<template>
  <article class="work-detail">
    <section class="detail-hero">
      <img class="hero-image" :src="work.coverImage" :alt="`${work.title}作品封面`" />
      <div class="hero-shade"></div>

      <div class="hero-copy">
        <p class="eyebrow">{{ work.tag }}</p>
        <h1>{{ work.headline }}</h1>
        <p>{{ work.detail }}</p>
      </div>

      <ScrollDownButton />
    </section>

    <section class="section service-block">
      <div class="section-heading">
        <p class="eyebrow">Scope</p>
        <h2>{{ work.title }}施作範圍</h2>
      </div>
      <div
        ref="scopeTrack"
        class="scope-row"
        :class="{ 'scope-row--dragging': isScopeDragging }"
        @pointerdown="scopeDrag.start"
        @pointermove="scopeDrag.move"
        @pointerup="scopeDrag.stop"
        @pointercancel="scopeDrag.stop"
        @lostpointercapture="scopeDrag.stop"
      >
        <article
          v-for="(service, index) in work.services"
          :key="service"
          class="scope-card"
          :class="{ 'scope-card--active': activeServiceIndex === index }"
          :ref="(el) => setScopeCardRef(el, index)"
          tabindex="0"
          @mouseenter="hoveredServiceIndex = index"
          @mouseleave="hoveredServiceIndex = null"
          @click="selectedServiceIndex = index"
          @focus="hoveredServiceIndex = index"
          @blur="hoveredServiceIndex = null"
        >
          <span class="scope-number" aria-hidden="true">{{ index + 1 }}</span>
          <h3>{{ service }}</h3>
          <p>{{ activeScopeDescriptions[index] }}</p>
        </article>
      </div>
      <div class="scroll-guide" aria-hidden="true">
        <span></span>
      </div>
    </section>

    <section class="section results-block">
      <div class="results-heading">
        <div>
          <p class="eyebrow">Gallery</p>
          <h2>作品照片</h2>
        </div>
      </div>

      <div class="photo-grid">
        <figure v-for="(image, index) in work.gallery" :key="`${work.slug}-${index}`">
          <button
            type="button"
            :aria-label="`查看${work.title}作品照片 ${index + 1}`"
            @click="activeImage = image"
          >
            <img :src="image" :alt="`${work.title}作品照片 ${index + 1}`" loading="lazy" />
          </button>
        </figure>
      </div>
    </section>

    <section class="section related-block">
      <div class="section-heading">
        <p class="eyebrow">More Works</p>
        <h2>更多相關作品</h2>
      </div>
      <div class="related-carousel">
        <button
          v-if="relatedPageCount > 1"
          class="related-nav related-nav--prev"
          type="button"
          aria-label="上一項相關作品"
          @click="scrollRelated(-1)"
        >
          <span aria-hidden="true">‹</span>
        </button>
        <div ref="relatedTrack" class="related-grid" @scroll="updateRelatedPagination">
          <RouterLink
            v-for="item in relatedWorks"
            :key="item.slug"
            class="related-card"
            :to="{ name: 'works-detail', params: { slug: item.slug } }"
          >
            <img :src="item.coverImage" :alt="`${item.title}作品照片`" loading="lazy" />
            <span>{{ item.tag }}</span>
            <strong>{{ item.title }}</strong>
          </RouterLink>
        </div>
        <button
          v-if="relatedPageCount > 1"
          class="related-nav related-nav--next"
          type="button"
          aria-label="下一項相關作品"
          @click="scrollRelated(1)"
        >
          <span aria-hidden="true">›</span>
        </button>
      </div>

      <div class="related-pagination" role="tablist" aria-label="相關作品頁碼">
        <button
          v-for="index in relatedPageCount"
          :key="index"
          type="button"
          class="related-page-btn"
          :class="{ 'related-page-btn--active': index - 1 === relatedPage }"
          :aria-current="index - 1 === relatedPage ? 'true' : undefined"
          @click="goToRelatedPage(index - 1)"
        >
          {{ index }}
        </button>
      </div>
    </section>

    <Teleport to="body">
      <div v-if="activeImage" class="lightbox" role="dialog" aria-modal="true" aria-label="作品照片放大檢視">
        <button class="lightbox-backdrop" type="button" aria-label="關閉照片" @click="closeLightbox"></button>
        <div class="lightbox-panel">
          <img :src="activeImage" :alt="`${work.title}作品放大照片`" />
          <button class="lightbox-close" type="button" aria-label="關閉照片" @click="closeLightbox">×</button>
        </div>
      </div>
    </Teleport>
  </article>
</template>

<style scoped>
.work-detail {
  overflow: hidden;
  background: #050505;
}

.detail-hero {
  position: relative;
  display: grid;
  min-height: calc(100vh - 76px);
  min-height: calc(100svh - 76px);
  align-items: center;
  overflow: hidden;
  padding: clamp(96px, 14vw, 160px) clamp(20px, 5vw, 72px) clamp(96px, 12vw, 140px);
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  background: #0b0503;
}

.hero-image,
.hero-shade {
  position: absolute;
  inset: 0;
}

.hero-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  filter: saturate(1.18) contrast(1.08) brightness(0.72);
  transform: scale(1.04);
}

.hero-shade {
  background:
    radial-gradient(circle at 70% 18%, rgba(255, 90, 18, 0.32), transparent 22rem),
    linear-gradient(90deg, rgba(6, 6, 6, 0.94), rgba(6, 6, 6, 0.64) 52%, rgba(6, 6, 6, 0.42)),
    linear-gradient(0deg, rgba(6, 6, 6, 0.96), transparent 42%);
}

.hero-topbar {
  position: absolute;
  top: clamp(18px, 4vw, 34px);
  right: clamp(20px, 5vw, 72px);
  left: clamp(20px, 5vw, 72px);
  z-index: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
}

.brand-chip,
.start-button {
  color: #fff;
  text-decoration: none;
}

.brand-chip {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  min-width: 0;
}

.brand-chip span {
  display: grid;
  width: 30px;
  height: 30px;
  place-items: center;
  border-radius: 8px;
  color: #fff;
  background: linear-gradient(180deg, #ff6a18, #f04a0a);
  font-weight: 950;
}

.brand-chip strong {
  color: #f5f0e8;
  font-size: 0.78rem;
  line-height: 1.05;
}

.start-button {
  position: relative;
  display: inline-flex;
  min-height: 34px;
  align-items: center;
  padding: 8px 34px 8px 14px;
  border-radius: 999px;
  background: linear-gradient(180deg, #ff741f, #f04a0a);
  box-shadow: 0 0 28px rgba(255, 90, 18, 0.32);
  font-size: 0.72rem;
  font-weight: 950;
}

.start-button::after {
  position: absolute;
  right: 7px;
  display: grid;
  width: 20px;
  height: 20px;
  place-items: center;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.22);
  content: '>';
}

.hero-copy {
  position: relative;
  z-index: 1;
  display: grid;
  gap: 18px;
  max-width: 860px;
}

.hero-copy h1 {
  max-width: 760px;
  margin: 0;
  color: #fff;
  font-size: clamp(2.6rem, 7vw, 6.6rem);
  font-weight: 950;
  line-height: 0.92;
}

.hero-copy p:not(.eyebrow) {
  max-width: 520px;
  margin: 0;
  color: #e5ded3;
  font-size: 1rem;
  line-height: 1.78;
}

.ticker {
  display: flex;
  gap: clamp(34px, 7vw, 88px);
  overflow: hidden;
  padding: 18px 0;
  border-block: 1px solid rgba(255, 255, 255, 0.08);
  color: #8f8b83;
  background: #050505;
  white-space: nowrap;
}

.ticker span {
  flex: 0 0 auto;
  font-size: 0.82rem;
  font-weight: 850;
}

.intro-block {
  display: grid;
  justify-items: start;
  text-align: left;
  background: #050505;
}

.intro-block h2 {
  max-width: 720px;
  text-transform: uppercase;
}

.intro-block p:not(.eyebrow) {
  margin: 14px 0 0;
}

.video-panel {
  display: grid;
  width: min(100%, 760px);
  aspect-ratio: 16 / 9;
  place-items: center;
  margin-top: 34px;
  border: 1px solid rgba(255, 255, 255, 0.09);
  border-radius: 8px;
  background:
    linear-gradient(145deg, rgba(255, 90, 18, 0.16), transparent 42%),
    #3f3f3f;
  box-shadow: 0 24px 70px rgba(0, 0, 0, 0.38);
}

.video-panel button {
  display: grid;
  width: 58px;
  height: 58px;
  place-items: center;
  border: 0;
  border-radius: 50%;
  background: linear-gradient(180deg, #ff741f, #ef4308);
  cursor: pointer;
}

.video-panel span {
  width: 0;
  height: 0;
  margin-left: 4px;
  border-block: 10px solid transparent;
  border-left: 15px solid #fff;
}

.service-block {
  background:
    radial-gradient(circle at 12% 35%, rgba(255, 90, 18, 0.18), transparent 22rem),
    #070707;
}

.scope-row {
  display: flex;
  gap: 0;
  min-height: 210px;
  max-width: 1180px;
  margin-inline: auto;
  overflow: hidden;
  border-radius: 8px;
  background: #0d0d0d;
  box-shadow: 0 24px 70px rgba(0, 0, 0, 0.34);
}

.scope-row--dragging {
  cursor: grabbing;
  scroll-snap-type: none;
}

.scope-row--dragging .scope-card {
  pointer-events: none;
}

.scope-row::-webkit-scrollbar {
  height: 6px;
}

.scope-row::-webkit-scrollbar-track {
  background: rgba(255, 255, 255, 0.08);
  border-radius: 999px;
}

.scope-row::-webkit-scrollbar-thumb {
  border-radius: 999px;
  background: rgba(255, 90, 18, 0.84);
}

.scroll-guide {
  display: none;
  justify-content: end;
  max-width: 1180px;
  height: 26px;
  margin: 12px auto 0;
  pointer-events: none;
}

.scroll-guide::before {
  display: block;
  width: min(180px, 42vw);
  height: 2px;
  align-self: center;
  border-radius: 999px;
  background: linear-gradient(90deg, transparent, rgba(255, 90, 18, 0.85), transparent);
  content: '';
}

.scroll-guide span {
  position: relative;
  display: block;
  width: 34px;
  height: 20px;
  margin-top: -22px;
  border-radius: 999px;
  background: rgba(255, 90, 18, 0.92);
  box-shadow: 0 0 24px rgba(255, 90, 18, 0.34);
  animation: scroll-guide-drift 1.8s ease-in-out infinite;
}

.scroll-guide span::after {
  position: absolute;
  top: 50%;
  right: 9px;
  width: 8px;
  height: 8px;
  border-top: 2px solid #fff;
  border-right: 2px solid #fff;
  content: '';
  transform: translateY(-50%) rotate(45deg);
}

@keyframes scroll-guide-drift {

  0%,
  100% {
    transform: translateX(-48px);
    opacity: 0.5;
  }

  45% {
    transform: translateX(0);
    opacity: 1;
  }
}

.scope-card {
  position: relative;
  isolation: isolate;
  display: grid;
  flex: 1 1 0;
  align-content: space-between;
  gap: 18px;
  min-width: 0;
  min-height: 210px;
  overflow: hidden;
  padding: 20px;
  border-right: 1px solid rgba(255, 255, 255, 0.1);
  color: #f4f4ef;
  background: linear-gradient(145deg, rgba(255, 255, 255, 0.06), transparent 54%);
  cursor: pointer;
  transition:
    flex 360ms ease,
    background 360ms ease,
    border-color 360ms ease,
    color 360ms ease,
    transform 360ms ease;
}

.scope-card:last-child {
  border-right: 0;
}

.scope-card::before {
  position: absolute;
  inset: 0;
  z-index: 0;
  background:
    radial-gradient(circle at 82% 18%, rgba(255, 255, 255, 0.14), transparent 7rem),
    linear-gradient(145deg, rgba(255, 255, 255, 0.1), transparent 50%);
  opacity: 0;
  pointer-events: none;
  transition: opacity 300ms ease;
  content: '';
}

.scope-card:hover,
.scope-card:focus-visible,
.scope-card--active {
  z-index: 2;
  flex-grow: 1.82;
  border-color: rgba(255, 115, 31, 0.4);
  color: #171717;
  background: linear-gradient(180deg, #ff7a24, #f04a0a);
  transform: translateY(-6px);
  outline: none;
}

.scope-card:hover::before,
.scope-card:focus-visible::before,
.scope-card--active::before {
  opacity: 1;
}

.scope-number {
  position: absolute;
  right: 0;
  bottom: 0;
  z-index: 0;
  color: rgba(255, 107, 50, 0.18);
  font-size: clamp(7rem, 10vw, 10.5rem);
  font-weight: 950;
  line-height: 0.8;
  pointer-events: none;
  user-select: none;
  transition:
    color 300ms ease,
    opacity 300ms ease;
}

.scope-card:hover .scope-number,
.scope-card:focus-visible .scope-number,
.scope-card--active .scope-number {
  color: rgba(255, 255, 255, 0.24);
}

.scope-card h3 {
  position: relative;
  z-index: 1;
  max-width: 8em;
  margin: 0;
  color: currentColor;
  font-size: clamp(1.35rem, 2vw, 2.1rem);
  font-weight: 950;
  line-height: 1;
}

.scope-card p {
  position: relative;
  z-index: 1;
  max-width: 280px;
  margin: 0;
  color: currentColor;
  font-size: 1.008rem;
  line-height: 1.58;
  opacity: 0;
  transform: translateY(10px);
  transition:
    opacity 280ms ease,
    transform 280ms ease;
}

.scope-card:hover p,
.scope-card:focus-visible p,
.scope-card--active p {
  opacity: 0.82;
  transform: translateY(0);
}

.results-block {
  background: #050505;
}

.results-heading {
  display: grid;
  grid-template-columns: minmax(240px, 0.7fr) minmax(280px, 1fr);
  gap: 22px;
  align-items: end;
  max-width: 1180px;
  margin: 0 auto 24px;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 12px;
}

.stats-grid article {
  display: grid;
  gap: 4px;
  padding: 16px;
  border-radius: 8px;
  color: #050505;
  background: #f4f0ea;
}

.stats-grid strong {
  font-size: clamp(2rem, 4vw, 4.2rem);
  font-weight: 950;
  line-height: 0.9;
}

.stats-grid span {
  color: #353535;
  font-size: 0.76rem;
  font-weight: 900;
}

.photo-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 14px;
  max-width: 1180px;
  margin-inline: auto;
}

.photo-grid figure {
  position: relative;
  overflow: hidden;
  margin: 0;
  border-radius: 8px;
  background: #111;
}

.photo-grid button {
  display: block;
  width: 100%;
  height: 100%;
  padding: 0;
  border: 0;
  color: inherit;
  background: transparent;
  cursor: zoom-in;
}

.photo-grid figure:nth-child(5n + 1) {
  grid-row: span 2;
}

.photo-grid img {
  display: block;
  width: 100%;
  height: 100%;
  min-height: 220px;
  aspect-ratio: 4 / 3;
  object-fit: cover;
  filter: saturate(1.08) contrast(1.04);
  transition: transform 240ms ease;
}

.photo-grid figure:hover img {
  transform: scale(1.04);
}

.lightbox {
  position: fixed;
  inset: 0;
  z-index: 100;
  display: grid;
  place-items: center;
  padding: clamp(18px, 4vw, 48px);
}

.lightbox-backdrop {
  position: absolute;
  inset: 0;
  border: 0;
  background: rgba(0, 0, 0, 0.84);
  cursor: zoom-out;
}

.lightbox-panel {
  position: relative;
  z-index: 1;
  display: grid;
  max-width: min(1120px, 94vw);
  max-height: 88vh;
  place-items: center;
}

.lightbox-panel img {
  display: block;
  max-width: min(1120px, 94vw);
  max-height: 88vh;
  border-radius: 8px;
  object-fit: contain;
  box-shadow: 0 28px 90px rgba(0, 0, 0, 0.58);
}

.lightbox-close {
  position: absolute;
  top: -16px;
  right: -16px;
  display: grid;
  width: 42px;
  height: 42px;
  place-items: center;
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 50%;
  color: #fff;
  background: linear-gradient(180deg, #ff741f, #ef4308);
  box-shadow: 0 14px 34px rgba(0, 0, 0, 0.38);
  cursor: pointer;
  font-size: 1.6rem;
  line-height: 1;
}

.related-block {
  border-top: 1px solid rgba(255, 255, 255, 0.08);
  background:
    radial-gradient(circle at 86% 16%, rgba(255, 90, 18, 0.14), transparent 22rem),
    #070707;
}

.related-carousel {
  position: relative;
  max-width: 1180px;
  margin-inline: auto;
}

.related-grid {
  display: flex;
  gap: 14px;
  overflow-x: hidden;
  scroll-behavior: smooth;
}

.related-nav {
  position: absolute;
  top: 42%;
  z-index: 3;
  display: grid;
  width: 32px;
  height: 32px;
  place-items: center;
  border: 1px solid var(--color-accent);
  border-radius: 0;
  color: #fff;
  background: rgba(12, 12, 12, 0.92);
  cursor: pointer;
  opacity: 0.8;
  transform: translateY(-50%);
  transition:
    background 180ms ease,
    border-color 180ms ease,
    transform 180ms ease,
    opacity 180ms ease;
}

.related-nav:hover,
.related-nav:focus-visible {
  border-color: #ff7a32;
  background: rgba(22, 22, 22, 0.96);
  outline: none;
  opacity: 1;
  transform: translateY(-50%) scale(1.04);
}

.related-nav--prev {
  left: -22px;
}

.related-nav--next {
  right: -22px;
}

.related-nav span {
  display: block;
  margin-top: -2px;
  font-size: 1.28rem;
  font-weight: 600;
  line-height: 1;
}

.related-card {
  display: grid;
  flex: 0 0 calc((100% - 2 * 14px) / 3);
  gap: 10px;
  min-width: 0;
  overflow: hidden;
  padding-bottom: 18px;
  border-radius: 8px;
  color: #fff;
  background: #111;
  text-decoration: none;
}

.related-card img {
  width: 100%;
  aspect-ratio: 16 / 10;
  object-fit: cover;
}

.related-card span,
.related-card strong {
  padding-inline: 16px;
}

.related-card span {
  color: #ff6a18;
  font-size: 0.75rem;
  font-weight: 950;
}

.related-card strong {
  font-size: 1.2rem;
}

.related-pagination {
  display: none;
  justify-content: center;
  gap: 10px;
  margin-top: 20px;
}

.related-page-btn {
  display: grid;
  width: 34px;
  height: 34px;
  place-items: center;
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 50%;
  color: #8f8f8f;
  background: #111;
  font-size: 0.85rem;
  font-weight: 900;
  cursor: pointer;
  transition:
    color 180ms ease,
    border-color 180ms ease,
    background 180ms ease,
    transform 180ms ease;
}

.related-page-btn:hover,
.related-page-btn:focus-visible {
  border-color: rgba(255, 90, 18, 0.5);
  color: #fff;
  outline: none;
}

.related-page-btn--active {
  border-color: transparent;
  color: #fff;
  background: linear-gradient(180deg, #ff5d19 0%, #f0440a 100%);
  box-shadow: 0 0 20px rgba(255, 90, 18, 0.32);
  transform: translateY(-2px);
}

@media (max-width: 900px) {
  .results-heading {
    grid-template-columns: 1fr 1fr;
  }

  .scope-row {
    overflow-x: auto;
    overscroll-behavior-x: contain;
    padding: 10px;
    scroll-padding-inline: 10px;
    scroll-snap-type: x proximity;
    cursor: grab;
    scrollbar-color: rgba(255, 90, 18, 0.84) rgba(255, 255, 255, 0.08);
    scrollbar-width: thin;
    user-select: none;
  }

  .service-block .scroll-guide {
    display: grid;
  }

  .scope-card {
    flex: 0 0 240px;
    min-height: 168px;
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 6px;
    scroll-snap-align: start;
  }

  .scope-card:hover,
  .scope-card:focus-visible,
  .scope-card--active {
    flex-basis: 300px;
  }

  .photo-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .related-card {
    flex: 0 0 min(60vw, 320px);
  }

  .related-nav {
    top: 38%;
    width: 30.4px;
    height: 30.4px;
  }

  .related-nav--prev {
    left: 6px;
  }

  .related-nav--next {
    right: 6px;
  }
}

@media (max-width: 640px) {
  .detail-hero {
    min-height: 82vh;
  }

  .hero-copy h1 {
    font-size: clamp(2.34rem, 6.3vw, 5.94rem);
    line-height: 1.1;
  }

  .hero-topbar {
    align-items: flex-start;
  }

  .results-heading,
  .stats-grid {
    grid-template-columns: 1fr;
  }

  .scope-row {
    min-height: 156px;
  }

  .scope-card {
    flex-basis: 218px;
    min-height: 156px;
    padding: 18px;
  }

  .scope-card:hover,
  .scope-card:focus-visible,
  .scope-card--active {
    flex-basis: 258px;
    transform: translateY(-4px);
  }

  .scope-card p {
    opacity: 0.78;
    transform: none;
  }

  .photo-grid {
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 4px;
  }

  .photo-grid img {
    min-height: 0;
    aspect-ratio: 3 / 4;
  }

  .photo-grid figure:nth-child(5n + 1) {
    grid-row: auto;
  }

  .related-grid {
    overflow-x: auto;
    overscroll-behavior-x: contain;
    padding: 0 0 16px;
    scroll-padding-inline: clamp(16px, 4vw, 24px);
    scroll-snap-type: x proximity;
    scrollbar-color: rgba(255, 90, 18, 0.84) rgba(255, 255, 255, 0.08);
    scrollbar-width: thin;
  }

  .related-card {
    flex: 0 0 min(82vw, 340px);
    scroll-snap-align: start;
  }

  .related-pagination {
    display: flex;
  }
}
</style>
