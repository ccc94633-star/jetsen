<script setup>
import { computed, nextTick, onMounted, onUnmounted, ref } from 'vue'
import FloatingContactButtons from '@/components/FloatingContactButtons.vue'
import { works } from '@/data/works'
import { getPublishedWorks } from '@/services/worksService'
import heroVideo from '@/assets/videos/jestenVideo.MP4'

const serviceCards = [
  {
    title: '不鏽鋼門窗',
    description: '依現場尺寸製作，兼顧門窗結構、防鏽耐用與俐落收邊。',
    tone: 'black',
  },
  {
    title: '欄杆扶手',
    description: '重視高度、握感與安全固定，讓日常行走更穩定安心。',
    tone: 'gray',
  },
  {
    title: '隱形鐵窗',
    description: '保留採光與視野穿透，同時提升居家防護與使用彈性。',
    tone: 'orange',
  },
  {
    title: '採光罩',
    description: '處理排水、遮雨與結構支撐，讓陽台與戶外空間更好用。',
    tone: 'black',
  },
  {
    title: '快速捲門',
    description: '依出入口寬度與使用頻率規劃，兼顧安全、速度與維護。',
    tone: 'gray',
  },
  {
    title: '設計師鐵件',
    description: '配合圖面與空間比例，客製展示架、隔屏、收邊與造型鐵件。',
    tone: 'orange',
  },
]

const workCategories = ref(works)
const serviceTrack = ref(null)
const projectTrack = ref(null)
const processTrack = ref(null)
const isServiceDragging = ref(false)
const isProcessDragging = ref(false)

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

const serviceDrag = createDragScroll(serviceTrack, isServiceDragging)
const processDrag = createDragScroll(processTrack, isProcessDragging)

const serviceCardEls = ref([])
const processCardEls = ref([])
const hoveredServiceCardIndex = ref(null)
const selectedServiceCardIndex = ref(null)
const activeServiceCardIndex = computed(
  () => hoveredServiceCardIndex.value ?? selectedServiceCardIndex.value ?? null,
)

const setServiceCardRef = (el, index) => {
  serviceCardEls.value[index] = el
}

const setProcessCardRef = (el, index) => {
  processCardEls.value[index] = el
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

const serviceViewportHighlight = createViewportHighlight(
  serviceTrack,
  serviceCardEls,
  hoveredServiceCardIndex,
  '(max-width: 980px)',
)

const getProjectStep = (track) => {
  const isMobile = window.matchMedia('(max-width: 720px)').matches
  return isMobile ? track.clientWidth * 0.9 : track.clientWidth
}

const scrollProjects = (direction) => {
  const track = projectTrack.value

  if (!track) return

  track.scrollBy({
    left: direction * getProjectStep(track),
    behavior: 'smooth',
  })
}

const projectPage = ref(0)
const projectPageCount = ref(1)

const updateProjectPagination = () => {
  const track = projectTrack.value

  if (!track) return

  const step = getProjectStep(track)
  const maxScroll = track.scrollWidth - track.clientWidth

  if (step <= 0 || maxScroll <= 0) {
    projectPageCount.value = 1
    projectPage.value = 0
    return
  }

  projectPageCount.value = Math.round(maxScroll / step) + 1
  projectPage.value = Math.min(
    projectPageCount.value - 1,
    Math.round(track.scrollLeft / step),
  )
}

const goToProjectPage = (index) => {
  const track = projectTrack.value

  if (!track) return

  const maxScroll = track.scrollWidth - track.clientWidth

  track.scrollTo({
    left: Math.min(maxScroll, index * getProjectStep(track)),
    behavior: 'smooth',
  })
}

const projectCardRefs = ref([])

const setProjectCardRef = (el, index) => {
  projectCardRefs.value[index] = el?.$el ?? el ?? null
}

const scrollToCategory = (index) => {
  const card = projectCardRefs.value[index]

  card?.scrollIntoView({ behavior: 'smooth', inline: 'start', block: 'nearest' })
}

const processSteps = [
  {
    title: '初步諮詢',
    text: '了解需求、預算與現場條件，先抓出適合的施工方向。',
  },
  {
    title: '現場丈量',
    text: '到場確認尺寸、結構與收邊細節，減少後續修改。',
  },
  {
    title: '報價確認',
    text: '整理材料、工法與費用，確認後排入製作時程。',
  },
  {
    title: '製作施工',
    text: '依確認圖面加工安裝，維持線條、強度與安全性。',
  },
  {
    title: '完工驗收',
    text: '檢查固定、表面與使用狀態，完成現場交付。',
  },
]

const selectedProcessIndex = ref(null)
const hoveredProcessIndex = ref(null)
const activeProcessIndex = computed(
  () => hoveredProcessIndex.value ?? selectedProcessIndex.value ?? 0,
)

const processViewportHighlight = createViewportHighlight(
  processTrack,
  processCardEls,
  hoveredProcessIndex,
  '(max-width: 980px)',
)

onMounted(async () => {
  workCategories.value = await getPublishedWorks()
  await nextTick()
  updateProjectPagination()
  window.addEventListener('resize', updateProjectPagination)

  serviceViewportHighlight.refresh()
  processViewportHighlight.refresh()
  window.addEventListener('resize', serviceViewportHighlight.refresh)
  window.addEventListener('resize', processViewportHighlight.refresh)
})

onUnmounted(() => {
  window.removeEventListener('resize', updateProjectPagination)
  window.removeEventListener('resize', serviceViewportHighlight.refresh)
  window.removeEventListener('resize', processViewportHighlight.refresh)
  serviceViewportHighlight.disconnect()
  processViewportHighlight.disconnect()
})
</script>

<template>
  <section class="home-hero" aria-label="杰森鐵作首頁主視覺">
    <video class="hero-video" :src="heroVideo" autoplay muted loop playsinline preload="metadata"
      aria-hidden="true"></video>
    <div class="hero-overlay"></div>

    <div class="hero-content">
      <p class="eyebrow">JETSEN Metalwork</p>
      <h1>每一道鐵件，都是安全與美感的堅實承諾。</h1>
      <p>
        杰森鐵作承接不鏽鋼門窗、欄杆扶手、隱形鐵窗、採光罩、快速捲門與設計師鐵件，從丈量、製作到安裝都重視現場安全與細節。
      </p>
      <div class="hero-actions">
        <RouterLink class="primary-link" to="/contact">聯絡諮詢</RouterLink>
        <RouterLink class="secondary-link" to="/works">查看作品</RouterLink>
      </div>
    </div>
    <FloatingContactButtons />
  </section>

  <section class="hero-services-band">
    <div class="services-heading">
      <p class="eyebrow">Services</p>
      <h2>服務項目</h2>
    </div>
    <div
      ref="serviceTrack"
      class="hero-service-strip"
      :class="{ 'hero-service-strip--dragging': isServiceDragging }"
      aria-label="服務項目"
      @pointerdown="serviceDrag.start"
      @pointermove="serviceDrag.move"
      @pointerup="serviceDrag.stop"
      @pointercancel="serviceDrag.stop"
      @lostpointercapture="serviceDrag.stop"
    >
      <article v-for="(service, index) in serviceCards" :key="service.title" class="hero-service-card"
        :class="[`hero-service-card--${service.tone}`, { 'hero-service-card--active': activeServiceCardIndex === index }]"
        :ref="(el) => setServiceCardRef(el, index)" tabindex="0"
        @click="selectedServiceCardIndex = index">
        <span>{{ service.number }}</span>
        <h2>{{ service.title }}</h2>
        <p>{{ service.description }}</p>
      </article>
    </div>
    <div class="scroll-guide" aria-hidden="true">
      <span></span>
    </div>
  </section>

  <section class="section craft-section">
    <div>
      <p class="eyebrow">Craftsmanship</p>
      <h2>從現場條件到收邊細節，每一步都會影響最後的耐用度。</h2>
    </div>
    <p>
      鐵件工程不只是把材料裝上去，還包含結構固定、尺寸誤差、排水、動線、安全與視覺比例。杰森鐵作重視溝通和現場判斷，
      讓成品能融入空間，也能長期穩定使用。
    </p>
  </section>

  <section class="section works-preview">
    <div class="works-toolbar">
      <div>
        <p class="eyebrow">Gallery</p>
        <h2>杰森作品</h2>
      </div>
      <RouterLink class="text-link" to="/works">前往作品頁</RouterLink>
      <div class="category-pills" aria-label="Works categories">
        <button v-for="(category, index) in workCategories" :key="category.title" type="button"
          @click="scrollToCategory(index)">{{ category.title }}</button>
      </div>
    </div>

    <div class="project-carousel">
      <button class="project-nav project-nav--prev" type="button" aria-label="上一組作品" @click="scrollProjects(-1)">
        <span aria-hidden="true">‹</span>
      </button>
      <div ref="projectTrack" class="project-grid" @scroll="updateProjectPagination">
        <RouterLink v-for="(category, index) in workCategories" :key="category.slug" class="project-card"
          :ref="(el) => setProjectCardRef(el, index)"
          :to="{ name: 'works-detail', params: { slug: category.slug } }" :aria-label="`查看${category.title}作品`">
          <img :src="category.coverImage" :alt="`${category.title}工程作品`" loading="lazy" />
          <div>
            <span>{{ category.title }}</span>
            <p>{{ category.description }}</p>
          </div>
        </RouterLink>
      </div>
      <button class="project-nav project-nav--next" type="button" aria-label="下一組作品" @click="scrollProjects(1)">
        <span aria-hidden="true">›</span>
      </button>
    </div>

    <div class="project-pagination" role="tablist" aria-label="作品頁碼">
      <button v-for="index in projectPageCount" :key="index" type="button" class="project-page-btn"
        :class="{ 'project-page-btn--active': index - 1 === projectPage }"
        :aria-current="index - 1 === projectPage ? 'true' : undefined" @click="goToProjectPage(index - 1)">
        {{ index }}
      </button>
    </div>
  </section>


  <section class="section intro-section">
    <div class="section-heading">
      <p class="eyebrow">Built for Site Conditions</p>
      <h2>每個案場都會先確認尺寸、 環境、動線、安全需求與預算，再提出適合的施工方向。</h2>
    </div>
  </section>

  <section class="section process-section">
    <div class="section-heading split-heading process-heading">
      <div>
        <p class="eyebrow">Process</p>
        <h2>施工流程</h2>
      </div>
    </div>

    <ol
      ref="processTrack"
      class="process-list"
      :class="{ 'process-list--dragging': isProcessDragging }"
      @pointerdown="processDrag.start"
      @pointermove="processDrag.move"
      @pointerup="processDrag.stop"
      @pointercancel="processDrag.stop"
      @lostpointercapture="processDrag.stop"
    >
      <li
        v-for="(step, index) in processSteps"
        :key="step.title"
        class="process-card"
        :class="{ 'process-card--active': activeProcessIndex === index }"
        :ref="(el) => setProcessCardRef(el, index)"
        tabindex="0"
        @mouseenter="hoveredProcessIndex = index"
        @mouseleave="hoveredProcessIndex = null"
        @click="selectedProcessIndex = index"
        @focus="hoveredProcessIndex = index"
        @blur="hoveredProcessIndex = null"
      >
        <span class="process-number" aria-hidden="true">{{ index + 1 }}</span>
        <strong>{{ step.title }}</strong>
        <p>{{ step.text }}</p>
      </li>
    </ol>
    <div class="scroll-guide process-scroll-guide" aria-hidden="true">
      <span></span>
    </div>
  </section>


</template>

<style scoped>
.home-hero {
  position: relative;
  display: grid;
  min-height: calc(100vh - 76px);
  overflow: hidden;
  padding: clamp(96px, 14vw, 160px) clamp(20px, 5vw, 72px) clamp(96px, 12vw, 140px);
}

.hero-video,
.hero-overlay {
  position: absolute;
  inset: 0;
}

.hero-video {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.hero-overlay {
  background:
    radial-gradient(circle at 70% 18%, rgba(255, 90, 18, 0.32), transparent 22rem),
    linear-gradient(90deg, rgba(6, 6, 6, 0.94), rgba(6, 6, 6, 0.64) 52%, rgba(6, 6, 6, 0.42)),
    linear-gradient(0deg, rgba(6, 6, 6, 0.96), transparent 42%);
}

.hero-content {
  position: relative;
  z-index: 1;
  display: grid;
  align-content: center;
  max-width: 860px;
}

.hero-content h1 {
  max-width: 920px;
  margin: 0;
  color: #fff;
  font-size: clamp(3rem, 7.7vw, 7.2rem);
  font-weight: 950;
  line-height: 0.94;
}

.hero-content p:not(.eyebrow) {
  max-width: 680px;
  color: #e3e0d8;
  font-size: 1.08rem;
  line-height: 1.85;
}

.hero-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  margin-top: 12px;
}

.hero-services-band {
  padding: clamp(22px, 5vw, 54px) clamp(20px, 5vw, 72px);
  background:
    radial-gradient(circle at 12% 35%, rgba(255, 90, 18, 0.18), transparent 22rem),
    #070707;
}

.services-heading {
  max-width: 1180px;
  margin: 0 auto clamp(20px, 3vw, 32px);
}

.services-heading .eyebrow {
  margin-bottom: 10px;
}

.services-heading h2 {
  margin: 0;
  color: #fff;
  font-size: clamp(1.8rem, 3vw, 2.65rem);
  font-weight: 950;
}

.hero-service-strip {
  display: flex;
  gap: 0;
  overflow: hidden;
  min-height: 210px;
  max-width: 1180px;
  margin-inline: auto;
  border-radius: 8px;
  background: #0d0d0d;
  box-shadow: 0 24px 70px rgba(0, 0, 0, 0.34);
}

.hero-service-strip--dragging {
  cursor: grabbing;
  scroll-snap-type: none;
}

.hero-service-strip--dragging .hero-service-card {
  pointer-events: none;
}

.process-list--dragging {
  cursor: grabbing;
  scroll-snap-type: none;
}

.process-list--dragging li {
  pointer-events: none;
}

.hero-service-strip::-webkit-scrollbar,
.process-list::-webkit-scrollbar,
.project-grid::-webkit-scrollbar,
.category-pills::-webkit-scrollbar {
  height: 6px;
}

.hero-service-strip::-webkit-scrollbar-track,
.process-list::-webkit-scrollbar-track,
.project-grid::-webkit-scrollbar-track,
.category-pills::-webkit-scrollbar-track {
  background: rgba(255, 255, 255, 0.08);
  border-radius: 999px;
}

.hero-service-strip::-webkit-scrollbar-thumb,
.process-list::-webkit-scrollbar-thumb,
.project-grid::-webkit-scrollbar-thumb,
.category-pills::-webkit-scrollbar-thumb {
  border-radius: 999px;
  background: rgba(255, 90, 18, 0.84);
}

.hero-service-card {
  position: relative;
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
  transition:
    flex 360ms ease,
    background 360ms ease,
    color 360ms ease,
    transform 360ms ease;
}

.hero-service-card:last-child {
  border-right: 0;
}

.hero-service-card::before {
  position: absolute;
  inset: 0;
  background:
    radial-gradient(circle at 82% 18%, rgba(255, 255, 255, 0.14), transparent 7rem),
    linear-gradient(145deg, rgba(255, 255, 255, 0.1), transparent 50%);
  opacity: 0;
  pointer-events: none;
  transition: opacity 300ms ease;
  content: '';
}

.hero-service-card:hover,
.hero-service-card:focus-visible,
.hero-service-card--active {
  z-index: 2;
  flex-grow: 1.82;
  transform: translateY(-6px);
  outline: none;
}

.hero-service-card:hover::before,
.hero-service-card:focus-visible::before,
.hero-service-card--active::before {
  opacity: 1;
}

.hero-service-card span {
  color: currentColor;
  font-size: 0.78rem;
  font-weight: 950;
  opacity: 0.72;
}

.hero-service-card h2 {
  max-width: 8em;
  margin: 0;
  color: currentColor;
  font-size: clamp(1.35rem, 2vw, 2.1rem);
  font-weight: 950;
  line-height: 1;
}

.hero-service-card p {
  max-width: 280px;
  margin: 0;
  color: currentColor;
  font-size: 0.84rem;
  line-height: 1.58;
  opacity: 0;
  transform: translateY(10px);
  transition:
    opacity 280ms ease,
    transform 280ms ease;
}

.hero-service-card:hover p,
.hero-service-card:focus-visible p,
.hero-service-card--active p {
  opacity: 0.82;
  transform: translateY(0);
}

.hero-service-card--black {
  background: linear-gradient(145deg, rgba(255, 255, 255, 0.06), transparent 54%);
}

.hero-service-card--orange {
  color: #171717;
  background: linear-gradient(180deg, #ff6a18, #f04a0a);
}

.hero-service-card--gray {
  background:
    linear-gradient(145deg, rgba(255, 255, 255, 0.09), transparent 52%),
    #141414;
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

.intro-section {
  display: grid;
  grid-template-columns: minmax(220px, 0.8fr) minmax(280px, 1fr);
  gap: 32px;
  align-items: start;
}

.intro-section .section-heading {
  grid-column: 1 / -1;
  width: 100%;
}

.split-heading {
  display: flex;
  align-items: end;
  justify-content: space-between;
  gap: 24px;
}

.works-preview {
  padding-top: 24px;
  background: #000;
}

.works-toolbar {
  display: grid;
  justify-items: center;
  gap: 22px;
  margin-bottom: clamp(34px, 5vw, 58px);
  text-align: center;
}

.works-toolbar h2 {
  max-width: 620px;
}

.works-toolbar .eyebrow {
  text-align: center;
}

.works-toolbar>.text-link {
  display: none;
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
  background:linear-gradient(180deg, #ff5d19 0%, #f0440a 100%);
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.05);
  font: inherit;
  font-size: 0.9rem;
  font-weight: 900;
  cursor: pointer;
  transition:
    box-shadow 180ms ease,
    transform 180ms ease;
}

.category-pills button:hover,
.category-pills button:focus-visible {
  box-shadow:
    0 0 28px rgba(255, 90, 18, 0.28),
    inset 0 1px 0 rgba(255, 255, 255, 0.18);
  outline: none;
  transform: translateY(-2px);
}

.project-carousel {
  position: relative;
  max-width: 1180px;
  margin-inline: auto;
}

.project-grid {
  display: flex;
  gap: clamp(14px, 2vw, 18px);
  max-width: 1180px;
  margin-inline: auto;
  overflow-x: hidden;
  scroll-behavior: smooth;
}

.project-nav {
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
  box-shadow: none;
  cursor: pointer;
  opacity: 0.8;
  transform: translateY(-50%);
  transition:
    background 180ms ease,
    border-color 180ms ease,
    transform 180ms ease,
    opacity 180ms ease;
}

.project-nav:hover,
.project-nav:focus-visible {
  border-color: #ff7a32;
  background: rgba(22, 22, 22, 0.96);
  outline: none;
  opacity: 1;
  transform: translateY(-50%) scale(1.04);
}

.project-nav--prev {
  left: -22px;
}

.project-nav--next {
  right: -22px;
}

.project-nav span {
  display: block;
  margin-top: -2px;
  font-size: 1.28rem;
  font-weight: 600;
  line-height: 1;
}

.project-card {
  flex: 0 0 calc((100% - 2 * clamp(14px, 2vw, 18px)) / 3);
  min-width: 0;
  overflow: hidden;
  border: 1px solid rgba(255, 255, 255, 0.045);
  border-radius: 18px;
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

.project-card>img {
  display: block;
  width: 100%;
  aspect-ratio: 16 / 11;
  object-fit: cover;
  background: #171717;
  filter: saturate(1.2) contrast(1.05) sepia(0.08);
  transition: transform 260ms ease;
}

.project-card:hover>img {
  transform: scale(1.04);
}

.project-card>div {
  display: grid;
  gap: 14px;
  min-height: 110px;
  padding: 18px 18px 20px;
  background: #111;
}

.project-card span {
  margin: 0;
  color: #fff;
  font-size: clamp(1.25rem, 1.8vw, 1.55rem);
  font-weight: 950;
  line-height: 1.08;
}

.project-card p {
  display: -webkit-box;
  overflow: hidden;
  margin: 0;
  color: #8f8f8f;
  font-size: 0.95rem;
  line-height: 1.65;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  line-clamp: 2;
}

.project-pagination {
  display: none;
  justify-content: center;
  gap: 10px;
  margin-top: 20px;
}

.project-page-btn {
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

.project-page-btn:hover,
.project-page-btn:focus-visible {
  border-color: rgba(255, 90, 18, 0.5);
  color: #fff;
  outline: none;
}

.project-page-btn--active {
  border-color: transparent;
  color: #fff;
  background: linear-gradient(180deg, #ff5d19 0%, #f0440a 100%);
  box-shadow: 0 0 20px rgba(255, 90, 18, 0.32);
  transform: translateY(-2px);
}

.craft-section {
  display: grid;
  grid-template-columns: minmax(260px, 0.9fr) minmax(280px, 1fr);
  gap: 32px;
  border-block: 1px solid var(--color-line);
  background:
    radial-gradient(circle at 0 0, rgba(255, 90, 18, 0.16), transparent 24rem),
    #0d0d0d;
}

.craft-section h2 {
  max-width: 640px;
}

.process-section {
  background:
    radial-gradient(circle at 92% 18%, rgba(255, 90, 18, 0.12), transparent 19rem),
    rgba(255, 255, 255, 0.012);
}

.process-heading {
  align-items: start;
}

.process-heading p:not(.eyebrow) {
  max-width: 520px;
  margin: 0;
  font-size: 0.95rem;
}

.process-list {
  display: flex;
  gap: 0;
  width: 100%;
  min-height: 210px;
  max-width: none;
  margin: 0;
  padding: 0;
  overflow: hidden;
  border: 0;
  border-radius: 8px;
  list-style: none;
  background: #0d0d0d;
  box-shadow: 0 24px 70px rgba(0, 0, 0, 0.34);
}

.process-list li {
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
  transition:
    flex 360ms ease,
    background 360ms ease,
    border-color 360ms ease,
    color 360ms ease,
    transform 360ms ease;
}

.process-list li:last-child {
  border-right: 0;
}

.process-list li::before {
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

.process-list li:hover,
.process-list li:focus-visible,
.process-list li.process-card--active {
  z-index: 2;
  flex-grow: 1.82;
  border-color: rgba(255, 115, 31, 0.4);
  color: #171717;
  background: linear-gradient(180deg, #ff7a24, #f04a0a);
  transform: translateY(-6px);
  outline: none;
}

.process-list li:hover::before,
.process-list li:focus-visible::before,
.process-list li.process-card--active::before {
  opacity: 1;
}

.process-number {
  position: absolute;
  right: 0;
  bottom: 0;
  z-index: 0;
  color: rgba(255, 138, 76, 0.42);
  font-size: clamp(7rem, 10vw, 10.5rem);
  font-weight: 950;
  line-height: 0.8;
  pointer-events: none;
  user-select: none;
  transition:
    color 300ms ease,
    opacity 300ms ease;
}

.process-list li:hover .process-number,
.process-list li:focus-visible .process-number,
.process-list li.process-card--active .process-number {
  color: rgba(255, 255, 255, 0.34);
}

.process-list strong {
  position: relative;
  z-index: 1;
  max-width: 8em;
  margin: 0;
  color: currentColor;
  font-size: clamp(1.35rem, 2vw, 2.1rem);
  font-weight: 950;
  line-height: 1;
}

.process-list p {
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

.process-list li:hover p,
.process-list li:focus-visible p,
.process-list li.process-card--active p {
  opacity: 0.82;
  transform: translateY(0);
}

.process-scroll-guide {
  display: none;
}

.process-cta {
  justify-self: center;
  margin-top: clamp(26px, 4vw, 42px);
}

@media (max-width: 980px) {
  .hero-services-band .scroll-guide {
    display: grid;
  }

  .hero-service-strip {
    gap: 12px;
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

  .hero-service-card {
    flex: 0 0 240px;
    min-height: 168px;
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 6px;
    scroll-snap-align: start;
  }

  .hero-service-card:hover,
  .hero-service-card:focus-visible,
  .hero-service-card--active {
    flex-basis: 300px;
    flex-grow: 0;
  }

  .process-scroll-guide {
    display: grid;
  }

  .process-list {
    gap: 12px;
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

  .process-list li {
    flex: 0 0 240px;
    min-height: 168px;
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 6px;
    scroll-snap-align: start;
  }

  .process-list li:hover,
  .process-list li:focus-visible,
  .process-list li.process-card--active {
    flex-basis: 300px;
  }
}

@media (max-width: 720px) {
  .home-hero {
    min-height: 84vh;
  }

  .hero-content h1 {
    font-size: clamp(2.7rem, 6.9vw, 6.48rem);
    line-height: 1.12;
  }

  .hero-service-strip {
    min-height: 156px;
  }

  .hero-service-card {
    flex-basis: 218px;
    min-height: 156px;
    padding: 18px;
  }

  .hero-service-card:hover,
  .hero-service-card:focus-visible,
  .hero-service-card--active {
    flex-basis: 258px;
    flex-grow: 0;
    transform: translateY(-4px);
  }

  .hero-service-card p {
    opacity: 0.78;
    transform: none;
  }

  .craft-section {
    grid-template-columns: 1fr;
  }

  .split-heading {
    align-items: start;
    flex-direction: column;
  }

  .category-pills {
    flex-wrap: wrap;
    justify-content: center;
    width: auto;
    max-width: 100%;
    padding: 7px;
    border: 1px solid rgba(255, 255, 255, 0.08);
    border-radius: 8px;
    background: #0b0b0b;
  }

  .category-pills button {
    min-height: 34px;
    flex: 0 0 auto;
    padding: 8px 16px;
    border: 1px solid rgba(255, 255, 255, 0.08);
    border-radius: 6px;
    background: rgba(255, 90, 18, 0.84);
    font-size: 0.82rem;
    line-height: 1;
    white-space: nowrap;
    text-align: center;
  }

  .project-grid {
    display: flex;
    width: 100%;
    overflow-x: auto;
    overscroll-behavior-x: contain;
    padding: 0 0 16px;
    scroll-padding-inline: clamp(16px, 4vw, 24px);
    scroll-snap-type: x proximity;
    scrollbar-color: rgba(255, 90, 18, 0.84) rgba(255, 255, 255, 0.08);
    scrollbar-width: thin;
  }

  .project-card {
    flex: 0 0 min(82vw, 340px);
    flex-basis: min(82vw, 340px);
    scroll-snap-align: start;
  }

  .project-pagination {
    display: flex;
  }

  .project-nav {
    display: grid;
    top: 38%;
    width: 30.4px;
    height: 30.4px;
  }

  .project-nav--prev {
    left: 6px;
  }

  .project-nav--next {
    right: 6px;
  }

  .project-card>div {
    min-height: auto;
  }

  .process-list {
    min-height: 156px;
  }

  .process-list li {
    flex-basis: 218px;
    min-height: 156px;
    padding: 18px;
  }

  .process-list li:hover,
  .process-list li:focus-visible,
  .process-list li.process-card--active {
    flex-basis: 258px;
    transform: translateY(-4px);
  }

  .process-list p {
    opacity: 0.78;
    transform: none;
  }

  .process-scroll-guide {
    width: 100%;
    margin-top: 0;
  }

  .intro-section {
    display: none;
  }

}
</style>
