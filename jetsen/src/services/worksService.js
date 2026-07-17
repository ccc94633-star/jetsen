import { fullWorks, works as localWorks } from '@/data/works'
import { hasSupabaseConfig, supabase } from '@/lib/supabase'
import { getWorkCategoryTag } from '@/utils/workTags'

const sortPhotosNewestFirst = (a, b) => {
  const aCreatedAt = a.created_at ? new Date(a.created_at).getTime() : 0
  const bCreatedAt = b.created_at ? new Date(b.created_at).getTime() : 0
  if (aCreatedAt !== bCreatedAt) return bCreatedAt - aCreatedAt

  return (b.sort_order ?? 0) - (a.sort_order ?? 0)
}

const getLocalPhotoIndex = (storagePath, slug) => {
  const match = storagePath?.match(new RegExp(`^local/${slug}/(\\d+)$`))
  return match ? Number(match[1]) : null
}

const getDisplayPhoto = (photo, category, fullLocalWork) => {
  const localPhotoIndex = getLocalPhotoIndex(photo.storage_path, category.slug)
  const localImageUrl = Number.isInteger(localPhotoIndex) ? fullLocalWork?.gallery?.[localPhotoIndex] : null

  return localImageUrl ? { ...photo, image_url: localImageUrl } : photo
}

const sortCoverFirst = (a, b) => {
  if (a.is_cover !== b.is_cover) return a.is_cover ? -1 : 1
  return 0
}

const buildRemoteWork = (category, photos) => {
  const localWork = localWorks.find((work) => work.slug === category.slug)
  const fullLocalWork = fullWorks.find((work) => work.slug === category.slug)
  const fallbackWork = localWorks[0]
  const displayPhotos = photos
    .filter((photo) => photo.is_published)
    .map((photo) => getDisplayPhoto(photo, category, fullLocalWork))
  const galleryPhotos = [...displayPhotos].sort(sortCoverFirst)
  const remoteGallery = galleryPhotos.map((photo) => photo.image_url)
  const localGallery = fullLocalWork?.gallery ?? []
  const gallery = photos.length ? remoteGallery : localGallery
  const coverPhoto = galleryPhotos[0]

  return {
    ...localWork,
    slug: category.slug,
    title: category.title || localWork?.title || category.slug,
    tag: getWorkCategoryTag({
      tag: category.tag || localWork?.tag,
      title: category.title || localWork?.title,
      slug: category.slug,
    }),
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
        .order('created_at', { ascending: false }),
    ])

  if (categoriesError || photosError || !categories?.length) {
    return localWorks
  }

  return categories.map((category) =>
    buildRemoteWork(
      category,
      (photos ?? []).filter((photo) => photo.category_id === category.id).sort(sortPhotosNewestFirst),
    ),
  )
}
