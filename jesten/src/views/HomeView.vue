<script setup>
import { works } from '@/data/works'
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

const workCategories = works

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
</script>

<template>
  <section class="home-hero" aria-label="杰森鐵作首頁主視覺">
    <video
      class="hero-video"
      :src="heroVideo"
      autoplay
      muted
      loop
      playsinline
      preload="metadata"
      aria-hidden="true"
    ></video>
    <div class="hero-overlay"></div>

    <div class="hero-content">
      <p class="eyebrow">JETSEN Metalwork</p>
      <h1>鐵件工程，要有結構，也要有俐落的完成度。</h1>
      <p>
        杰森鐵作承接不鏽鋼門窗、欄杆扶手、隱形鐵窗、採光罩、快速捲門與設計師鐵件，從丈量、製作到安裝都重視現場安全與細節。
      </p>
      <div class="hero-actions">
        <RouterLink class="primary-link" to="/contact">聯絡諮詢</RouterLink>
        <RouterLink class="secondary-link" to="/works">查看作品</RouterLink>
      </div>
    </div>
  </section>

  <section class="hero-services-band">
  
    <div class="hero-service-strip" aria-label="服務項目">
    </div>
    
      <article
        v-for="service in serviceCards"
        :key="service.title"
        class="hero-service-card"
        :class="`hero-service-card--${service.tone}`"
        tabindex="0"
      >
        <span>{{ service.number }}</span>
        <h2>{{ service.title }}</h2>
        <p>{{ service.description }}</p>
      </article>
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
        <h2>作品分類</h2>
      </div>
      <RouterLink class="text-link" to="/works">前往作品頁</RouterLink>
      <div class="category-pills" aria-label="Works categories">
        <span>All</span>
        <span v-for="category in workCategories" :key="category.title">{{ category.title }}</span>
      </div>
    </div>

    <div class="project-grid">
      <RouterLink
        v-for="category in workCategories"
        :key="category.slug"
        class="project-card"
        :to="{ name: 'works-detail', params: { slug: category.slug } }"
        :aria-label="`查看${category.title}作品`"
      >
        <img :src="category.coverImage" :alt="`${category.title}工程作品`" loading="lazy" />
        <div>
          <span>{{ category.title }}</span>
          <p>{{ category.description }}</p>
        </div>
      </RouterLink>
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
      <p>
        從諮詢到驗收，每一步都保留清楚節點，方便屋主掌握進度與品質。
      </p>
    </div>

    <ol class="process-list">
      <li v-for="(step, index) in processSteps" :key="step.title">
        <span>{{ index + 1 }}</span>
        <strong>{{ step.title }}</strong>
        <p>{{ step.text }}</p>
      </li>
    </ol>
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
.hero-service-card:focus-visible {
  z-index: 2;
  flex-grow: 1.82;
  transform: translateY(-6px);
  outline: none;
}

.hero-service-card:hover::before,
.hero-service-card:focus-visible::before {
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
.hero-service-card:focus-visible p {
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

.works-toolbar > .text-link {
  display: none;
}

.category-pills {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 12px;
}

.category-pills span {
  display: inline-flex;
  min-height: 46px;
  align-items: center;
  justify-content: center;
  padding: 12px 20px;
  border-radius: 999px;
  color: #fff;
  background: #171717;
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.05);
  font-size: 0.9rem;
  font-weight: 900;
}

.category-pills span:first-child {
  background: linear-gradient(180deg, #ff5d19 0%, #f0440a 100%);
  box-shadow:
    0 0 28px rgba(255, 90, 18, 0.28),
    inset 0 1px 0 rgba(255, 255, 255, 0.18);
}

.project-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: clamp(14px, 2vw, 18px);
  max-width: 1180px;
  margin-inline: auto;
}

.project-card {
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

.project-card > img {
  display: block;
  width: 100%;
  aspect-ratio: 16 / 11;
  object-fit: cover;
  background: #171717;
  filter: saturate(1.2) contrast(1.05) sepia(0.08);
  transition: transform 260ms ease;
}

.project-card:hover > img {
  transform: scale(1.04);
}

.project-card > div {
  display: grid;
  gap: 14px;
  min-height: 220px;
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
  margin: 0;
  color: #8f8f8f;
  font-size: 0.95rem;
  line-height: 1.65;
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
  display: grid;
  grid-template-columns: repeat(5, minmax(140px, 1fr));
  gap: 16px;
  max-width: 1160px;
  margin: 0;
  padding: 0;
  border: 0;
  list-style: none;
}

.process-list li {
  display: grid;
  align-content: start;
  gap: 10px;
  min-height: 150px;
  padding: 18px;
  border: 1px solid rgba(255, 255, 255, 0.09);
  border-radius: 8px;
  background:
    linear-gradient(145deg, rgba(255, 90, 18, 0.12), transparent 42%),
    #070707;
  box-shadow: 0 18px 50px rgba(0, 0, 0, 0.22);
}

.process-list span {
  display: grid;
  width: 34px;
  height: 34px;
  place-items: center;
  border-radius: 50%;
  color: #fff;
  background: linear-gradient(180deg, #ff731f, var(--color-accent));
  font-size: 0.9rem;
  font-weight: 950;
}

.process-list strong {
  color: #fff;
  font-size: 1.03rem;
  line-height: 1.25;
}

.process-list p {
  margin: 0;
  color: var(--color-muted);
  font-size: 0.86rem;
  line-height: 1.55;
}

@media (max-width: 980px) {
  .project-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .hero-service-strip {
    overflow-x: auto;
    overscroll-behavior-x: contain;
    scroll-snap-type: x proximity;
  }

  .hero-service-card {
    flex: 0 0 240px;
    min-height: 168px;
    scroll-snap-align: start;
  }

  .hero-service-card:hover,
  .hero-service-card:focus-visible {
    flex-basis: 300px;
  }

  .process-list {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }
}

@media (max-width: 720px) {
  .home-hero {
    min-height: 84vh;
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
  .hero-service-card:focus-visible {
    flex-basis: 258px;
    transform: translateY(-4px);
  }

  .hero-service-card p {
    opacity: 0.78;
    transform: none;
  }

  .intro-section,
  .craft-section {
    grid-template-columns: 1fr;
  }

  .split-heading {
    align-items: start;
    flex-direction: column;
  }

  .project-grid {
    grid-template-columns: 1fr;
  }

  .project-card > div {
    min-height: auto;
  }

  .process-list {
    grid-template-columns: 1fr;
  }

  .process-list li {
    min-height: 126px;
  }
}
</style>
