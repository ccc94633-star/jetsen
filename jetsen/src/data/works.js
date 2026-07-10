import canopyImage from '@/assets/images/products-mobile/01-canopy/line_album_作品集_260702_10.webp'
import railingImage from '@/assets/images/products-mobile/02-railings-handrails/line_album_作品集_260702_33.webp'
import designerMetalworkImage from '@/assets/images/products-mobile/03-designer-metalwork/1d1ffd22-3cb6-4bef-92b1-10f9fa35f0e3.webp'
import invisibleGrilleImage from '@/assets/images/products-mobile/04-invisible-grilles/img_20210506_112030.webp'

const galleryModules = {
  canopy: import.meta.glob('../assets/images/products-mobile/01-canopy/*.webp', {
    eager: true,
    import: 'default',
  }),
  railings: import.meta.glob('../assets/images/products-mobile/02-railings-handrails/*.webp', {
    eager: true,
    import: 'default',
  }),
  metalwork: import.meta.glob('../assets/images/products-mobile/03-designer-metalwork/*.webp', {
    eager: true,
    import: 'default',
  }),
  invisibleGrilles: import.meta.glob('../assets/images/products-mobile/04-invisible-grilles/*.webp', {
    eager: true,
    import: 'default',
  }),
}

const gallery = (key, coverImage) => [
  coverImage,
  ...Object.entries(galleryModules[key])
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([, image]) => image)
    .filter((image) => image !== coverImage),
]

export const fullWorks = [
  {
    slug: 'canopy',
    title: '採光罩',
    count: '17',
    coverImage: canopyImage,
    tag: 'Canopy',
    headline: '把遮雨、採光與結構收成一條乾淨的線。',
    description: '重視排水、採光與結構固定，讓戶外空間更好使用。',
    detail:
      '依現場尺寸規劃骨架、板材與排水方向，讓陽台、車庫與戶外區域在日常使用中更安定，也保留建築外觀的俐落比例。',
    stats: [
      { value: '17', label: '作品照片' },
      { value: '3', label: '常見材質' },
      { value: '1:1', label: '現場丈量' },
    ],
    services: ['現場丈量', '骨架製作', '排水規劃', '收邊安裝'],
    gallery: gallery('canopy', canopyImage),
  },
  {
    slug: 'railings-handrails',
    title: '欄杆扶手',
    count: '7',
    coverImage: railingImage,
    tag: 'Railing',
    headline: '安全高度、握感與線條比例一次到位。',
    description: '兼顧安全、握感與線條比例，適合住宅與商業空間。',
    detail:
      '樓梯、陽台與戶外動線都需要穩定支撐。施工時會確認固定點、使用高度、表面處理與視覺比例，讓安全感自然融入空間。',
    stats: [
      { value: '7', label: '作品照片' },
      { value: '90cm', label: '常見高度' },
      { value: '360', label: '安全檢查' },
    ],
    services: ['扶手製作', '欄杆安裝', '固定補強', '表面處理'],
    gallery: gallery('railings', railingImage),
  },
  {
    slug: 'designer-metalwork',
    title: '設計師鐵件',
    count: '244',
    coverImage: designerMetalworkImage,
    tag: 'Custom',
    headline: '讓客製鐵件成為空間裡最有存在感的細節。',
    description: '配合設計圖面與現場條件，完成客製化鐵件細節。',
    detail:
      '從展示架、隔屏、造型框到商業空間鐵件，依照設計圖面與現場尺度製作，控制比例、焊接、轉角與塗裝完成度。',
    stats: [
      { value: '244', label: '作品照片' },
      { value: '100%', label: '客製製作' },
      { value: 'MM', label: '細節校正' },
    ],
    services: ['圖面溝通', '客製加工', '造型焊接', '現場安裝'],
    gallery: gallery('metalwork', designerMetalworkImage),
  },
  {
    slug: 'invisible-grilles',
    title: '隱形鐵窗',
    count: '107',
    coverImage: invisibleGrilleImage,
    tag: 'Security',
    headline: '把安全防護藏進窗景與日常通風裡。',
    description: '保留視覺穿透感，同時提升居家安全與防護需求。',
    detail:
      '適合住宅與高樓空間，兼顧防護、視野與通風。施工前會確認窗型、固定位置與使用需求，讓防護效果穩定而不壓迫。',
    stats: [
      { value: '107', label: '作品照片' },
      { value: '5cm', label: '常見間距' },
      { value: 'UV', label: '耐候考量' },
    ],
    services: ['窗型評估', '鋼索配置', '安全固定', '完工測試'],
    gallery: gallery('invisibleGrilles', invisibleGrilleImage),
  },
]

export const works = fullWorks

export const findWorkBySlug = (slug) => works.find((work) => work.slug === slug)
