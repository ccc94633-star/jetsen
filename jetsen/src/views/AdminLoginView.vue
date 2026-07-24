<script setup>
import { computed, onMounted, onUnmounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { hasSupabaseConfig, supabase } from '@/lib/supabase'

const route = useRoute()
const router = useRouter()

const email = ref('')
const password = ref('')
const newPassword = ref('')
const confirmPassword = ref('')
const mode = ref('login')
const isSubmitting = ref(false)
const errorMessage = ref('')
const successMessage = ref('')

const panelTitle = computed(() => {
  if (mode.value === 'request-reset') return '更改密碼'
  if (mode.value === 'update-password') return '設定新密碼'
  return '後台登入'
})

const siteUrl = import.meta.env.VITE_SITE_URL || window.location.origin
const resetRedirectUrl = () => new URL(`${import.meta.env.BASE_URL}admin/login`, siteUrl).href

const setMode = (nextMode) => {
  mode.value = nextMode
  password.value = ''
  newPassword.value = ''
  confirmPassword.value = ''
  errorMessage.value = ''
  successMessage.value = ''
}

const login = async () => {
  if (!hasSupabaseConfig) {
    errorMessage.value = 'Supabase 環境變數尚未設定。'
    return
  }

  isSubmitting.value = true
  errorMessage.value = ''
  successMessage.value = ''

  const { error } = await supabase.auth.signInWithPassword({
    email: email.value,
    password: password.value,
  })

  isSubmitting.value = false

  if (error) {
    errorMessage.value = '登入失敗，請確認 email 和密碼。'
    return
  }

  router.push(route.query.redirect || '/admin/works')
}

const requestPasswordReset = async () => {
  if (!hasSupabaseConfig) {
    errorMessage.value = 'Supabase 環境變數尚未設定。'
    return
  }

  isSubmitting.value = true
  errorMessage.value = ''
  successMessage.value = ''

  const { error } = await supabase.auth.resetPasswordForEmail(email.value, {
    redirectTo: resetRedirectUrl(),
  })

  isSubmitting.value = false

  if (error) {
    errorMessage.value = '寄送失敗，請確認 email 是否正確。'
    return
  }

  successMessage.value = '已寄出更改密碼連結，請到信箱收信。'
}

const updatePassword = async () => {
  if (!hasSupabaseConfig) {
    errorMessage.value = 'Supabase 環境變數尚未設定。'
    return
  }

  if (newPassword.value.length < 6) {
    errorMessage.value = '新密碼至少需要 6 個字元。'
    return
  }

  if (newPassword.value !== confirmPassword.value) {
    errorMessage.value = '兩次輸入的新密碼不一致。'
    return
  }

  isSubmitting.value = true
  errorMessage.value = ''
  successMessage.value = ''

  const { error } = await supabase.auth.updateUser({
    password: newPassword.value,
  })

  isSubmitting.value = false

  if (error) {
    errorMessage.value = '密碼更新失敗，請重新點擊信件中的連結再試一次。'
    return
  }

  successMessage.value = '密碼已更新，請用新密碼重新登入。'
  await supabase.auth.signOut()
  setMode('login')
  successMessage.value = '密碼已更新，請用新密碼重新登入。'
}

let authSubscription

onMounted(() => {
  if (!hasSupabaseConfig) return

  if (route.query.mode === 'reset') {
    setMode('update-password')
  }

  const { data } = supabase.auth.onAuthStateChange((event) => {
    if (event === 'PASSWORD_RECOVERY') {
      setMode('update-password')
    }
  })

  authSubscription = data.subscription
})

onUnmounted(() => {
  authSubscription?.unsubscribe()
})
</script>

<template>
  <main class="admin-login">
    <section class="login-panel">
      <p class="eyebrow">Founder Admin</p>
      <h1>{{ panelTitle }}</h1>
      <form v-if="mode === 'login'" @submit.prevent="login">
        <label>
          Email
          <input v-model="email" type="email" autocomplete="email" required />
        </label>
        <label>
          Password
          <input v-model="password" type="password" autocomplete="current-password" required />
        </label>
        <p v-if="errorMessage" class="form-error">{{ errorMessage }}</p>
        <p v-if="successMessage" class="form-success">{{ successMessage }}</p>
        <button type="submit" :disabled="isSubmitting">
          {{ isSubmitting ? '登入中...' : '登入' }}
        </button>
      </form>
      <form v-else-if="mode === 'request-reset'" @submit.prevent="requestPasswordReset">
        <label>
          Email
          <input v-model="email" type="email" autocomplete="email" required />
        </label>
        <p v-if="errorMessage" class="form-error">{{ errorMessage }}</p>
        <p v-if="successMessage" class="form-success">{{ successMessage }}</p>
        <button type="submit" :disabled="isSubmitting">
          {{ isSubmitting ? '寄送中...' : '寄送更改密碼連結' }}
        </button>
      </form>
      <form v-else @submit.prevent="updatePassword">
        <label>
          New password
          <input v-model="newPassword" type="password" autocomplete="new-password" required />
        </label>
        <label>
          Confirm password
          <input v-model="confirmPassword" type="password" autocomplete="new-password" required />
        </label>
        <p v-if="errorMessage" class="form-error">{{ errorMessage }}</p>
        <p v-if="successMessage" class="form-success">{{ successMessage }}</p>
        <button type="submit" :disabled="isSubmitting">
          {{ isSubmitting ? '更新中...' : '更新密碼' }}
        </button>
      </form>
      <button
        v-if="mode === 'login'"
        class="text-button"
        type="button"
        @click="setMode('request-reset')"
      >
        忘記 / 更改密碼
      </button>
      <button v-else class="text-button" type="button" @click="setMode('login')">
        返回登入
      </button>
    </section>
  </main>
</template>

<style scoped>
.admin-login {
  display: grid;
  min-height: 100vh;
  place-items: center;
  padding: 24px;
  background: #080808;
}

.login-panel {
  width: min(100%, 420px);
  padding: 32px;
  border: 1px solid var(--color-line);
  border-radius: 8px;
  background: #111;
}

h1 {
  margin: 0 0 24px;
  color: #fff;
  font-size: 2rem;
}

form,
label {
  display: grid;
  gap: 12px;
}

form {
  gap: 18px;
}

label {
  color: #d8d8d2;
  font-weight: 850;
}

input {
  min-height: 46px;
  padding: 10px 12px;
  border: 1px solid rgba(255, 255, 255, 0.14);
  border-radius: 6px;
  color: #fff;
  background: #050505;
  font: inherit;
}

button {
  min-height: 48px;
  border: 0;
  border-radius: 6px;
  color: #fff;
  background: linear-gradient(180deg, #ff6a18, #f04a0a);
  cursor: pointer;
  font: inherit;
  font-weight: 950;
}

button:disabled {
  cursor: wait;
  opacity: 0.62;
}

.text-button {
  width: 100%;
  min-height: auto;
  margin-top: 18px;
  padding: 0;
  color: #d8d8d2;
  background: transparent;
  font-size: 0.94rem;
  text-decoration: underline;
  text-underline-offset: 4px;
}

.text-button:hover {
  color: #fff;
}

.form-error {
  margin: 0;
  color: #ff9a76;
  font-size: 0.92rem;
}

.form-success {
  margin: 0;
  color: #8fe0a4;
  font-size: 0.92rem;
}
</style>
