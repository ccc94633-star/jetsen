export const siteUrl = 'https://www.jetsen-fabshop.com.tw'

export const defaultSeo = {
  title: '杰森鐵作｜台中採光罩、欄杆扶手、客製鐵件工程',
  description:
    '杰森鐵作提供台中採光罩、欄杆扶手、隱形鐵窗與客製鐵件工程，從現場丈量到施工安裝，依需求細緻規劃。',
}

export const pageSeo = {
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

export const workSeo = {
  canopy: {
    title: '採光罩工程｜杰森鐵作',
    description:
      '重視排水、採光與結構固定，讓戶外空間更好使用。依現場尺寸規劃骨架、板材與排水方向，讓陽台、車庫與戶外區域在日常使用中更安定，也保留建築外觀的俐落比例。',
  },
  'railings-handrails': {
    title: '欄杆扶手工程｜杰森鐵作',
    description:
      '兼顧安全、握感與線條比例，適合住宅與商業空間。樓梯、陽台與戶外動線都需要穩定支撐。施工時會確認固定點、使用高度、表面處理與視覺比例，讓安全感自然融入空間。',
  },
  'designer-metalwork': {
    title: '設計師鐵件工程｜杰森鐵作',
    description:
      '配合設計圖面與現場條件，完成客製化鐵件細節。從展示架、隔屏、造型框到商業空間鐵件，依照設計圖面與現場尺度製作，控制比例、焊接、轉角與塗裝完成度。',
  },
  'invisible-grilles': {
    title: '隱形鐵窗工程｜杰森鐵作',
    description:
      '保留視覺穿透感，同時提升居家安全與防護需求。適合住宅與高樓空間，兼顧防護、視野與通風。施工前會確認窗型、固定位置與使用需求，讓防護效果穩定而不壓迫。',
  },
}

export const prerenderRoutes = [
  { path: '/', seo: pageSeo.home },
  { path: '/works', seo: pageSeo.works },
  ...Object.entries(workSeo).map(([slug, seo]) => ({ path: `/works/${slug}`, seo })),
  { path: '/story', seo: pageSeo.story },
  { path: '/contact', seo: pageSeo.contact },
]
