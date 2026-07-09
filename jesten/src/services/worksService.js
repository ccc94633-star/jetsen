import { fullWorks, works as localWorks } from '@/data/works'
import { hasSupabaseConfig, supabase } from '@/lib/supabase'

const sortByOrder = (a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0)

const buildRemoteWork = (category, photos) => {
  const localWork = localWorks.find((work) => work.slug === category.slug)
  const fullLocalWork = fullWorks.find((work) => work.slug === category.slug)
  const fallbackWork = localWorks[0]
  const remoteGallery = photos.map((photo) => photo.image_url)
  const localGallery = fullLocalWork?.gallery ?? []
  const gallery = [...remoteGallery, ...localGallery.filter((image) => !remoteGallery.includes(image))]
  const coverPhoto = photos.find((photo) => photo.is_cover) ?? photos[0]

  return {
    ...localWork,
    slug: category.slug,
    title: category.title || localWork?.title || category.slug,
    tag: category.tag || localWork?.tag || 'Work',
    headline: category.headline || localWork?.headline || category.title,
    description: category.description || localWork?.description || '新增作品分類，照片上傳後會顯示在這裡。',
    detail: category.detail || localWork?.detail || category.description || '新增作品分類，照片上傳後會顯示在這裡。',
    count: String(gallery.length || fullLocalWork?.count || localWork?.count || 0),
    coverImage: coverPhoto?.image_url || localWork?.coverImage || fallbackWork.coverImage,
    gallery,
    services: localWork?.services ?? [],
    stats: localWork?.stats ?? [],
  }
}

export const getPublishedWorks = async () => {
  if (!hasSupabaseConfig) return localWorks

  const [{ data: categories, error: categoriesError }, { data: photos, error: photosError }] =
    await Promise.all([
      supabase
        .from('work_categories')
        .select('*')
        .eq('is_active', true)
        .order('sort_order', { ascending: true }),
      supabase
        .from('work_photos')
        .select('*')
        .eq('is_published', true)
        .order('sort_order', { ascending: true }),
    ])

  if (categoriesError || photosError || !categories?.length) {
    return localWorks
  }

  return categories.map((category) =>
    buildRemoteWork(
      category,
      (photos ?? []).filter((photo) => photo.category_id === category.id).sort(sortByOrder),
    ),
  )
}
