<script setup>
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { useRoute } from 'vue-router'

const props = defineProps({
  embedded: {
    type: Boolean,
    default: false,
  },
})

const route = useRoute()
const isVisible = ref(false)
const bottomOffset = ref(15)
const edgeOffset = 15
const buttonSize = 32

let frameId = 0

const buttonStyle = computed(() => ({
  ...(props.embedded ? {} : { bottom: `${bottomOffset.value}px` }),
}))

function updatePosition() {
  frameId = 0
  isVisible.value = window.scrollY > 260

  if (props.embedded) return

  const footer = document.querySelector('.site-footer')
  const footerRect = footer?.getBoundingClientRect()
  const isRwd = window.matchMedia('(max-width: 720px)').matches
  const dockToFooter = isRwd
    ? window.innerHeight - (footerRect?.top ?? window.innerHeight) - edgeOffset - buttonSize
    : window.innerHeight - (footerRect?.bottom ?? window.innerHeight) + edgeOffset

  bottomOffset.value = Math.round(Math.max(edgeOffset, dockToFooter))
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
      :class="['go-top-button', embedded ? 'go-top-button--embedded' : 'go-top-button--standalone']"
      type="button"
      :style="buttonStyle"
      aria-label="回到頁面頂端"
      title="回到頂端"
      @click="scrollToTop"
      @focus="requestUpdate"
    >
      <svg class="go-top-icon" viewBox="0 0 48 48" aria-hidden="true">
        <path class="go-top-icon__bar" d="M10 3h28v5H10z" />
        <path class="go-top-icon__arrow" d="M24 12 7 30h11v15h12V30h11L24 12Z" />
      </svg>
    </button>
  </Transition>
</template>

<style scoped>
.go-top-button {
  z-index: 12;
  display: grid;
  width: 32px;
  height: 32px;
  place-items: center;
  border: 1px solid rgba(255, 90, 18, 0.58);
  border-radius: 0;
  color: #fff;
  background:
    radial-gradient(circle at 30% 16%, rgba(255, 176, 96, 0.24), transparent 42%),
    linear-gradient(145deg, rgba(28, 18, 14, 0.94), rgba(10, 10, 10, 0.94));
  box-shadow:
    0 14px 32px rgba(0, 0, 0, 0.36),
    inset 0 0 0 1px rgba(255, 255, 255, 0.06);
  cursor: pointer;
  transition:
    background 0.18s ease,
    border-color 0.18s ease,
    transform 0.18s ease;
}

.go-top-button--standalone {
  position: fixed;
  right: 15px;
  transition:
    bottom 0.18s ease,
    background 0.18s ease,
    border-color 0.18s ease,
    transform 0.18s ease;
}

.go-top-button--embedded {
  position: static;
  width: var(--floating-contact-button-size, 32px);
  height: auto;
  aspect-ratio: 1;
}

.go-top-icon {
  width: 64%;
  height: 64%;
}

.go-top-icon__bar {
  fill: #ff7a32;
}

.go-top-icon__arrow {
  fill: #ff7a32;
}

.go-top-button:hover,
.go-top-button:focus-visible {
  border-color: rgba(255, 122, 50, 0.95);
  background:
    radial-gradient(circle at 30% 16%, rgba(255, 190, 110, 0.34), transparent 42%),
    linear-gradient(145deg, rgba(42, 24, 16, 0.98), rgba(18, 18, 18, 0.98));
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

@media (min-width: 721px) {
  .go-top-button--standalone {
    display: none;
  }
}

@media (max-width: 720px) {
  .go-top-button--standalone {
    right: 15px;
  }

  .go-top-button--embedded {
    display: none;
  }
}
</style>
