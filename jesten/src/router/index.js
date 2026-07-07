import { createRouter, createWebHistory } from 'vue-router'

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
  ],
  scrollBehavior() {
    return { top: 0 }
  },
})

export default router
