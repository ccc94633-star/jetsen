<script setup>
import imageCompression from 'browser-image-compression'
import { computed, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { fullWorks as localWorks } from '@/data/works'
import { hasSupabaseConfig, supabase } from '@/lib/supabase'

const router = useRouter()
const bucketName = 'work-photos'

const categories = ref([])
const photos = ref([])
const selectedCategoryId = ref('')
const selectedFiles = ref([])
const searchTerm = ref('')
const uploadSummaries = ref([])
const panel = ref('')
const newCategoryTitle = ref('')
const editCategoryTitle = ref('')
const isLoading = ref(true)
const isUploading = ref(false)
const isSavingCategory = ref(false)
const statusMessage = ref('')
const errorMessage = ref('')
const successMessage = ref('')
const successRoute = ref(null)
const successHref = computed(() => {
  if (!successRoute.value) return ''
  return router.resolve(successRoute.value).href
})

const selectedCategory = computed(() =>
  categories.value.find((category) => category.id === selectedCategoryId.value),
)

const getLocalWorkByCategory = (category) =>
  localWorks.find((work) => work.slug === category?.slug)

const getLocalPhotoIndex = (storagePath, slug) => {
  const match = storagePath?.match(new RegExp(`^local/${slug}/(\\d+)$`))
  return match ? Number(match[1]) : null
}

const getDisplayPhoto = (photo, category, localWork) => {
  const localPhotoIndex = getLocalPhotoIndex(photo.storage_path, category.slug)
  const localImageUrl = Number.isInteger(localPhotoIndex) ? localWork?.gallery?.[localPhotoIndex] : null

  return localImageUrl ? { ...photo, image_url: localImageUrl } : photo
}

const getDisplayPhotosForCategory = (category) => {
  if (!category) return []

  const localWork = getLocalWorkByCategory(category)
  const remotePhotos = photos.value
    .filter((photo) => photo.category_id === category.id)
    .map((photo) => getDisplayPhoto(photo, category, localWork))
  const remoteImageUrls = new Set(remotePhotos.map((photo) => photo.image_url))
  const localPreviewPhotos = (localWork?.gallery ?? [])
    .filter((imageUrl) => !remoteImageUrls.has(imageUrl))
    .map((imageUrl, index) => ({
      id: `local-preview-${category.slug}-${index}`,
      category_id: category.id,
      image_url: imageUrl,
      storage_path: `local-preview/${category.slug}/${index}`,
      alt_text: `${category.title}本地作品照片`,
      sort_order: 10000 + index,
      is_published: true,
      is_cover: !remotePhotos.some((photo) => photo.is_cover) && index === 0,
      is_local_preview: true,
    }))

  return [...remotePhotos, ...localPreviewPhotos].sort(
    (a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0),
  )
}

const allVisiblePhotos = computed(() =>
  categories.value.flatMap((category) => getDisplayPhotosForCategory(category)),
)

const isAllSelected = computed(() => selectedCategoryId.value === '')

const visiblePhotos = computed(() =>
  isAllSelected.value ? allVisiblePhotos.value : getDisplayPhotosForCategory(selectedCategory.value),
)

const filteredPhotos = computed(() => {
  const keyword = searchTerm.value.trim().toLowerCase()
  if (!keyword) return visiblePhotos.value

  return visiblePhotos.value.filter((photo) =>
    [photo.alt_text, photo.storage_path, selectedCategory.value?.title]
      .filter(Boolean)
      .some((value) => value.toLowerCase().includes(keyword)),
  )
})

const getCategoryPhotoCount = (categoryId) => {
  const category = categories.value.find((item) => item.id === categoryId)
  return getDisplayPhotosForCategory(category).length
}

const totalPhotoCount = computed(() => allVisiblePhotos.value.length)

const isLocalRestoredPhoto = (storagePath) => storagePath?.startsWith('local/')

const formatBytes = (bytes) => {
  if (!Number.isFinite(bytes)) return '0 KB'
  if (bytes >= 1024 * 1024) return `${(bytes / 1024 / 1024).toFixed(2)} MB`
  return `${Math.max(1, Math.round(bytes / 1024))} KB`
}

const getCompressionPercent = (before, after) => {
  if (!before) return 0
  return Math.max(0, Math.round((1 - after / before) * 100))
}

const clearFeedback = () => {
  statusMessage.value = ''
  errorMessage.value = ''
  successMessage.value = ''
  successRoute.value = null
}

const getCategoryById = (categoryId) => categories.value.find((category) => category.id === categoryId)

const getCategoryRoute = (category) => {
  if (!category?.slug) return null

  return {
    name: 'works-detail',
    params: { slug: category.slug },
  }
}

const worksRoute = {
  name: 'works',
}

const setSuccessFeedback = (message, category) => {
  successMessage.value = message
  successRoute.value = getCategoryRoute(category)
}

const setWorksSuccessFeedback = (message) => {
  successMessage.value = message
  successRoute.value = worksRoute
}

const restoreMissingDefaultWorks = async (remoteCategories) => {
  const remoteSlugs = new Set((remoteCategories ?? []).map((category) => category.slug))
  const missingWorks = localWorks.filter((work) => !remoteSlugs.has(work.slug))

  for (const [index, work] of missingWorks.entries()) {
    const { data: category, error: categoryError } = await supabase
      .from('work_categories')
      .insert({
        slug: work.slug,
        title: work.title,
        tag: work.tag,
        headline: work.headline,
        description: work.description,
        detail: work.detail,
        sort_order: (remoteCategories?.length ?? 0) + index + 1,
        is_active: true,
      })
      .select()
      .single()

    if (categoryError) throw categoryError

    const photoRows = (work.gallery ?? []).map((imageUrl, photoIndex) => ({
      category_id: category.id,
      image_url: imageUrl,
      storage_path: `local/${work.slug}/${photoIndex}`,
      alt_text: `${work.title}作品照片`,
      sort_order: photoIndex + 1,
      is_published: true,
      is_cover: photoIndex === 0,
    }))

    if (photoRows.length) {
      const { error: photosError } = await supabase.from('work_photos').insert(photoRows)
      if (photosError) throw photosError
    }
  }

  return missingWorks.length
}

const loadAdminData = async () => {
  isLoading.value = true
  errorMessage.value = ''

  const [{ data: categoryData, error: categoryError }, { data: photoData, error: photoError }] =
    await Promise.all([
      supabase.from('work_categories').select('*').order('sort_order', { ascending: true }),
      supabase.from('work_photos').select('*').order('created_at', { ascending: false }),
    ])

  isLoading.value = false

  if (categoryError || photoError) {
    errorMessage.value = `讀取作品資料失敗：${categoryError?.message || photoError?.message}`
    return
  }

  try {
    const restoredCount = await restoreMissingDefaultWorks(categoryData ?? [])

    if (restoredCount) {
      const [{ data: refreshedCategories }, { data: refreshedPhotos }] = await Promise.all([
        supabase.from('work_categories').select('*').order('sort_order', { ascending: true }),
        supabase.from('work_photos').select('*').order('created_at', { ascending: false }),
      ])

      categories.value = refreshedCategories ?? []
      photos.value = refreshedPhotos ?? []
      successMessage.value ||= `已自動復原 ${restoredCount} 個預設分類`
    } else {
      categories.value = categoryData ?? []
      photos.value = photoData ?? []
    }
  } catch (restoreError) {
    categories.value = categoryData ?? []
    photos.value = photoData ?? []
    errorMessage.value = `復原預設分類失敗：${restoreError.message}`
  }

  editCategoryTitle.value = selectedCategory.value?.title ?? ''
}

const selectCategory = (categoryId) => {
  selectedCategoryId.value = categoryId
  editCategoryTitle.value = categories.value.find((category) => category.id === categoryId)?.title ?? ''
  selectedFiles.value = []
  uploadSummaries.value = []
  panel.value = ''
  clearFeedback()
}

const slugify = (value) => {
  const slug = value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')

  return slug || `category-${Date.now()}`
}

const openCategoryPanel = (mode) => {
  const nextPanel = panel.value === mode ? '' : mode
  panel.value = nextPanel
  clearFeedback()
  if (mode === 'edit') editCategoryTitle.value = selectedCategory.value?.title ?? ''
}

const createCategory = async () => {
  const title = newCategoryTitle.value.trim()
  if (!title) {
    errorMessage.value = '請輸入分類名稱'
    return
  }

  clearFeedback()
  isSavingCategory.value = true

  const { data, error } = await supabase
    .from('work_categories')
    .insert({
      slug: slugify(title),
      title,
      tag: title,
      sort_order: categories.value.length + 1,
      is_active: true,
    })
    .select()
    .single()

  isSavingCategory.value = false

  if (error) {
    errorMessage.value = `新增分類失敗：${error.message}`
    return
  }

  newCategoryTitle.value = ''
  panel.value = ''
  await loadAdminData()
  selectCategory(data.id)
  setSuccessFeedback(`已新增「${title}」分類`, data)
}

const updateCategory = async () => {
  if (!selectedCategory.value) {
    errorMessage.value = '請先選擇分類'
    return
  }

  const title = editCategoryTitle.value.trim()
  if (!title) {
    errorMessage.value = '請輸入分類名稱'
    return
  }

  clearFeedback()
  isSavingCategory.value = true

  const { error } = await supabase
    .from('work_categories')
    .update({ title, tag: title })
    .eq('id', selectedCategory.value.id)

  isSavingCategory.value = false

  if (error) {
    errorMessage.value = `修改分類失敗：${error.message}`
    return
  }

  panel.value = ''
  const updatedCategory = { ...selectedCategory.value, title, tag: title }
  await loadAdminData()
  setSuccessFeedback('分類已更新', updatedCategory)
}

const deleteCategory = async () => {
  if (!selectedCategory.value) {
    errorMessage.value = '請先選擇分類'
    return
  }

  const category = selectedCategory.value
  const categoryPhotos = photos.value.filter((photo) => photo.category_id === category.id)
  const confirmed = window.confirm(
    `確定要刪除「${category.title}」分類嗎？這會一起刪除 ${categoryPhotos.length} 張照片。`,
  )

  if (!confirmed) return

  clearFeedback()

  const storagePaths = categoryPhotos
    .map((photo) => photo.storage_path)
    .filter((path) => path && !isLocalRestoredPhoto(path))

  if (storagePaths.length) {
    const { error: storageError } = await supabase.storage
      .from(bucketName)
      .remove(storagePaths)

    if (storageError) {
      errorMessage.value = `刪除照片檔案失敗：${storageError.message}`
      return
    }
  }

  const { error } = await supabase.from('work_categories').delete().eq('id', category.id)
  if (error) {
    errorMessage.value = `刪除分類失敗：${error.message}`
    return
  }

  selectedCategoryId.value = ''
  panel.value = ''
  setWorksSuccessFeedback(`已刪除「${category.title}」分類，並刪除 ${categoryPhotos.length} 張照片`)
  await loadAdminData()
}

const handleFiles = (event) => {
  selectedFiles.value = Array.from(event.target.files ?? [])
  uploadSummaries.value = []
  successMessage.value = ''
}

const uploadPhotos = async () => {
  if (!selectedCategory.value) {
    errorMessage.value = '請先選擇分類'
    return
  }

  if (!selectedFiles.value.length) {
    errorMessage.value = '請先選擇照片'
    return
  }

  clearFeedback()
  uploadSummaries.value = []
  isUploading.value = true
  statusMessage.value = '正在壓縮並上傳照片...'
  let uploadedCount = 0

  try {
    for (const file of selectedFiles.value) {
      if (file.size > 15 * 1024 * 1024) {
        throw new Error(`${file.name} 超過 15MB，請換一張較小的照片。`)
      }

      const compressedFile = await imageCompression(file, {
        maxSizeMB: 0.8,
        maxWidthOrHeight: 1920,
        useWebWorker: true,
        fileType: 'image/webp',
      })

      uploadSummaries.value.push({
        name: file.name,
        before: file.size,
        after: compressedFile.size,
        percent: getCompressionPercent(file.size, compressedFile.size),
      })

      const safeName = file.name
        .toLowerCase()
        .replace(/\.[^.]+$/, '')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, '')

      const storagePath = `${selectedCategory.value.slug}/${Date.now()}-${safeName || 'photo'}.webp`

      statusMessage.value = `上傳 ${file.name}：${formatBytes(file.size)} -> ${formatBytes(compressedFile.size)}`

      const { error: uploadError } = await supabase.storage
        .from(bucketName)
        .upload(storagePath, compressedFile, {
          cacheControl: '31536000',
          contentType: 'image/webp',
          upsert: false,
        })

      if (uploadError) throw uploadError

      const { data: publicUrlData } = supabase.storage.from(bucketName).getPublicUrl(storagePath)

      const { error: insertError } = await supabase.from('work_photos').insert({
        category_id: selectedCategory.value.id,
        image_url: publicUrlData.publicUrl,
        storage_path: storagePath,
        alt_text: `${selectedCategory.value.title}作品照片`,
        sort_order: visiblePhotos.value.length + uploadedCount + 1,
        is_published: true,
        is_cover: visiblePhotos.value.length === 0 && uploadedCount === 0,
      })

      if (insertError) throw insertError
      uploadedCount += 1
    }

    selectedFiles.value = []
    statusMessage.value = ''
    setSuccessFeedback(`成功上傳 ${uploadedCount} 張照片`, selectedCategory.value)
    await loadAdminData()
  } catch (error) {
    errorMessage.value = error.message || '上傳失敗，請稍後再試'
  } finally {
    isUploading.value = false
  }
}

const setCover = async (photo) => {
  clearFeedback()

  const { error: resetError } = await supabase
    .from('work_photos')
    .update({ is_cover: false })
    .eq('category_id', photo.category_id)

  if (resetError) {
    errorMessage.value = '設定封面失敗'
    return
  }

  const { error } = await supabase.from('work_photos').update({ is_cover: true }).eq('id', photo.id)
  if (error) {
    errorMessage.value = '設定封面失敗'
    return
  }

  setSuccessFeedback('封面已更新', getCategoryById(photo.category_id))
  await loadAdminData()
}

const togglePublished = async (photo) => {
  clearFeedback()

  const { error } = await supabase
    .from('work_photos')
    .update({ is_published: !photo.is_published })
    .eq('id', photo.id)

  if (error) {
    errorMessage.value = '修改發布狀態失敗'
    return
  }

  setSuccessFeedback(photo.is_published ? '照片已隱藏' : '照片已發布', getCategoryById(photo.category_id))
  await loadAdminData()
}

const deletePhoto = async (photo) => {
  const confirmed = window.confirm('確定要刪除這張照片嗎？')
  if (!confirmed) return

  clearFeedback()

  if (photo.storage_path && !isLocalRestoredPhoto(photo.storage_path)) {
    const { error: storageError } = await supabase.storage.from(bucketName).remove([photo.storage_path])
    if (storageError) {
      errorMessage.value = '刪除 Storage 檔案失敗'
      return
    }
  }

  const { error } = await supabase.from('work_photos').delete().eq('id', photo.id)
  if (error) {
    errorMessage.value = '刪除照片資料失敗'
    return
  }

  setSuccessFeedback('成功刪除 1 張照片', getCategoryById(photo.category_id))
  await loadAdminData()
}

const logout = async () => {
  await supabase.auth.signOut()
  router.push('/admin/login')
}

onMounted(async () => {
  if (!hasSupabaseConfig) {
    isLoading.value = false
    errorMessage.value = 'Supabase 尚未設定，請檢查 .env.local'
    return
  }

  await loadAdminData()
})
</script>

<template>
  <main class="admin-shell">
    <section class="admin-card">
      <header class="admin-header">
        <div>
          <p class="eyebrow">Works Admin</p>
          <h1>產品照片管理</h1>
        </div>
        <button type="button" class="logout-button" @click="logout">登出</button>
      </header>

      <section class="quick-panel">
        <div class="category-tabs" aria-label="作品分類">
          <button
            type="button"
            :class="{ active: isAllSelected }"
            @click="selectCategory('')"
          >
            全部（{{ totalPhotoCount }} 張）
          </button>
          <button
            v-for="category in categories"
            :key="category.id"
            type="button"
            :class="{ active: category.id === selectedCategoryId }"
            @click="selectCategory(category.id)"
        >
          {{ category.title }}（{{ getCategoryPhotoCount(category.id) }} 張）
        </button>
      </div>

        <label class="search-bar">
          <span aria-hidden="true">⌕</span>
          <input v-model="searchTerm" type="search" placeholder="搜尋照片檔案名稱" />
        </label>
      </section>

      <div class="selected-row">
        <div>
          <p class="section-label">目前分類</p>
          <h2>{{ isAllSelected ? '全部' : selectedCategory?.title }}（{{ visiblePhotos.length }} 張）</h2>
        </div>
        <div class="category-actions">
          <button
            type="button"
            :class="{ active: panel === 'create' }"
            :aria-expanded="panel === 'create'"
            @click="openCategoryPanel('create')"
          >
            新增分類
          </button>
          <button
            type="button"
            :class="{ active: panel === 'edit' }"
            :aria-expanded="panel === 'edit'"
            :disabled="isAllSelected"
            @click="openCategoryPanel('edit')"
          >
            修改分類
          </button>
          <button
            type="button"
            class="button-danger"
            :class="{ active: panel === 'delete' }"
            :aria-expanded="panel === 'delete'"
            :disabled="isAllSelected"
            @click="openCategoryPanel('delete')"
          >
            刪除分類
          </button>
        </div>
      </div>

      <section v-if="panel" class="inline-panel">
        <form v-if="panel === 'create'" class="category-form" @submit.prevent="createCategory">
          <label>
            新增分類名稱
            <input v-model="newCategoryTitle" type="text" placeholder="例如：採光罩" />
          </label>
          <button type="submit" :disabled="isSavingCategory">
            {{ isSavingCategory ? '新增中...' : '新增' }}
          </button>
        </form>

        <form v-else-if="panel === 'edit'" class="category-form" @submit.prevent="updateCategory">
          <label>
            修改分類名稱
            <input v-model="editCategoryTitle" type="text" placeholder="例如：隱形鐵窗" />
          </label>
          <button type="submit" :disabled="isSavingCategory">儲存</button>
        </form>

        <div v-else class="delete-category-panel">
          <p>刪除分類會一起刪除這個分類裡的所有照片。</p>
          <button type="button" class="button-danger" @click="deleteCategory">
            確定刪除 {{ selectedCategory?.title }}
          </button>
        </div>
      </section>

      <section class="feedback-stack" aria-live="polite">
        <p v-if="statusMessage" class="status-message">{{ statusMessage }}</p>
        <p v-if="errorMessage" class="error-message">{{ errorMessage }}</p>
        <div v-if="successMessage" class="success-message">
          <span>{{ successMessage }}</span>
          <a v-if="successHref" :href="successHref" target="_blank" rel="noopener">點此查看</a>
        </div>
        <p v-if="isLoading" class="status-message">讀取中...</p>
      </section>

      <Transition name="photo-slide">
        <div v-if="!isLoading" class="photo-section">
          <section class="photo-board" aria-label="照片方格管理">
            <label v-if="selectedCategory" class="photo-tile upload-tile" for="admin-photo-upload">
              <input id="admin-photo-upload" type="file" accept="image/*" multiple @change="handleFiles" />
              <span class="tile-plus" aria-hidden="true">+</span>
              <strong>新增照片</strong>
              <small>單張最多 15MB</small>
            </label>

            <article v-for="photo in filteredPhotos" :key="photo.id" class="photo-tile photo-card">
              <img :src="photo.image_url" :alt="photo.alt_text || '作品照片'" />
              <div class="photo-badges">
                <span v-if="photo.is_cover">封面</span>
                <span :class="{ muted: !photo.is_published }">
                  {{ photo.is_published ? '已發布' : '已隱藏' }}
                </span>
              </div>
              <div class="photo-actions">
                <button type="button" :disabled="photo.is_cover || photo.is_local_preview" @click="setCover(photo)">封面</button>
                <button type="button" :disabled="photo.is_local_preview" @click="togglePublished(photo)">
                  {{ photo.is_published ? '隱藏' : '發布' }}
                </button>
                <button type="button" class="button-danger" :disabled="photo.is_local_preview" @click="deletePhoto(photo)">刪除</button>
              </div>
            </article>

            <article v-if="!filteredPhotos.length && !isLoading" class="photo-tile empty-tile">
              <span aria-hidden="true">□</span>
              <strong>還沒有照片</strong>
              <small>點左邊第一格新增</small>
            </article>
          </section>

          <button
            v-if="selectedFiles.length"
            type="button"
            class="upload-submit"
            :disabled="isUploading"
            @click="uploadPhotos"
          >
            {{ isUploading ? '上傳中...' : `上傳 ${selectedFiles.length} 張照片` }}
          </button>

          <section v-if="uploadSummaries.length" class="compression-list">
            <article v-for="item in uploadSummaries" :key="item.name">
              <strong>{{ item.name }}</strong>
              <span>原始 {{ formatBytes(item.before) }} → 壓縮後 {{ formatBytes(item.after) }}</span>
              <span>壓縮 {{ item.percent }}%</span>
            </article>
          </section>
        </div>
      </Transition>
    </section>
  </main>
</template>

<style scoped>
.admin-shell {
  min-height: 100vh;
  padding: clamp(20px, 5vw, 72px);
  background:
    radial-gradient(circle at 70% 18%, rgba(255, 90, 18, 0.2), transparent 22rem),
    linear-gradient(90deg, rgba(6, 6, 6, 0.98), rgba(6, 6, 6, 0.86)),
    #000;
}

.admin-card {
  width: min(100%, 1180px);
  margin-inline: auto;
}

.admin-header,
.selected-row,
.success-message,
.category-actions,
.photo-badges,
.photo-actions {
  display: flex;
  align-items: center;
}

.admin-header {
  justify-content: space-between;
  gap: 16px;
  margin-bottom: 28px;
}

.eyebrow,
.section-label {
  margin: 0 0 8px;
  color: #ff5a12;
  font-size: 1rem;
  font-weight: 950;
  letter-spacing: 0;
  text-transform: uppercase;
}

h1,
h2,
p {
  margin: 0;
}

h1 {
  color: #fff;
  font-size: clamp(2.6rem, 6vw, 5.8rem);
  font-weight: 950;
  line-height: 0.94;
}

h2 {
  color: #fff;
  font-size: clamp(1.35rem, 2.4vw, 2.1rem);
  font-weight: 950;
}

button,
input {
  font: inherit;
}

.logout-button,
.category-actions button,
.category-form button,
.delete-category-panel button,
.success-message a,
.upload-submit,
.photo-actions button {
  min-height: 46px;
  padding: 11px 18px;
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 6px;
  color: #fff;
  background: #171717;
  cursor: pointer;
  font-size: 1rem;
  font-weight: 900;
  transition:
    border-color 180ms ease,
    background 180ms ease,
    box-shadow 180ms ease,
    transform 180ms ease;
}

.logout-button:hover,
.category-actions button:hover,
.category-form button:hover,
.delete-category-panel button:hover,
.success-message a:hover,
.upload-submit:hover,
.photo-actions button:hover {
  border-color: rgba(255, 90, 18, 0.62);
  transform: translateY(-1px);
}

.quick-panel {
  display: grid;
  gap: 16px;
  margin-bottom: 30px;
  padding: 16px;
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 8px;
  background: #0b0b0b;
}

.search-bar {
  display: flex;
  min-height: 56px;
  align-items: center;
  gap: 12px;
  padding: 0 18px;
  border: 1px solid var(--color-line);
  border-radius: 8px;
  color: #b6b6ad;
  background: #050505;
}

.search-bar span {
  color: #ff6a18;
  font-size: 1.45rem;
}

.search-bar input {
  width: 100%;
  border: 0;
  color: #fff;
  background: transparent;
  font-size: 1.08rem;
  outline: none;
}

.category-tabs {
  display: flex;
  gap: 12px;
  overflow-x: auto;
}

.category-tabs button {
  flex: 0 0 auto;
  min-height: 44px;
  padding: 10px 20px;
  border: 0;
  border-radius: 6px;
  color: #fff;
  background: rgba(255, 90, 18, 0.16);
  cursor: pointer;
  font-size: 1rem;
  font-weight: 900;
  white-space: nowrap;
  transition:
    box-shadow 180ms ease,
    transform 180ms ease,
    background 180ms ease;
}

.category-tabs button.active,
.category-actions button.active,
.category-form button,
.success-message a,
.upload-submit {
  border-color: transparent;
  background: linear-gradient(180deg, #ff5d19 0%, #f0440a 100%);
  box-shadow:
    0 0 28px rgba(255, 90, 18, 0.24),
    inset 0 1px 0 rgba(255, 255, 255, 0.12);
}

.category-tabs button:hover,
.category-tabs button:focus-visible {
  outline: none;
  transform: translateY(-2px);
}

.selected-row {
  justify-content: space-between;
  gap: 16px;
  margin-bottom: 16px;
}

.category-actions {
  flex-wrap: wrap;
  justify-content: flex-end;
  gap: 10px;
}

.category-actions button:disabled {
  cursor: not-allowed;
  opacity: 0.45;
}

.category-actions .button-danger.active {
  border-color: transparent !important;
  background: linear-gradient(180deg, #ff5d19 0%, #f0440a 100%) !important;
}

.button-danger {
  border-color: rgba(255, 90, 18, 0.32) !important;
  background: #351410 !important;
}

.inline-panel {
  margin-bottom: 18px;
  padding: 16px;
  border: 1px solid var(--color-line);
  border-radius: 8px;
  background: #101010;
}

.category-form {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  align-items: end;
}

.category-form label {
  display: grid;
  flex: 1 1 260px;
  gap: 8px;
  color: #f7f7f2;
  font-size: 1rem;
  font-weight: 900;
}

.category-form input {
  min-height: 48px;
  padding: 10px 12px;
  border: 1px solid rgba(255, 255, 255, 0.14);
  border-radius: 6px;
  color: #fff;
  background: #050505;
  outline: none;
}

.delete-category-panel {
  display: grid;
  gap: 12px;
  justify-items: start;
}

.delete-category-panel p {
  color: #c9c9c2;
}

.feedback-stack {
  display: grid;
  gap: 10px;
  margin-bottom: 18px;
}

.status-message,
.error-message,
.success-message {
  padding: 13px 15px;
  border-radius: 6px;
  background: #171717;
  font-size: 1rem;
}

.error-message {
  color: #ff9a76;
}

.success-message {
  flex-wrap: wrap;
  justify-content: space-between;
  gap: 12px;
  color: #e9f7df;
  border: 1px solid rgba(114, 214, 82, 0.28);
  background: #10200d;
}

.success-message a {
  display: inline-flex;
  align-items: center;
  text-decoration: none;
}

.photo-section {
  overflow: hidden;
}

.photo-slide-enter-active,
.photo-slide-leave-active {
  transition:
    max-height 260ms ease,
    opacity 200ms ease,
    transform 260ms ease;
}

.photo-slide-enter-from,
.photo-slide-leave-to {
  max-height: 0;
  opacity: 0;
  transform: translateY(-10px);
}

.photo-slide-enter-to,
.photo-slide-leave-from {
  max-height: 1800px;
  opacity: 1;
  transform: translateY(0);
}

.photo-board {
  display: grid;
  grid-template-columns: repeat(auto-fill, 250px);
  gap: 16px;
  align-items: start;
}

.photo-tile {
  position: relative;
  width: 250px;
  height: 250px;
  overflow: hidden;
  border: 1px solid rgba(255, 255, 255, 0.09);
  border-radius: 6px;
  background: #111;
  box-shadow: 0 12px 28px rgba(0, 0, 0, 0.26);
}

.upload-tile {
  display: grid;
  place-items: center;
  align-content: center;
  gap: 4px;
  border: 1px dashed rgba(255, 90, 18, 0.72);
  color: #f7f7f2;
  cursor: pointer;
  text-align: center;
  transition:
    border-color 180ms ease,
    background 180ms ease,
    transform 180ms ease;
}

.upload-tile:hover {
  border-color: #ff7a32;
  background: #17110e;
  transform: translateY(-3px);
}

.upload-tile input {
  position: absolute;
  width: 1px;
  height: 1px;
  opacity: 0;
  pointer-events: none;
}

.tile-plus {
  position: relative;
  display: grid;
  width: 72px;
  height: 72px;
  place-items: center;
  color: #ff6a18;
  font-size: 0;
  line-height: 1;
}

.tile-plus::before,
.tile-plus::after {
  display: block;
  background: currentColor;
  content: '';
}

.tile-plus::before {
  position: absolute;
  top: 10px;
  width: 34px;
  height: 6px;
}

.tile-plus::after {
  width: 34px;
  height: 42px;
  clip-path: polygon(50% 0, 100% 42%, 70% 42%, 70% 100%, 30% 100%, 30% 42%, 0 42%);
}

.upload-tile strong,
.empty-tile strong {
  color: #fff;
  font-size: 0.9rem;
  font-weight: 950;
}

.upload-tile small,
.empty-tile small {
  color: #aaa;
  font-size: 0.72rem;
}

.photo-card img {
  display: block;
  width: 100%;
  height: 100%;
  object-fit: cover;
  filter: saturate(1.14) contrast(1.05) sepia(0.05);
  transition: transform 220ms ease;
}

.photo-card:hover img {
  transform: scale(1.04);
}

.photo-badges {
  position: absolute;
  top: 5px;
  left: 5px;
  right: 5px;
  flex-wrap: wrap;
  gap: 4px;
}

.photo-badges span {
  padding: 3px 5px;
  border-radius: 999px;
  color: #fff;
  background: rgba(255, 90, 18, 0.92);
  font-size: 0.68rem;
  font-weight: 950;
}

.photo-badges span.muted {
  background: rgba(20, 20, 20, 0.86);
}

.photo-actions {
  position: absolute;
  inset: auto 0 0;
  gap: 3px;
  padding: 5px;
  background: rgba(0, 0, 0, 0.88);
  opacity: 0;
  transform: translateY(8px);
  transition:
    opacity 160ms ease,
    transform 160ms ease;
}

.photo-card:hover .photo-actions,
.photo-card:focus-within .photo-actions {
  opacity: 1;
  transform: translateY(0);
}

.photo-actions button {
  min-height: 24px;
  flex: 1 1 0;
  padding: 3px 4px;
  border-radius: 4px;
  font-size: 0.68rem;
}

.photo-actions button:disabled {
  cursor: not-allowed;
  opacity: 0.5;
}

.empty-tile {
  display: grid;
  place-items: center;
  align-content: center;
  gap: 14px;
  border: 1px dashed rgba(255, 90, 18, 0.72);
  color: #9d9d95;
  text-align: center;
}

.empty-tile span {
  position: relative;
  display: block;
  width: 72px;
  height: 72px;
  color: transparent;
  font-size: 0;
}

.empty-tile span::before {
  display: none;
}

.empty-tile span::after {
  position: absolute;
  left: 50%;
  top: 50%;
  width: 56px;
  height: 56px;
  background: center / contain no-repeat url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 64 64'%3E%3Cpath fill='none' stroke='%23ff7a32' stroke-width='5' d='M8 18v40h40'/%3E%3Cpath fill='none' stroke='%23ff7a32' stroke-width='5' d='M16 10h40v40H16z'/%3E%3Ccircle cx='27' cy='22' r='5' fill='%23ff7a32'/%3E%3Cpath fill='%23ff7a32' d='M21 44l11-15 9 11 7-9 8 13H21z'/%3E%3C/svg%3E");
  content: '';
  transform: translate(-50%, -50%);
}

.upload-submit {
  width: 100%;
  margin-top: 18px;
  font-size: 1.08rem;
}

.compression-list {
  display: grid;
  gap: 10px;
  margin-top: 18px;
}

.compression-list article {
  display: grid;
  gap: 4px;
  padding: 12px 14px;
  border: 1px solid var(--color-line);
  border-radius: 6px;
  color: #d8d8d2;
  background: #0b0b0b;
}

.compression-list span {
  color: #aaa;
}

@media (max-width: 780px) {
  .admin-header,
  .selected-row {
    align-items: stretch;
    flex-direction: column;
  }

  .category-actions {
    justify-content: flex-start;
  }

  .photo-board {
    grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
    gap: 12px;
  }

  .photo-tile {
    width: 100%;
    height: auto;
    aspect-ratio: 1;
  }

  .photo-actions {
    opacity: 1;
    transform: none;
  }

  .photo-card {
    aspect-ratio: auto;
  }

  .photo-card img {
    height: 100%;
  }
}
</style>
