<script setup>
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const isVisible = ref(false)
const bottomOffset = ref(24)
const defaultOffset = 24

let frameId = 0

const buttonStyle = computed(() => ({
  bottom: `${bottomOffset.value}px`,
}))

function updatePosition() {
  frameId = 0
  const footer = document.querySelector('.site-footer')
  const footerTop = footer?.getBoundingClientRect().top ?? window.innerHeight
  const liftAboveFooter = Math.max(defaultOffset, window.innerHeight - footerTop + defaultOffset)

  isVisible.value = window.scrollY > 260
  bottomOffset.value = Math.round(liftAboveFooter)
}

function requestUpdate() {
  if (frameId) return
  frameId = window.requestAnimationFrame(updatePosition)
}

function scrollToTop() {
  window.scrollTo({
    top: 0,
    behavior: 'smooth',
  })
}

onMounted(() => {
  updatePosition()
  window.addEventListener('scroll', requestUpdate, { passive: true })
  window.addEventListener('resize', requestUpdate)
})

watch(
  () => route.fullPath,
  async () => {
    await nextTick()
    requestUpdate()
  },
)

onBeforeUnmount(() => {
  if (frameId) {
    window.cancelAnimationFrame(frameId)
  }

  window.removeEventListener('scroll', requestUpdate)
  window.removeEventListener('resize', requestUpdate)
})
</script>

<template>
  <Transition name="go-top">
    <button
      v-show="isVisible"
      class="go-top-button"
      type="button"
      :style="buttonStyle"
      aria-label="回到頁面頂端"
      title="回到頂端"
      @click="scrollToTop"
      @focus="requestUpdate"
    >
      <span aria-hidden="true">↑</span>
    </button>
  </Transition>
</template>

<style scoped>
.go-top-button {
  position: fixed;
  right: clamp(16px, 3vw, 32px);
  z-index: 12;
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
  transition:
    bottom 0.18s ease,
    background 0.18s ease,
    border-color 0.18s ease,
    transform 0.18s ease;
}

.go-top-button span {
  font-size: 1rem;
  font-weight: 500;
  line-height: 1;
}

.go-top-button:hover,
.go-top-button:focus-visible {
  border-color: #ff7a32;
  background: rgba(22, 22, 22, 0.96);
  transform: translateY(-2px);
}

.go-top-button:focus-visible {
  outline: 3px solid rgba(255, 255, 255, 0.36);
  outline-offset: 3px;
}

.go-top-enter-active,
.go-top-leave-active {
  transition:
    opacity 0.18s ease,
    transform 0.18s ease;
}

.go-top-enter-from,
.go-top-leave-to {
  opacity: 0;
  transform: translateY(8px);
}

@media (max-width: 720px) {
  .go-top-button {
    right: 16px;
  }
}
</style>
