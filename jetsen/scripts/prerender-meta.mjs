import { mkdir, readFile, writeFile } from 'node:fs/promises'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

import { prerenderRoutes, siteUrl } from '../src/data/seo.js'

const distDirectory = fileURLToPath(new URL('../dist/', import.meta.url))
const templatePath = fileURLToPath(new URL('../dist/index.html', import.meta.url))
const template = await readFile(templatePath, 'utf8')

const escapeHtml = (value) =>
  value.replaceAll('&', '&amp;').replaceAll('"', '&quot;').replaceAll('<', '&lt;').replaceAll('>', '&gt;')

const upsertHeadTag = (html, pattern, tag) =>
  pattern.test(html) ? html.replace(pattern, tag) : html.replace('</head>', `  ${tag}\n</head>`)

const renderPage = (path, seo) => {
  const pageUrl = new URL(path.replace(/^\//, ''), `${siteUrl}/`).href
  const title = `<title>${escapeHtml(seo.title)}</title>`
  const description = `<meta name="description" content="${escapeHtml(seo.description)}">`
  const ogTitle = `<meta property="og:title" content="${escapeHtml(seo.title)}">`
  const ogDescription = `<meta property="og:description" content="${escapeHtml(seo.description)}">`
  const ogUrl = `<meta property="og:url" content="${pageUrl}">`
  const canonical = `<link rel="canonical" href="${pageUrl}">`
  const twitterTitle = `<meta name="twitter:title" content="${escapeHtml(seo.title)}">`
  const twitterDescription = `<meta name="twitter:description" content="${escapeHtml(seo.description)}">`

  let html = template.replace(/<title>[^<]*<\/title>/i, title)
  html = upsertHeadTag(html, /<meta\s+name="description"[^>]*>/i, description)
  html = upsertHeadTag(html, /<meta\s+property="og:title"[^>]*>/i, ogTitle)
  html = upsertHeadTag(html, /<meta\s+property="og:description"[^>]*>/i, ogDescription)
  html = upsertHeadTag(html, /<meta\s+property="og:url"[^>]*>/i, ogUrl)
  html = upsertHeadTag(html, /<link\s+rel="canonical"[^>]*>/i, canonical)
  html = upsertHeadTag(html, /<meta\s+name="twitter:title"[^>]*>/i, twitterTitle)
  html = upsertHeadTag(html, /<meta\s+name="twitter:description"[^>]*>/i, twitterDescription)

  return html
}

for (const { path, seo } of prerenderRoutes) {
  const outputPath = path === '/' ? join(distDirectory, 'index.html') : join(distDirectory, path, 'index.html')

  await mkdir(dirname(outputPath), { recursive: true })
  await writeFile(outputPath, renderPage(path, seo), 'utf8')
}

console.log(`Generated static SEO HTML for ${prerenderRoutes.length} routes.`)
