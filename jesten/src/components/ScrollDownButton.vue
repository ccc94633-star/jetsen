<script setup>
import { ref } from 'vue'

const props = defineProps({
  target: {
    type: String,
    default: null,
  },
})

const buttonRef = ref(null)

function scrollDown() {
  const target =
    (props.target && document.querySelector(props.target)) ??
    buttonRef.value?.closest('section')?.nextElementSibling

  target?.scrollIntoView({ behavior: 'smooth' })
}
</script>

<template>
  <button
    ref="buttonRef"
    type="button"
    class="scroll-down"
    aria-label="向下捲動"
    @click="scrollDown"
  >
    <span class="scroll-down-arrow" aria-hidden="true"></span>
  </button>
</template>

<style scoped>
.scroll-down {
  position: absolute;
  bottom: clamp(20px, 4vw, 40px);
  left: 50%;
  z-index: 1;
  display: grid;
  width: 44px;
  height: 44px;
  place-items: center;
  border: 1px solid var(--color-accent);
  border-radius: 50%;
  background: rgba(0, 0, 0, 0.3);
  cursor: pointer;
  transform: translateX(-50%);
  transition:
    border-color 180ms ease,
    background 180ms ease,
    transform 180ms ease;
}

.scroll-down:hover,
.scroll-down:focus-visible {
  border-color: #ff7a32;
  background: rgba(255, 90, 18, 0.14);
  outline: none;
  transform: translateX(-50%) translateY(-2px);
}

.scroll-down:focus-visible {
  outline: 3px solid rgba(255, 255, 255, 0.36);
  outline-offset: 3px;
}

.scroll-down-arrow {
  display: block;
  width: 12px;
  height: 12px;
  border-bottom: 2px solid #fff;
  border-left: 2px solid #fff;
  animation: scroll-arrow 1.8s ease-in-out infinite;
}

@keyframes scroll-arrow {
  0% {
    transform: rotate(-45deg) translate(0, 0);
    opacity: 0;
  }

  50% {
    opacity: 1;
  }

  100% {
    transform: rotate(-45deg) translate(-14px, 14px);
    opacity: 0;
  }
}
</style>
