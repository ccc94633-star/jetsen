import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'
import { hasSupabaseConfig, supabase } from '@/lib/supabase'

const app = createApp(App)

app.use(createPinia())
app.use(router)

if (hasSupabaseConfig) {
  supabase.auth.onAuthStateChange((event) => {
    if (event === 'PASSWORD_RECOVERY') {
      router.replace({ name: 'admin-login', query: { mode: 'reset' } })
    }
  })
}

app.mount('#app')
