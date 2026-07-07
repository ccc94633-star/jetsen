<script setup>
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import ScrollDownButton from '@/components/ScrollDownButton.vue'
import contactCanopyHero from '@/assets/images/products-pc/01-canopy/line_album_作品集_260702_11.webp'
import contactRailingHero from '@/assets/images/products-pc/02-railings-handrails/line_album_作品集_260702_34.webp'
import contactDesignerHero from '@/assets/images/products-pc/03-designer-metalwork/3d652361-fd2e-4231-b254-e078c01d4f7e.webp'
import contactInvisibleHero from '@/assets/images/products-pc/04-invisible-grilles/img_20210506_112033.webp'

const heroImages = [contactCanopyHero, contactRailingHero, contactDesignerHero, contactInvisibleHero]
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

const contactDetails = [
  ['電話', '0981-185728'],
  ['傳真', '04 2277-7868'],
  ['地址', '台中市太平區長龍路二段626號'],
]

const requirements = ['施工項目', '現場照片', '大約尺寸', '施工地點', '希望完工時間']
const phoneHref = 'tel:0981185728'
const lineHref = 'https://line.me/R/ti/p/@jetsen'
const mapQuery = '杰森鐵作 台中市太平區長龍路二段626號'
const mapEmbedUrl = `https://www.google.com/maps?q=${encodeURIComponent(mapQuery)}&output=embed`
const mapOpenUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(mapQuery)}`

const faqs = [
  [
    '估價前需要準備什麼？',
    '建議先提供現場照片、約略尺寸、施工地點與想製作的項目，能更快判斷做法與預算範圍。',
  ],
  [
    '可以到現場丈量嗎？',
    '可以，確認需求後可安排現場丈量與討論細節，依案場位置與工程內容安排時間。',
  ],
  [
    '鐵件可以客製化嗎？',
    '可以依照空間、尺寸、用途與風格客製，包含遮雨棚、欄杆扶手、造型鐵件與隱形鐵窗等。',
  ],
  [
    '施工時間大約多久？',
    '會依工程規模、材料、現場條件與排程而不同，確認圖面與尺寸後會提供較準確的時間。',
  ],
  [
    '服務範圍在哪裡？',
    '主要服務台中與周邊地區，其他縣市可先來電討論工程內容與可配合方式。',
  ],
  [
    '需要先付訂金嗎？',
    '確認報價、尺寸與施工內容後，通常會依工程狀況收取訂金並安排製作與施工。',
  ],
]
</script>

<template>
  <section class="contact-hero">
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
    <p class="eyebrow">Contact</p>
    <h1>
      準備<span>打造</span>
      <span>你的專屬鐵件了嗎？</span>
    </h1>
    </div>
    <ScrollDownButton />
  </section>

  <section class="section contact-prep">
      <p class="eyebrow">Before Contact</p>
      <h2 class="prep-title">聯絡前建議先準備</h2>
      <h2>聯絡前建議先準備</h2>
      <p>先提供現場照片、尺寸、地點與想做的項目，可以更快評估。</p>
      <ul>
        <li v-for="item in requirements" :key="item">{{ item }}</li>
      </ul>
  </section>

  <section class="section contact-faq">
    <div class="faq-title">
      <p class="eyebrow">FAQ</p>
      <h2>常見問題</h2>
    </div>

    <div class="faq-board">
      <details v-for="([question, answer], index) in faqs" :key="question" class="faq-item-row">
        <summary>
          <span>{{ String(index + 1).padStart(2, '0') }}</span>
          <strong>{{ question }}</strong>
        </summary>
        <p>{{ answer }}</p>
      </details>
    </div>
  </section>

  <section class="section contact-prep" hidden>
    <div class="contact-copy">
      <p class="eyebrow">Before Contact</p>
      <h2>聯絡前建議先準備</h2>
    </div>

    <div class="contact-prep-list">
      <p class="prep-note">先提供現場照片、尺寸、地點與想做的項目，可以更快評估。</p>
      <p>先提供現場照片、尺寸、地點與想做的項目，可以更快評估。</p>
      <ul>
        <li v-for="item in requirements" :key="item">{{ item }}</li>
      </ul>
    </div>
  </section>

  <section class="contact-info-section">
    <div class="contact-copy">
      <p class="eyebrow">Get In Touch</p>
      <h2>聯絡杰森鐵作</h2>
      <p>
       歡迎使用官方 LINE 傳照片與尺寸，或者直接來電討論。
      </p>
      <div class="contact-actions">
        <a class="primary-link" :href="lineHref" target="_blank" rel="noreferrer">官方 LINE</a>
        <a class="secondary-link" :href="phoneHref">立即撥打電話</a>
      </div>
    </div>

    <div class="contact-info-strip" aria-label="聯絡資訊">
      <div v-for="[label, value] in contactDetails" :key="label">
        <span>{{ label }}</span>
        <strong>{{ value }}</strong>
      </div>
    </div>
  </section>

  <section class="map-section">
    <div class="map-copy">
      <p class="eyebrow">Location</p>
      <h2>杰森鐵作 Google 地圖</h2>
      <p>地址位於台中市太平區長龍路二段626號，可先開啟 Google 地圖確認路線與距離。</p>
      <a class="primary-link" :href="mapOpenUrl" target="_blank" rel="noreferrer">開啟 Google 地圖</a>
    </div>

    <div class="map-frame">
      <iframe
        :src="mapEmbedUrl"
        title="杰森鐵作 Google 地圖"
        loading="lazy"
        referrerpolicy="no-referrer-when-downgrade"
        allowfullscreen
      ></iframe>
    </div>
  </section>
</template>

<style scoped>
.contact-hero {
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

.contact-hero::after {
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
  filter: saturate(1.05) contrast(1.08) brightness(0.68);
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

.contact-hero h1 {
  margin: 0;
  color: #fff;
  font-size: clamp(3rem, 7.7vw, 7.2rem);
  font-weight: 950;
  line-height: 0.94;
  letter-spacing: 0;
}

.contact-hero h1 span {
  display: block;
}

.contact-hero h1 span:first-child {
  display: inline;
}

.contact-prep {
  display: grid;
  grid-template-columns: minmax(280px, 1fr) minmax(320px, 0.8fr);
  gap: clamp(24px, 4vw, 48px);
  align-items: center;
  border-block: 1px solid var(--color-line);
  background:
    radial-gradient(circle at 15% 100%, rgba(255, 90, 18, 0.18), transparent 22rem),
    rgba(255, 255, 255, 0.02);
}

.contact-prep[hidden] {
  display: none;
}

.contact-prep > h2:not(.prep-title) {
  display: none;
}

.contact-prep-list {
  display: grid;
  justify-self: center;
  width: min(100%, 560px);
}

.contact-prep-list p {
  max-width: 540px;
  margin: 0;
  color: var(--color-muted);
  font-size: 1.04rem;
  line-height: 1.8;
}

.contact-prep-list p:not(.prep-note) {
  display: none;
}

.contact-prep ul {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin: 12px 0 0;
  padding: 0;
  list-style: none;
}

.contact-prep li {
  padding: 8px 12px;
  border: 1px solid var(--color-line);
  border-radius: 999px;
  color: #f8f8f4;
  background: var(--color-panel);
  font-weight: 800;
}

.contact-faq {
  padding-block: clamp(58px, 8vw, 102px);
  background:
    radial-gradient(circle at 0 45%, rgba(255, 90, 18, 0.12), transparent 18rem),
    transparent;
}

.faq-title {
  margin-bottom: clamp(22px, 4vw, 42px);
}

.faq-title h2 {
  max-width: 620px;
  margin: 0;
  color: #fff;
  font-size: clamp(2.2rem, 5.5vw, 5.5rem);
  line-height: 0.98;
  letter-spacing: 0;
}

.faq-board {
  display: grid;
  gap: 11px;
}

.faq-item-row {
  overflow: hidden;
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 18px;
  background:
    radial-gradient(circle at 7% 52%, rgba(255, 113, 26, 0.82), rgba(255, 90, 18, 0.34) 18%, transparent 43%),
    linear-gradient(100deg, rgba(255, 90, 18, 0.42) 0%, rgba(255, 90, 18, 0.16) 24%, rgba(255, 255, 255, 0.035) 54%, rgba(255, 255, 255, 0.02) 100%),
    #100b0a;
  box-shadow:
    inset 0 0 30px rgba(255, 90, 18, 0.11),
    0 16px 34px rgba(0, 0, 0, 0.22);
}

.faq-item-row:nth-child(2n) {
  background:
    radial-gradient(circle at 12% 44%, rgba(255, 126, 34, 0.72), rgba(255, 90, 18, 0.28) 17%, transparent 42%),
    linear-gradient(100deg, rgba(255, 90, 18, 0.34) 0%, rgba(255, 90, 18, 0.13) 28%, rgba(255, 255, 255, 0.035) 56%, rgba(255, 255, 255, 0.02) 100%),
    #100b0a;
}

.faq-item-row:nth-child(3n) {
  background:
    radial-gradient(circle at 5% 66%, rgba(255, 113, 26, 0.78), rgba(255, 90, 18, 0.3) 18%, transparent 44%),
    linear-gradient(100deg, rgba(255, 90, 18, 0.38) 0%, rgba(255, 90, 18, 0.14) 27%, rgba(255, 255, 255, 0.035) 56%, rgba(255, 255, 255, 0.02) 100%),
    #100b0a;
}

.faq-item-row[open] {
  background:
    radial-gradient(circle at 8% 42%, rgba(255, 128, 36, 0.9), rgba(255, 90, 18, 0.38) 21%, transparent 48%),
    linear-gradient(100deg, rgba(255, 90, 18, 0.5) 0%, rgba(255, 90, 18, 0.17) 30%, rgba(255, 255, 255, 0.045) 58%, rgba(255, 255, 255, 0.02) 100%),
    #100b0a;
}

.faq-item-row summary {
  position: relative;
  display: grid;
  grid-template-columns: 34px 1fr 35px;
  align-items: center;
  gap: 14px;
  min-height: 70px;
  padding: 18px clamp(14px, 3.2vw, 27px);
  color: #fff;
  cursor: pointer;
  list-style: none;
}

.faq-item-row summary::-webkit-details-marker {
  display: none;
}

.faq-item-row summary::after {
  justify-self: end;
  color: var(--color-accent);
  content: '+';
  font-size: 1.6rem;
  font-weight: 300;
}

.faq-item-row[open] summary::after {
  content: '-';
}

.faq-item-row summary span {
  color: #ffffff;
  font-size: 0.62rem;
  font-weight: 950;
}

.faq-item-row summary strong {
  font-size: clamp(0.8rem, 1.44vw, 1.04rem);
  font-weight: 900;
  line-height: 1.35;
}

.faq-item-row p {
  max-width: 760px;
  margin: -3px 62px 21px;
  color: #deded4;
  font-size: 0.8rem;
  line-height: 1.8;
}

.contact-info-section {
  display: grid;
  grid-template-columns: minmax(280px, 1fr) minmax(280px, 450px);
  align-items: center;
  gap: clamp(16px, 2.2vw, 24px);
  padding: clamp(42px, 7vw, 78px) clamp(16px, 4vw, 54px);
  border-block: 8px solid #2a2a2a;
  background: #111;
}

.contact-copy h2 {
  max-width: 620px;
  margin: 0;
  color: #fff;
  font-size: clamp(2.2rem, 5.5vw, 5.5rem);
  line-height: 0.98;
}

.contact-copy p:not(.eyebrow) {
  max-width: 540px;
  margin: 20px 0 0;
  color: var(--color-muted);
  font-size: 1.04rem;
  line-height: 1.8;
}

.contact-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  margin-top: 10px;
}

.contact-info-strip {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 8px;
  justify-self: end;
  width: min(100%, 450px);
  border: 0;
}

.contact-info-strip div {
  position: relative;
  display: grid;
  overflow: hidden;
  align-content: center;
  gap: 6px;
  min-height: clamp(72px, 7vw, 86px);
  padding: clamp(12px, 1.6vw, 16px);
  border: 2px solid rgba(255, 255, 255, 0.48);
  border-radius: 8px;
  background: #111;
  box-shadow: inset 0 0 0 1px rgba(0, 0, 0, 0.42);
  transition:
    background 0.25s ease,
    border-color 0.25s ease;
}

.contact-info-strip:not(:hover) div:nth-child(1),
.contact-info-strip div:hover {
  border-color: rgba(255, 92, 18, 0.72);
  background:
    radial-gradient(circle at 69% 48%, rgba(255, 112, 28, 0.22), transparent 34%),
    #bb3f03;
}

.contact-info-strip div:nth-child(3) {
  grid-column: span 2;
}

.contact-info-strip div:nth-child(4) {
  border-color: rgba(255, 255, 255, 0.78);
  background: #f4f4f1;
}

.contact-info-strip span {
  position: relative;
  z-index: 1;
  color: #f8f8f4;
  font-size: clamp(0.98rem, 1.4vw, 1.42rem);
  font-weight: 950;
  line-height: 1;
  text-transform: none;
}

.contact-info-strip strong {
  position: relative;
  z-index: 1;
  max-width: 100%;
  color: rgba(255, 255, 255, 0.84);
  font-size: clamp(0.66rem, 1vw, 0.78rem);
  line-height: 1.35;
}

.contact-info-strip div:nth-child(4) span {
  color: #111;
}

.contact-info-strip div:nth-child(4) strong {
  color: rgba(17, 17, 17, 0.68);
}

.map-section {
  display: grid;
  grid-template-columns: minmax(280px, 1fr) minmax(280px, 0.7fr);
  gap: 24px;
  padding: 54px clamp(20px, 5vw, 72px) 42px;
  border-bottom: 1px solid var(--color-line);
}

.map-copy {
  display: grid;
  align-content: center;
  padding: clamp(28px, 4vw, 48px);
  border: 1px solid var(--color-line);
  background:
    radial-gradient(circle at 0 0, rgba(255, 90, 18, 0.16), transparent 18rem),
    #0f0f0f;
}

.map-copy h2 {
  margin: 0;
  color: #fff;
  font-size: clamp(1.8rem, 3.2vw, 3rem);
}

.map-copy p {
  max-width: 520px;
  color: var(--color-muted);
  line-height: 1.8;
}

.map-frame {
  min-height: 260px;
  border: 1px solid var(--color-line);
  background: #101010;
}

.map-frame iframe {
  display: block;
  width: 100%;
  height: 100%;
  min-height: 260px;
  border: 0;
}

@media (max-width: 900px) {
  .contact-info-section,
  .map-section {
    grid-template-columns: 1fr;
  }

  .contact-hero {
    min-height: 84vh;
    place-items: center start;
  }

  .contact-hero::after {
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

  .contact-prep {
    grid-template-columns: 1fr;
  }

  .contact-prep > .eyebrow,
  .contact-prep h2,
  .contact-prep p:not(.eyebrow),
  .contact-prep ul {
    grid-column: 1;
    grid-row: auto;
  }

  .map-copy {
    border: 1px solid var(--color-line);
  }

  .map-frame,
  .map-frame iframe {
    min-height: 180px;
  }
}

@media (max-width: 680px) {
  .contact-hero {
    min-height: calc(100vh - 126px);
    min-height: calc(100svh - 126px);
    padding-block: clamp(48px, 11vw, 72px);
  }

  .contact-hero h1 {
    font-size: clamp(2.7rem, 6.9vw, 6.48rem);
    line-height: 1.12;
  }

  .contact-info-strip {
    grid-template-columns: 1fr;
  }

  .contact-info-strip div {
    width: 90%;
    min-height: 90px;
    justify-self: center;
  }

  .contact-info-strip div:nth-child(3) {
    grid-column: span 1;
  }

  .contact-info-strip span {
    font-size: 1.05rem;
  }

  .contact-info-strip strong {
    max-width: 82%;
    font-size: 0.82rem;
  }

  .faq-item-row summary {
    grid-template-columns: 27px 1fr 22px;
    gap: 10px;
    min-height: 62px;
  }

  .faq-item-row p {
    margin: -2px 19px 19px;
  }
}
</style>
