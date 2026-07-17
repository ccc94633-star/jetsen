const chineseTagRules = [
  { pattern: /各式門窗|門窗|氣密窗|鐵窗|窗|門/, tag: 'Doors & Windows' },
  { pattern: /採光罩|雨遮|遮雨棚/, tag: 'Canopy' },
  { pattern: /防火門/, tag: 'Fire Doors' },
  { pattern: /欄杆|扶手/, tag: 'Railings' },
  { pattern: /隱形鐵窗|防墜|鋼索/, tag: 'Security Grilles' },
  { pattern: /設計師|鐵件|客製|訂製/, tag: 'Custom Metalwork' },
]

const englishTagBySlug = {
  canopy: 'Canopy',
  'railings-handrails': 'Railings',
  'designer-metalwork': 'Custom Metalwork',
  'invisible-grilles': 'Security Grilles',
}

const hasChinese = (value = '') => /[\u3400-\u9fff]/.test(value)

const toTitleCase = (value) =>
  value
    .replace(/[-_]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .replace(/\b[a-z]/g, (letter) => letter.toUpperCase())

export const getWorkCategoryTag = ({ tag, title, slug } = {}) => {
  const cleanTag = tag?.trim()
  if (cleanTag && !hasChinese(cleanTag)) return cleanTag

  const source = `${title ?? ''} ${cleanTag ?? ''}`
  const matchedRule = chineseTagRules.find((rule) => rule.pattern.test(source))
  if (matchedRule) return matchedRule.tag

  if (slug && englishTagBySlug[slug]) return englishTagBySlug[slug]
  if (slug) return toTitleCase(slug)

  return 'Metalwork'
}
