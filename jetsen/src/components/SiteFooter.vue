<script setup>
import { RouterLink } from 'vue-router'
import footerBackground from '@/assets/images/brand/jetsen-og-background.jpg'
import footerLogo from '@/assets/images/brand/jetsen-wordmark-orange-transparent-with-cn.png'
import footerSideLogo from '@/assets/images/brand/jetsen-wordmark-white.png'
import footerWatermark from '@/assets/images/brand/jetsen-wordmark-white.png'

const services = ['採光罩', '防火門', '各式門窗', '欄杆扶手', '隱形鐵窗', '設計師鐵件', '打造你的專屬鐵件']
</script>

<template>
  <footer class="site-footer">
    <img class="footer-background-logo" :src="footerBackground" alt="" aria-hidden="true" />
    <img class="footer-watermark" :src="footerWatermark" alt="" aria-hidden="true" />
    <img class="footer-watermark-side" :src="footerSideLogo" alt="" aria-hidden="true" />

    <div class="footer-services" aria-label="服務項目">
      <span v-for="service in services" :key="service">{{ service }}</span>
    </div>

    <div class="footer-brand">
      <img class="footer-logo" :src="footerLogo" alt="JETSEN" />
      <RouterLink class="footer-link" to="/contact">打造你的專屬鐵件</RouterLink>
    </div>

    <address class="footer-contact">
      <div class="footer-phonefax">
        <span class="footer-person">聯絡人：陳凱翔</span>
        <a class="footer-line" href="https://line.me/R/ti/p/@485quazl" target="_blank" rel="noreferrer">官方 LINE</a>
        <a class="footer-phone" href="tel:0981185728">電話：0981-185728</a>
        <span class="footer-fax">傳真：04-2277-7868</span>
        <span class="footer-address">台中市太平區長龍路二段626號</span>
      </div>
    </address>


  </footer>
</template>

<style scoped>
.site-footer {
  position: relative;
  display: grid;
  grid-template-columns: minmax(150px, 1fr) minmax(260px, 1.25fr) minmax(240px, 1fr);
  align-items: start;
  gap: 24px;
  overflow: hidden;
  padding: 54px clamp(20px, 5vw, 72px) 42px;
  border-top: 1px solid var(--color-line);
  color: #f8f8f4;
  background:
    radial-gradient(ellipse at 48% 118%, rgba(255, 90, 18, 0.16), transparent 34rem),
    linear-gradient(90deg, rgba(4, 4, 4, 0.96), rgba(22, 8, 4, 0.94) 52%, rgba(5, 5, 5, 0.98)),
    #050505;
}

.footer-watermark {
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

.footer-background-logo {
  display: none;
}

.footer-watermark-side {
  display: none;
  position: absolute;
  z-index: 0;
  pointer-events: none;
  filter: grayscale(1);
}

.site-footer::after {
  position: absolute;
  inset: 0;
  z-index: 0;
  background: linear-gradient(90deg, rgba(5, 5, 5, 0.9), rgba(10, 5, 3, 0.72) 48%, rgba(5, 5, 5, 0.92));
  content: '';
  pointer-events: none;
}

.footer-brand,
.footer-contact,
.footer-services,
.footer-link {
  position: relative;
  z-index: 2;
}

.site-footer p,
.site-footer address {
  margin: 0;
}

.footer-logo {
  display: block;
  width: min(38vw, 300px);
  height: auto;
}

.footer-brand {
  display: grid;
  grid-column: 2;
  grid-row: 1 / span 2;
  gap: 6px;
  align-self: center;
  justify-items: center;
  justify-self: center;
  text-align: center;
}

.footer-contact {
  display: grid;
  grid-column: 3;
  gap: 6px;
  align-self: center;
  justify-self: end;
  color: #d6d6ce;
  font-style: normal;
  line-height: 1.6;
  text-align: left;
  transform: translateX(25px);
}

.footer-phonefax {
  display: flex;
  flex-direction: column;
  gap: 6px;
  justify-self: end;
  text-align: left;
}

.footer-services {
  display: grid;
  grid-template-columns: repeat(2, max-content);
  grid-column: 1;
  grid-row: 1 / span 2;
  gap: 10px 8px;
  align-items: flex-start;
  justify-self: start;
  text-align: left;
  transform: translateX(-25px);
}

.footer-services span {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 7px 10px;
  border: 1px solid var(--color-line);
  color: #ecece6;
  background: rgba(255, 255, 255, 0.035);
  font-weight: 800;
  text-align: center;
}

.footer-services span:last-child {
  grid-column: 1 / -1;
  justify-self: stretch;
  text-align: center;
}

.site-footer a {
  font-weight: 900;
}

.footer-link {
  display: none;
}

@media (max-width: 900px) {
  .site-footer {
    grid-template-columns: 1fr 1fr;
  }

  .footer-services {
    grid-column: 1;
    grid-row: auto;
    transform: translateX(-25px);
  }

  .footer-brand {
    grid-column: 2;
    grid-row: auto;
  }

  .footer-contact {
    grid-column: 1 / -1;
    justify-self: end;
    text-align: left;
    transform: translateX(25px);
  }
}

@media (max-width: 720px) {
  .site-footer {
    grid-template-columns: 1fr;
    grid-template-rows: 1fr auto;
    gap: 28px;
    align-items: flex-start;
    min-height: clamp(420px, 102vw, 520px);
    padding: 42px clamp(24px, 5.5vw, 38px) 18px;
    background:
      linear-gradient(90deg, rgba(49, 15, 6, 0.95), rgba(76, 25, 10, 0.92) 58%, rgba(49, 15, 6, 0.96)),
      linear-gradient(145deg, rgba(18, 9, 6, 0.96), rgba(5, 5, 5, 0.98));
  }

  .footer-watermark {
    display: none;
  }

  .footer-watermark-side {
    display: block;
    top: 48%;
    width: clamp(360px, 96vw, 520px);
    right: calc(5px - (clamp(360px, 96vw, 520px) / 2));
    height: auto;
    max-width: none;
    opacity: 0.58;
    filter: grayscale(1) invert(1) brightness(0.86) contrast(0.82);
    transform: translateY(-50%) rotate(90deg);
    transform-origin: center;
  }

  .footer-background-logo {
    display: none;
  }

  .footer-contact,
  .footer-services,
  .footer-brand,
  .footer-link {
    grid-column: auto;
    transform: none;
    
  }

  .footer-services {
    display: none;
  }

  .footer-brand {
    width: 100%;
    grid-row: auto;
    align-self: center;
    justify-self: center;
    gap: 5px;
    text-align: center;
  }

  .footer-logo {
    width: min(66.6vw, 252px);
  }

  .footer-link {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    box-sizing: border-box;
    width: 180px;
    max-width: 60%;
    min-height: 30px;
    margin-top: 5px;
    padding: 6px 9px;
    border: 1px solid rgba(137, 78, 58, 0.72);
    color: #fff;
    background: rgba(60, 24, 14, 0.72);
    font-size: 0.9rem;
    font-weight: 950;
    line-height: 1.2;
    text-decoration: none;
    text-shadow: 0 2px 8px rgba(0, 0, 0, 0.42);
  }

  .footer-link:hover,
  .footer-link:focus-visible {
    border-color: rgba(255, 90, 18, 0.82);
    color: #fff;
    background: rgba(104, 38, 18, 0.88);
    transform: translateY(-2px);
  }

  .footer-contact {
    width: 100%;
    display: grid;
    grid-template-columns: 1fr;
    gap: 8px;
    align-self: end;
    align-items: end;
    justify-self: end;
    color: #fff;
    font-size: clamp(0.9rem, 3vw, 1.55rem);
    line-height: 1.2;
    text-align: left;
  }

  .footer-phonefax {
    display: grid;
    grid-template-columns: minmax(0, 1fr) max-content;
    gap: 6px 18px;
    align-items: end;
    justify-self: stretch;
    width: 100%;
  }

  .footer-person {
    grid-column: 1;
    grid-row: 1;
    align-self: end;
    justify-self: start;
  }

  .footer-address {
    grid-column: 1;
    grid-row: 3;
    align-self: start;
    justify-self: start;
  }

  .footer-phone,
  .footer-fax {
    grid-column: 2;
    justify-self: start;
  }

  .footer-line {
    grid-column: 1;
    grid-row: 2;
    justify-self: start;
  }

  .footer-phone {
    grid-row: 2;
  }

  .footer-fax {
    grid-row: 3;
  }

  .footer-phonefax span {
    font-size: clamp(0.825rem, 2.86vw, 1.43rem);
    white-space: nowrap;
  }

  .footer-phonefax .footer-person,
  .footer-contact a {
    font-size: clamp(0.825rem, 2.86vw, 1.43rem);
  }

  .footer-contact a {
    color: #fff;
    font-weight: 400;
    text-decoration: underline;
    text-underline-offset: 0.18em;
  }
}
</style>
