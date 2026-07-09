<script setup>
import { ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { hasSupabaseConfig, supabase } from '@/lib/supabase'

const route = useRoute()
const router = useRouter()

const email = ref('')
const password = ref('')
const isSubmitting = ref(false)
const errorMessage = ref('')

const login = async () => {
  if (!hasSupabaseConfig) {
    errorMessage.value = 'Supabase 環境變數尚未設定。'
    return
  }

  isSubmitting.value = true
  errorMessage.value = ''

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
</script>

<template>
  <main class="admin-login">
    <section class="login-panel">
      <p class="eyebrow">Founder Admin</p>
      <h1>後台登入</h1>
      <form @submit.prevent="login">
        <label>
          Email
          <input v-model="email" type="email" autocomplete="email" required />
        </label>
        <label>
          Password
          <input v-model="password" type="password" autocomplete="current-password" required />
        </label>
        <p v-if="errorMessage" class="form-error">{{ errorMessage }}</p>
        <button type="submit" :disabled="isSubmitting">
          {{ isSubmitting ? '登入中...' : '登入' }}
        </button>
      </form>
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

.form-error {
  margin: 0;
  color: #ff9a76;
  font-size: 0.92rem;
}
</style>
