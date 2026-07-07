<script setup>
import { RouterLink } from 'vue-router'

const services = ['不鏽鋼門窗', '欄杆扶手', '隱形鐵窗', '採光罩', '快速捲門', '設計師鐵件', '打造你的專屬鐵件']
</script>

<template>
  <footer class="site-footer">
    <span class="footer-watermark" aria-hidden="true">JETSEN</span>

    <div class="footer-services" aria-label="服務項目">
      <span v-for="service in services" :key="service">{{ service }}</span>
    </div>

    <div class="footer-brand">
      <p class="footer-logo">JETSEN</p>
      <p>杰森鐵作</p>
      <RouterLink class="footer-link" to="/contact">聯絡諮詢</RouterLink>
    </div>

    <address class="footer-contact">
      <span>陳凱翔</span>
      <a href="tel:0981185728">0981-185728</a>
      <span>傳真：04 2277-7868</span>
      <span>統編：91124640</span>
      <span>台中市太平區長龍路二段626號</span>
    </address>


  </footer>
</template>
