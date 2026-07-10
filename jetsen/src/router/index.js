import { createRouter, createWebHistory } from 'vue-router'
import { hasSupabaseConfig, supabase } from '@/lib/supabase'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('../views/HomeView.vue'),
    },
    {
      path: '/works',
      name: 'works',
      component: () => import('../views/WorksView.vue'),
    },
    {
      path: '/works/:slug',
      name: 'works-detail',
      component: () => import('../views/WorksDetailView.vue'),
    },
    {
      path: '/story',
      name: 'story',
      component: () => import('../views/StoryView.vue'),
    },
    {
      path: '/faq',
      name: 'faq',
      redirect: '/contact',
    },
    {
      path: '/contact',
      name: 'contact',
      component: () => import('../views/ContactView.vue'),
    },
    {
      path: '/admin/login',
      name: 'admin-login',
      component: () => import('../views/AdminLoginView.vue'),
      meta: { layout: 'admin' },
    },
    {
      path: '/admin/works',
      name: 'admin-works',
      component: () => import('../views/AdminWorksView.vue'),
      meta: { layout: 'admin', requiresAuth: true },
    },
    {
      path: '/:pathMatch(.*)*',
      name: 'not-found',
      component: () => import('../views/NotFoundView.vue'),
      meta: { layout: 'blank' },
    },
  ],
  scrollBehavior() {
    return { top: 0 }
  },
})

router.beforeEach(async (to) => {
  if (!to.meta.requiresAuth) return true

  if (!hasSupabaseConfig) {
    return { name: 'admin-login', query: { redirect: to.fullPath } }
  }

  const { data } = await supabase.auth.getSession()

  if (!data.session) {
    return { name: 'admin-login', query: { redirect: to.fullPath } }
  }

  return true
})

export default router
