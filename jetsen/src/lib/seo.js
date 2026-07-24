import { findWorkBySlug } from '@/data/works'
import { defaultSeo, pageSeo, workSeo } from '@/data/seo'

const getWorkSeo = (slug) => {
  if (workSeo[slug]) return workSeo[slug]

  const work = findWorkBySlug(slug)

  if (!work) return pageSeo.works

  return {
    title: `${work.title}工程｜杰森鐵作`,
    description: `${work.description}${work.detail}`,
  }
}

export const getSeoForRoute = (route) => {
  if (route.name === 'works-detail') return getWorkSeo(route.params.slug)
  return pageSeo[route.name] ?? defaultSeo
}

const setMeta = (selector, attribute, value) => {
  let element = document.head.querySelector(selector)

  if (!element) {
    element = document.createElement('meta')
    const [name, content] = attribute.split('=')
    element.setAttribute(name, content.replaceAll('"', ''))
    document.head.appendChild(element)
  }

  element.setAttribute('content', value)
}

export const applySeo = (route) => {
  const seo = getSeoForRoute(route)
  const siteUrl = import.meta.env.VITE_SITE_URL || window.location.origin
  const baseUrl = new URL(import.meta.env.BASE_URL, siteUrl)
  const url = new URL(route.fullPath.replace(/^\//, ''), baseUrl).href

  document.title = seo.title
  setMeta('meta[name="description"]', 'name="description"', seo.description)
  setMeta('meta[property="og:title"]', 'property="og:title"', seo.title)
  setMeta('meta[property="og:description"]', 'property="og:description"', seo.description)
  setMeta('meta[property="og:url"]', 'property="og:url"', url)
  setMeta('meta[name="twitter:title"]', 'name="twitter:title"', seo.title)
  setMeta('meta[name="twitter:description"]', 'name="twitter:description"', seo.description)
}
