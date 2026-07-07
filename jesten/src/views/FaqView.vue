<script setup>
const faqs = [
  ['估價前需要準備什麼？', '可以先提供施工位置、尺寸、現場照片與想做的項目，方便初步判斷方向。'],
  ['是否需要到現場丈量？', '多數鐵件工程建議現場丈量，才能確認固定方式、尺寸誤差與施工限制。'],
  ['可以依照設計圖施工嗎？', '可以。若有設計圖或參考照片，可以一起討論比例、材料與可行做法。'],
  ['施工時間大約多久？', '會依照項目、尺寸與現場條件不同而調整，確認需求後會再提供較準確的時間。'],
  ['有哪些服務項目？', '不鏽鋼門窗、欄杆扶手、隱形鐵窗、採光罩、快速捲門與設計師鐵件都可以討論。'],
  ['可以只先詢問方向嗎？', '可以。先把現場照片和需求傳來，會協助判斷是否適合施作與大概需要注意的地方。'],
]
</script>

<template>
  <section class="page-hero faq-hero">
    <p class="eyebrow">FAQ</p>
    <h1>常見問題</h1>
    <p>先整理諮詢前常遇到的問題，讓你更快知道要準備哪些資訊。</p>
  </section>

  <section class="section faq-board">
    <article v-for="([question, answer], index) in faqs" :key="question" class="faq-card">
      <span>{{ String(index + 1).padStart(2, '0') }}</span>
      <h2>{{ question }}</h2>
      <p>{{ answer }}</p>
    </article>
  </section>
</template>

<style scoped>
.faq-hero {
  position: relative;
  display: grid;
  align-content: center;
  min-height: calc(100vh - 76px);
  min-height: calc(100svh - 76px);
  max-width: none;
  overflow: hidden;
  padding-block: clamp(96px, 14vw, 160px) clamp(96px, 12vw, 140px);
  border-bottom: 1px solid var(--color-line);
  background:
    radial-gradient(circle at 70% 18%, rgba(255, 90, 18, 0.32), transparent 22rem),
    linear-gradient(90deg, rgba(6, 6, 6, 0.94), rgba(6, 6, 6, 0.64) 52%, rgba(6, 6, 6, 0.42)),
    linear-gradient(0deg, rgba(6, 6, 6, 0.96), transparent 42%),
    #000;
  text-align: left;
}

.faq-hero h1,
.faq-hero p {
  position: relative;
  z-index: 1;
}

.faq-board {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 0;
  padding-block: 0;
  border-top: 1px solid var(--color-line);
  border-left: 1px solid var(--color-line);
}

.faq-card {
  min-height: 260px;
  padding: clamp(24px, 4vw, 44px);
  border-right: 1px solid var(--color-line);
  border-bottom: 1px solid var(--color-line);
  background:
    linear-gradient(135deg, rgba(255, 90, 18, 0.1), transparent 34%),
    #101010;
}

.faq-card span {
  color: #000;
  font-weight: 950;
}

.faq-card h2 {
  margin: 48px 0 12px;
  color: #fff;
  font-size: clamp(1.35rem, 2vw, 2rem);
}

.faq-card p {
  margin: 0;
}

@media (max-width: 760px) {
  .faq-board {
    grid-template-columns: 1fr;
  }
}
</style>
