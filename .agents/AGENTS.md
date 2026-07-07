# AGENTS.md

## Project

This project is a Vue 3 + Vite brand website for an ironwork / metal fabrication entrepreneur named Jason.

The site should communicate craftsmanship, reliability, project experience, and a clear path for potential customers to make an inquiry.

The project currently uses JavaScript Vue single-file components, not TypeScript.

This project uses Vue Router because the site has multiple standalone pages:

- `/` for the homepage
- `/works` for project examples
- `/story` for the founder story
- `/faq` for common questions
- `/contact` for contacting Jason

The project is primarily a static marketing and portfolio website. Only add `api/` endpoints if a real backend feature is required, such as contact form handling.

## Commands

- Dev server: `npm run dev`
- Production build: `npm run build`
- Preview build: `npm run preview`

Run commands from the `jesten/` project directory.

## Collaboration Mode

The user is learning Vue development and brand website production with Codex.

Before editing files, Codex must:

1. Explain what it plans to do.
2. Explain why the change is needed.
3. Wait for user approval.
4. Keep explanations beginner-friendly and specific to the current file.

## Engineering Rules

- Use Vue 3 Composition API with `<script setup>`.
- Use Vue Router for standalone page navigation.
- Do not hand-roll page routing with `window.location.hash`.
- Follow the existing project structure before adding new folders.
- Keep backend or serverless endpoints in `api/` only when they are actually needed.
- Keep reusable UI in `src/components`.
- Keep page-level views in `src/views`.
- Do not add dependencies without explaining why.
- Prefer small, understandable changes because the user is learning.
- When the user asks for RWD/responsive changes, do not change the desktop/PC version unless they explicitly request it. If the scope is unclear, ask a question before editing.
- After relevant code changes, run `npm run build` and report whether it passed.

## Image Loading Rules

- Add `loading="lazy"` to ordinary `<img>` tags for project photos, service images, gallery images, category images, and other images below the first viewport.
- Do not lazy-load the main homepage hero image or any image that must appear immediately when the page first opens.
- For repeated image lists in Vue, add lazy loading directly on the `<img>` inside `v-for`.
- Do not render all product photos at once. Show a small first batch and use pagination, filtering, or a "load more" pattern for large galleries.
- Prefer thumbnails for gallery/list/card views when available. Use larger images only for detail views, lightboxes, or featured sections.
- Always include meaningful `alt` text for content images. Decorative images should use empty `alt=""`.

## Site Structure

The website should use this primary structure:

- Home `/`
  - Hero section
  - Service cards
  - Featured works preview
  - Simple construction process flow
  - Trust and quality cues
  - Contact call to action
- Works `/works`
  - Project categories
  - Project photos
  - Short project descriptions
  - Optional before and after comparisons
- Story `/story`
  - Jason's starting point
  - Craftsmanship attitude
  - Work values and customer communication
- FAQ `/faq`
  - Estimate questions
  - Construction questions
  - Material questions
  - What customers should prepare before contacting
- Contact `/contact`
  - LINE, phone, or contact form
  - Service area
  - Suggested inquiry details

## Design Rules

- The website should feel professional, grounded, practical, and trustworthy.
- Avoid making the site feel like an AI tool, SaaS dashboard, or generic tech portfolio.
- Visual direction should support metalwork: structure, precision, texture, workshop craft, finished projects, and practical reliability.
- Prioritize clear sections such as hero, service cards, works, process, story, FAQ, and contact.
- Use real project photos when available. If placeholders are needed, make them easy to replace later.
- The contact or inquiry path should always be easy to find.
- Make the site responsive for mobile and desktop.

## Done Means

- The page works in the browser and looks correct on desktop and mobile.
- The production build passes.
- Codex explains which files changed.
- Codex explains what the user should review or test manually.
- The site content supports the brand: craftsmanship, trust, services, works, and contact path.
