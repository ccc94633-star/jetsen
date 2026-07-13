import { findWorkBySlug } from '@/data/works'

const siteName = '杰森鐵作'
const defaultSeo = {
  title: '杰森鐵作｜台中採光罩、欄杆扶手、客製鐵件工程',
  description:
    '杰森鐵作提供台中採光罩、欄杆扶手、隱形鐵窗與客製鐵件工程，從現場丈量到施工安裝，依需求細緻規劃。',
}

const pageSeo = {
  home: defaultSeo,
  works: {
    title: '鐵件工程作品｜杰森鐵作',
    description:
      '瀏覽杰森鐵作的採光罩、欄杆扶手、隱形鐵窗與設計師鐵件工程作品，了解不同空間的施工細節。',
  },
  story: {
    title: '關於杰森鐵作｜專業鐵件工程與空間細節',
    description:
      '認識杰森鐵作的施工理念：重視現場溝通、結構安全與細節完成度，打造兼具實用與美感的鐵件工程。',
  },
  contact: {
    title: '聯絡杰森鐵作｜台中鐵件工程諮詢與估價',
    description:
      '需要採光罩、欄杆扶手、隱形鐵窗或客製鐵件？聯絡杰森鐵作，洽詢台中地區的工程需求與估價。',
  },
}

const getWorkSeo = (slug) => {
  const work = findWorkBySlug(slug)

  if (!work) return pageSeo.works

  return {
    title: `${work.title}工程｜${siteName}`,
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
  const baseUrl = new URL(import.meta.env.BASE_URL, window.location.origin)
  const url = new URL(route.fullPath.replace(/^\//, ''), baseUrl).href

  document.title = seo.title
  setMeta('meta[name="description"]', 'name="description"', seo.description)
  setMeta('meta[property="og:title"]', 'property="og:title"', seo.title)
  setMeta('meta[property="og:description"]', 'property="og:description"', seo.description)
  setMeta('meta[property="og:url"]', 'property="og:url"', url)
}
