<script setup>
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import { RouterLink } from 'vue-router'
import FloatingContactButtons from '@/components/FloatingContactButtons.vue'
import founderImage from '@/assets/images/founder/founder.jpg'
import storyCanopyHero from '@/assets/images/products-pc/01-canopy/line_album_作品集_260702_12.webp'
import storyRailingHero from '@/assets/images/products-pc/02-railings-handrails/line_album_作品集_260702_43.webp'
import storyDesignerHero from '@/assets/images/products-pc/03-designer-metalwork/41a89b6d-c0a2-481d-894d-a8df633cc14e.webp'
import storyInvisibleHero from '@/assets/images/products-pc/04-invisible-grilles/img_20210519_102438.webp'

const heroImages = [
  storyCanopyHero,
  storyRailingHero,
  storyDesignerHero,
  storyInvisibleHero,
]

const activeHeroImageIndex = ref(0)
const activeHeroImage = computed(() => heroImages[activeHeroImageIndex.value])
let heroInterval

onMounted(() => {
  if (heroImages.length <= 1) return

  heroInterval = window.setInterval(() => {
    activeHeroImageIndex.value = (activeHeroImageIndex.value + 1) % heroImages.length
  }, 3600)
})

onBeforeUnmount(() => {
  window.clearInterval(heroInterval)
})

const founderPrinciples = [
  {
    title: '先聽懂空間',
    text: '真正的工藝始於溝通。施工前反覆確認尺寸、結構、動線與設計意圖，讓鐵件自然融入空間。',
  },
  {
    title: '把基本做到深',
    text: '從材料厚度、焊接補強到拋光收邊，每一道工序都回到安全、耐用與長期使用的穩定度。',
  },
  {
    title: '作品由自己負責',
    text: '不以案子大小區分用心程度。每件從廠區出去的成品，都代表杰森鐵作對品質的承諾。',
  },
]

const storyMilestones = [
  {
    title: '從家族鐵工廠扎根',
    text: '創辦人累積扎實西工底子，也看見傳統加工需要更貼近空間與人的使用感受。',
  },
  {
    title: '疫情期間創立杰森鐵作',
    text: '帶著對作品完全負責的信念，在資源有限的時候踏出創業第一步。',
  },
  {
    title: '從各式小工程磨出底氣',
    text: '雞舍搭建、微型修繕、低利潤案場都親自做，讓現場經驗成為最穩的養分。',
  },
  {
    title: '走向空間鐵作美學',
    text: '與設計師、業主協作，把傳統黑手技術轉化為現代空間需要的精準與溫度。',
  },
]
</script>

<template>
  <section class="story-hero" aria-label="JETSEN founder story">
    <div v-if="heroImages.length" class="hero-image" aria-hidden="true">
      <img
        v-for="(image, index) in heroImages"
        :key="image"
        :src="image"
        :class="{ 'is-active': image === activeHeroImage && index === activeHeroImageIndex }"
        alt=""
      />
    </div>

    <div class="hero-founder">
      <div class="hero-copy">
        <p class="eyebrow">Founder Story</p>
        <h1>傳承西工硬底子，走出有溫度的鐵作美學。</h1>
        <p>
          杰森鐵作源自傳統鐵工的淬鍊，也來自創辦人對制式加工的反思。鐵件不該只是完成尺寸，更要與空間對話，承載使用者對安全、質感與生活的期待。
        </p>
        <div class="hero-actions">
          <RouterLink class="primary-link" to="/contact">聯絡諮詢</RouterLink>
          <RouterLink class="secondary-link" to="/works">查看作品</RouterLink>
        </div>
      </div>

    </div>
    <FloatingContactButtons />
  </section>

  <section class="section founder-section">
    <div class="founder-intro">
      <div>
        <p class="eyebrow">Point of View</p>
        <h2>把冷冰冰的金屬，做成能被信任的作品。</h2>
      </div>
      <p>
        創業初期，杰森鐵作從深山雞舍到各式鐵工修繕都全力以赴。那些看似粗重、零散的案場，磨出了面對現場的判斷力，也讓我們更確定：沒有小案子，只有值得被好好完成的作品。
      </p>
    </div>

    <div class="founder-profile">
      <article class="profile-copy">
        <span class="story-tag">Craft Belief</span>
        <h3>真正的工藝，不只在手上，也在溝通裡。</h3>
        <p>
          精準尺寸與結構安全是基本。杰森鐵作更重視動工前的討論，從設計比例、材質語彙到收邊細節都逐一確認，讓採光罩、欄杆扶手、不鏽鋼門窗與客製鐵件，都能貼合現場，也貼近人的日常。
        </p>
      </article>

      <article class="profile-card">
        <img :src="founderImage" alt="JETSEN 創辦人" loading="lazy" />
      </article>
    </div>
  </section>

  <section class="section principle-section">
    <div class="section-heading split-heading">
      <div>
        <p class="eyebrow">Founder Principles</p>
        <h2>三個放在前面的堅持</h2>
      </div>

    </div>

    <div class="principle-grid">
      <article
        v-for="(principle, index) in founderPrinciples"
        :key="principle.title"
        class="principle-card"
      >
        <span class="principle-number" aria-hidden="true">{{ index + 1 }}</span>
        <h3>{{ principle.title }}</h3>
        <p>{{ principle.text }}</p>
      </article>
    </div>
  </section>

  <section class="section story-timeline">
    <div>
      <p class="eyebrow">Path</p>
      <h2>從基層扎根，到設計協作。</h2>
      <p>
        五年多來，創辦人仍堅持親自思考細節並參與完工。每一道焊道、每一次拋光，都是對品質負責，也是對鐵作工藝的尊重。
      </p>
    </div>

    <ol class="timeline-list">
      <li v-for="(item, index) in storyMilestones" :key="item.title">
        <span>{{ String(index + 1).padStart(2, '0') }}</span>
        <strong>{{ item.title }}</strong>
        <p>{{ item.text }}</p>
      </li>
    </ol>
  </section>

  <section class="section story-summary">
    <div class="section-heading">
      <p class="eyebrow">FORGED BY EXPERIENCE</p>
      <h2>「走過什麼都接的歲月，杰森鐵作換來的，是把每件作品都當成承諾的實力。」</h2>
    </div>
  </section>
</template>

<style scoped>
.story-hero {
  position: relative;
  display: grid;
  min-height: calc(100vh - 76px);
  min-height: calc(100svh - 76px);
  overflow: hidden;
  padding: clamp(96px, 12vw, 150px) clamp(20px, 5vw, 72px) clamp(72px, 10vw, 116px);
  border-bottom: 1px solid var(--color-line);
  background: #000;
}

.story-hero::after {
  position: absolute;
  inset: 0;
  background:
    radial-gradient(circle at 74% 26%, rgba(255, 90, 18, 0.3), transparent 22rem),
    linear-gradient(90deg, rgba(5, 5, 5, 0.96), rgba(5, 5, 5, 0.7) 54%, rgba(5, 5, 5, 0.52)),
    linear-gradient(0deg, rgba(5, 5, 5, 0.98), transparent 44%);
  content: '';
}

.hero-image {
  position: absolute;
  inset: 0;
  opacity: 0.72;
}

.hero-image img {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  opacity: 0;
  filter: saturate(1.08) contrast(1.08) brightness(0.62);
  transition:
    opacity 900ms ease,
    transform 4200ms ease;
  transform: scale(1.02);
}

.hero-image img.is-active {
  opacity: 1;
  transform: scale(1.08);
}

.hero-founder {
  position: relative;
  z-index: 1;
  display: grid;
  align-items: center;
  width: min(100%, 960px);
}

.hero-copy {
  display: grid;
  justify-items: start;
}

.story-hero h1 {
  max-width: 920px;
  margin: 0;
  color: #fff;
  font-size: clamp(3rem, 7.2vw, 6.9rem);
  font-weight: 950;
  line-height: 0.94;
  letter-spacing: 0;
}

.story-hero p:not(.eyebrow) {
  max-width: 700px;
  margin: 24px 0 0;
  color: #e3e0d8;
  font-size: 1.06rem;
  line-height: 1.85;
}

.hero-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  margin-top: 12px;
}

.founder-section,
.principle-section,
.story-timeline,
.story-summary {
  background: #000;
}

.founder-intro {
  display: grid;
  grid-template-columns: minmax(280px, 0.9fr) minmax(280px, 1fr);
  gap: 32px;
  align-items: start;
  margin-bottom: clamp(34px, 5vw, 58px);
}

.founder-intro h2,
.story-timeline h2 {
  max-width: 760px;
}

.founder-intro p {
  margin: 0;
}

.founder-profile {
  display: grid;
  grid-template-columns: minmax(280px, 1fr) minmax(280px, 0.84fr);
  gap: clamp(14px, 2vw, 18px);
  max-width: 1180px;
  margin-inline: auto;
}

.profile-copy,
.profile-card,
.principle-card,
.timeline-list li {
  overflow: hidden;
  border: 1px solid rgba(255, 255, 255, 0.07);
  border-radius: 8px;
  background:
    linear-gradient(145deg, rgba(255, 90, 18, 0.1), transparent 42%),
    #111;
  box-shadow: 0 18px 44px rgba(0, 0, 0, 0.34);
}

.profile-copy {
  display: grid;
  align-content: center;
  gap: 16px;
  min-height: 330px;
  padding: clamp(26px, 4vw, 44px);
}

.profile-copy h3,
.principle-card h3 {
  margin: 0;
  color: #fff;
  font-size: clamp(1.55rem, 2.7vw, 2.35rem);
  line-height: 1.08;
}

.profile-copy p,
.principle-card p,
.timeline-list p {
  margin: 0;
  color: #a9a9a0;
  font-size: 0.95rem;
  line-height: 1.7;
}

.profile-card {
  display: grid;
  min-height: 330px;
  padding: 0;
  background: #151515;
}

.profile-card img {
  display: block;
  width: 100%;
  height: 100%;
  min-height: 330px;
  object-fit: cover;
  filter: saturate(1.1) contrast(1.06) sepia(0.08);
}

.split-heading {
  display: flex;
  gap: 24px;
  align-items: end;
  justify-content: space-between;
}

.split-heading p:not(.eyebrow) {
  max-width: 460px;
  margin: 0;
  font-size: 0.95rem;
}

.principle-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: clamp(14px, 2vw, 18px);
  max-width: 1180px;
  margin-inline: auto;
}

.principle-card {
  position: relative;
  isolation: isolate;
  display: grid;
  align-content: start;
  gap: 14px;
  min-height: 240px;
  padding: 20px;
  transition:
    transform 180ms ease,
    border-color 180ms ease,
    box-shadow 180ms ease;
}

.principle-card h3,
.principle-card p {
  position: relative;
  z-index: 1;
}

.principle-number {
  position: absolute;
  right: 0;
  bottom: 0;
  z-index: -1;
  color: rgba(255, 107, 50, 0.18);
  font-size: clamp(8rem, 14vw, 12rem);
  font-weight: 950;
  line-height: 0.8;
  pointer-events: none;
  user-select: none;
}

.principle-card:hover {
  border-color: rgba(255, 90, 18, 0.36);
  box-shadow:
    0 26px 64px rgba(0, 0, 0, 0.42),
    0 0 32px rgba(255, 90, 18, 0.1);
  transform: translateY(-4px);
}

.story-tag {
  width: fit-content;
  padding: 7px 11px;
  border-radius: 999px;
  color: #ff6b32;
  background: #4a2114;
  font-size: 0.75rem;
  font-weight: 950;
}

.story-timeline {
  display: grid;
  grid-template-columns: minmax(280px, 0.8fr) minmax(320px, 1.2fr);
  gap: 36px;
  align-items: start;
  border-block: 1px solid var(--color-line);
}

.story-timeline > div p:not(.eyebrow) {
  margin-bottom: 0;
}

.story-summary .section-heading {
  width: 100%;
}

.timeline-list {
  display: grid;
  gap: 12px;
  margin: 0;
  padding: 0;
  list-style: none;
}

.timeline-list li {
  display: grid;
  grid-template-columns: 48px minmax(0, 1fr);
  gap: 8px 16px;
  align-items: start;
  min-height: 104px;
  padding: 18px;
}

.timeline-list span {
  display: grid;
  width: 42px;
  height: 42px;
  grid-row: span 2;
  place-items: center;
  border-radius: 50%;
  color: #fff;
  background: linear-gradient(180deg, #ff731f, var(--color-accent));
  font-size: 0.85rem;
  font-weight: 950;
}

.timeline-list strong {
  color: #fff;
  font-size: 1.08rem;
  line-height: 1.3;
}

@media (max-width: 980px) {
  .hero-founder,
  .founder-intro,
  .founder-profile,
  .story-timeline {
    grid-template-columns: 1fr;
  }

  .principle-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 720px) {
  .story-hero {
    min-height: auto;
    padding-top: 84px;
  }

  .story-hero h1 {
    font-size: clamp(2.7rem, 6.48vw, 6.21rem);
    line-height: 1.12;
  }

  .story-hero::after {
    background:
      radial-gradient(circle at 74% 26%, rgba(255, 90, 18, 0.26), transparent 18rem),
      linear-gradient(90deg, rgba(5, 5, 5, 0.94), rgba(5, 5, 5, 0.72) 58%, rgba(5, 5, 5, 0.58)),
      linear-gradient(0deg, rgba(5, 5, 5, 0.98), transparent 44%);
  }

  .hero-image {
    opacity: 0.56;
  }

  .split-heading {
    align-items: start;
    flex-direction: column;
  }

  .principle-grid {
    grid-template-columns: 1fr;
  }

  .principle-card,
  .profile-copy,
  .profile-card {
    min-height: auto;
  }
}
</style>
