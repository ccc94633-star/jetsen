<template>
  <div class="floating-contact" aria-label="快速聯絡">
    <a
      class="floating-contact__button floating-contact__button--line"
      href="https://line.me/R/ti/p/@485quazl"
      target="_blank"
      rel="noreferrer"
      aria-label="加入官方 LINE"
      title="加入官方 LINE"
    >
      <span class="line-icon" aria-hidden="true">LINE</span>
    </a>

    <a
      class="floating-contact__button"
      href="tel:0981185728"
      aria-label="撥打電話"
      title="撥打電話"
    >
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path
          d="M6.62 10.79c1.47 2.89 3.7 5.12 6.59 6.59l2.2-2.2c.28-.28.68-.37 1.04-.25 1.14.38 2.36.58 3.55.58.56 0 1 .44 1 1V20c0 .56-.44 1-1 1C10.61 21 3 13.39 3 4c0-.56.44-1 1-1h3.5c.56 0 1 .44 1 1 0 1.19.2 2.41.58 3.55.12.36.03.76-.25 1.04l-2.21 2.2Z"
        />
      </svg>
    </a>
  </div>
</template>

<style scoped>
.floating-contact {
  position: absolute;
  top: 50%;
  right: clamp(14px, 2.8vw, 34px);
  z-index: 4;
  display: grid;
  gap: 10px;
  opacity: 0.9;
  transform: translateY(-50%);
}

.floating-contact__button {
  display: grid;
  width: clamp(46px, 4.2vw, 58px);
  aspect-ratio: 1;
  place-items: center;
  border: 1px solid rgba(255, 90, 18, 0.58);
  color: #fff;
  background:
    radial-gradient(circle at 30% 16%, rgba(255, 176, 96, 0.34), transparent 42%),
    linear-gradient(145deg, rgba(255, 90, 18, 0.92), rgba(126, 38, 8, 0.92));
  box-shadow:
    0 14px 32px rgba(0, 0, 0, 0.36),
    inset 0 0 0 1px rgba(255, 255, 255, 0.06);
  text-decoration: none;
  backdrop-filter: blur(12px);
  transition:
    border-color 0.2s ease,
    background 0.2s ease,
    transform 0.2s ease;
}

.floating-contact__button:hover,
.floating-contact__button:focus-visible {
  border-color: rgba(255, 90, 18, 0.95);
  background:
    radial-gradient(circle at 30% 16%, rgba(255, 190, 110, 0.42), transparent 42%),
    linear-gradient(145deg, rgba(255, 111, 28, 0.98), rgba(158, 47, 9, 0.98));
  outline: none;
  transform: translateX(-3px);
}

.floating-contact__button svg {
  width: 48%;
  height: 48%;
  fill: currentColor;
}

.line-icon {
  display: grid;
  width: 66%;
  aspect-ratio: 1;
  place-items: center;
  border-radius: 50%;
  color: #06c755;
  background: #fff;
  font-size: clamp(0.52rem, 0.72vw, 0.68rem);
  font-weight: 950;
  line-height: 1;
}

.floating-contact__button--line {
  border-color: rgba(255, 90, 18, 0.58);
  background:
    radial-gradient(circle at 30% 16%, rgba(255, 255, 255, 0.22), transparent 42%),
    linear-gradient(145deg, rgba(6, 199, 85, 0.96), rgba(4, 132, 58, 0.96));
}

.floating-contact__button--line:hover,
.floating-contact__button--line:focus-visible {
  background:
    radial-gradient(circle at 30% 16%, rgba(255, 255, 255, 0.3), transparent 42%),
    linear-gradient(145deg, rgba(8, 221, 96, 0.98), rgba(5, 158, 69, 0.98));
}

@media (max-width: 720px) {
  .floating-contact {
    top: clamp(16px, 4vw, 24px);
    right: 12px;
    grid-auto-flow: column;
    gap: 8px;
    transform: none;
  }

  .floating-contact__button {
    width: 37.4px;
  }
}
</style>
