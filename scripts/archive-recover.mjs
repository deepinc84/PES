/**
 * Respectful, resumable Wayback recovery for the owner's pt-electrical.com site.
 * One request at a time, cached responses, bounded retries, and no production writes.
 */
import { mkdir, readFile, writeFile } from 'node:fs/promises'
import { createHash } from 'node:crypto'
import { dirname, join } from 'node:path'

const TARGET = '20220331192323'
const ROOT = new URL('../data/archive/', import.meta.url)
const CACHE = new URL('cache/', ROOT)
const wait = ms => new Promise(resolve => setTimeout(resolve, ms))
const hash = value => createHash('sha256').update(value).digest('hex')

await mkdir(CACHE, { recursive: true })
await mkdir(new URL('content/', ROOT), { recursive: true })

async function cachedFetch(url, attempts = 3) {
  const file = new URL(`cache/${hash(url)}.txt`, ROOT)
  try { return await readFile(file, 'utf8') } catch {}
  let error
  for (let attempt = 1; attempt <= attempts; attempt++) {
    try {
      const response = await fetch(url, { headers: { 'user-agent': 'PES-owned-site-archive-recovery/1.0' }, signal: AbortSignal.timeout(30000) })
      if (!response.ok) throw new Error(`${response.status} ${response.statusText}`)
      const text = await response.text()
      await writeFile(file, text)
      await wait(1250)
      return text
    } catch (caught) {
      error = caught
      await wait(attempt * 2500)
    }
  }
  throw new Error(`Failed after ${attempts} attempts: ${url}: ${error?.message}`)
}

const queries = ['pt-electrical.com/*', 'www.pt-electrical.com/*']
const captures = []
const discoveryFailures = []
for (const pattern of queries) {
  const params = new URLSearchParams({ url: pattern, output: 'json', from: '2020', to: '2023', filter: 'statuscode:200', fl: 'timestamp,original,statuscode,mimetype,digest' })
  // CDX accepts repeated filters; only HTML rows are retained below as a second safeguard.
  const discoveryUrl = `https://web.archive.org/cdx/search/cdx?${params}`
  try {
    const rows = JSON.parse(await cachedFetch(discoveryUrl))
    const [headers, ...values] = rows
    for (const row of values) {
      const capture = Object.fromEntries(headers.map((header, index) => [header, row[index]]))
      if (capture.mimetype === 'text/html' || capture.mimetype === 'application/xhtml+xml') captures.push(capture)
    }
  } catch (error) {
    discoveryFailures.push({ stage: 'CDX discovery', pattern, url: discoveryUrl, error: error.message })
  }
}

function canonicalOriginal(value) {
  const url = new URL(value.replace(/^http:/, 'https:'))
  url.hostname = url.hostname.replace(/^www\./, '')
  url.hash = ''
  return url.href
}
function distance(timestamp) { return Math.abs(Number(timestamp.slice(0, 8)) - Number(TARGET.slice(0, 8))) }
const selected = new Map()
for (const capture of captures) {
  const key = canonicalOriginal(capture.original)
  if (!selected.has(key) || distance(capture.timestamp) < distance(selected.get(key).timestamp)) selected.set(key, capture)
}

const garbageSegments = /\/(filter-all|healthcareindustry|maintenancepackages|24hemergencyelectricalservices)(?:\/|$)/i
const systemPath = /\/(wp-admin|wp-json|wp-login\.php|feed|xmlrpc\.php)(?:\/|$)/i
const mediaPath = /\/wp-content\/uploads\//i
function classify(url) {
  const path = new URL(url).pathname
  if (garbageSegments.test(path)) return 'WORDPRESS/TAXONOMY GARBAGE'
  if (systemPath.test(path)) return 'ADMIN/SYSTEM URL'
  if (mediaPath.test(path)) return 'ATTACHMENT/MEDIA'
  return 'REAL CONTENT PAGE'
}
function entities(text) {
  const map = { amp: '&', quot: '"', apos: "'", lt: '<', gt: '>', nbsp: ' ' }
  return text.replace(/&#(x?[0-9a-f]+);|&([a-z]+);/gi, (_, number, name) => number ? String.fromCodePoint(parseInt(number.replace(/^x/i, ''), number[0].toLowerCase() === 'x' ? 16 : 10)) : (map[name.toLowerCase()] ?? `&${name};`))
}
function plain(fragment) { return entities(fragment.replace(/<br\s*\/?>/gi, '\n').replace(/<[^>]+>/g, ' ').replace(/[ \t\r\f\v]+/g, ' ').replace(/\n\s+/g, '\n').trim()) }
function first(html, regex) { return plain((html.match(regex) ?? [,''])[1]) || null }
function all(html, regex) { return [...html.matchAll(regex)].map(match => plain(match[1])).filter(Boolean) }
function attr(tag, name) { return entities((tag.match(new RegExp(`\\s${name}=["']([^"']*)["']`, 'i')) ?? [,''])[1]) || null }
function cleanMain(html) {
  const withoutNoise = html.replace(/<!-- BEGIN WAYBACK TOOLBAR INSERT -->[\s\S]*?<!-- END WAYBACK TOOLBAR INSERT -->/gi, '').replace(/<(script|style|noscript|svg)[^>]*>[\s\S]*?<\/\1>/gi, '').replace(/<(header|nav|footer)[^>]*>[\s\S]*?<\/\1>/gi, '')
  return (withoutNoise.match(/<main[^>]*>([\s\S]*?)<\/main>/i) ?? withoutNoise.match(/<article[^>]*>([\s\S]*?)<\/article>/i) ?? withoutNoise.match(/<body[^>]*>([\s\S]*?)<\/body>/i) ?? [,withoutNoise])[1]
}
function originalLink(value, base) {
  if (!value) return null
  const replay = value.match(/^https?:\/\/web\.archive\.org\/web\/\d+(?:id_)?\/(https?:\/\/.*)$/i)
  try {
    const url = new URL(replay ? replay[1] : value, base)
    if (!/(^|\.)pt-electrical\.com$/i.test(url.hostname)) return null
    url.hostname = 'pt-electrical.com'; url.protocol = 'https:'; url.hash = ''
    return url.href
  } catch { return null }
}
function slugFor(url) { const path = new URL(url).pathname.replace(/^\/|\/$/g, ''); return path ? path.replace(/[^a-z0-9]+/gi, '-').toLowerCase() : 'home' }

const existing = JSON.parse(await readFile(new URL('pages.json', ROOT), 'utf8'))
const seedByUrl = new Map(existing.pages.map(page => [canonicalOriginal(page.originalUrl), page]))
const pages = []
const failures = [...discoveryFailures]
for (const [originalUrl, capture] of selected) {
  const classification = classify(originalUrl)
  if (classification !== 'REAL CONTENT PAGE') {
    pages.push({ ...(seedByUrl.get(originalUrl) ?? {}), originalUrl, classification, snapshot: capture.timestamp, archiveUrl: `https://web.archive.org/web/${capture.timestamp}id_/${capture.original}`, recoveryStatus: 'CLASSIFIED — CONTENT NOT EXTRACTED' })
    continue
  }
  const archiveUrl = `https://web.archive.org/web/${capture.timestamp}id_/${capture.original}`
  try {
    const html = await cachedFetch(archiveUrl)
    const main = cleanMain(html)
    const headings = [...main.matchAll(/<h([1-3])[^>]*>([\s\S]*?)<\/h\1>/gi)].map(match => ({ level: Number(match[1]), text: plain(match[2]) })).filter(item => item.text)
    const content = all(main, /<(?:p|li)[^>]*>([\s\S]*?)<\/(?:p|li)>/gi)
    const internalLinks = [...new Set([...main.matchAll(/<a\b[^>]*>/gi)].map(match => originalLink(attr(match[0], 'href'), originalUrl)).filter(Boolean))]
    const images = [...main.matchAll(/<img\b[^>]*>/gi)].map(match => ({ sourceUrl: originalLink(attr(match[0], 'src'), originalUrl) ?? attr(match[0], 'src'), alt: attr(match[0], 'alt') ?? '', classification: 'UNKNOWN — MANUAL REVIEW' })).filter(image => image.sourceUrl)
    const metaTag = (html.match(/<meta\b[^>]*name=["']description["'][^>]*>/i) ?? html.match(/<meta\b[^>]*content=["'][^"']*["'][^>]*name=["']description["'][^>]*>/i) ?? [])[0]
    const page = { originalUrl, archiveUrl, snapshot: capture.timestamp, title: first(html, /<title[^>]*>([\s\S]*?)<\/title>/i), metaDescription: metaTag ? attr(metaTag, 'content') : null, h1: headings.find(item => item.level === 1)?.text ?? null, headings, content, callsToAction: all(main, /<(?:a|button)[^>]*>([\s\S]*?)<\/(?:a|button)>/gi), internalLinks, images, classification, recoveryStatus: 'RECOVERED', currentOrPlannedRoute: seedByUrl.get(originalUrl)?.currentOrPlannedRoute ?? new URL(originalUrl).pathname, recommendedAction: seedByUrl.get(originalUrl)?.recommendedAction ?? 'MANUAL REVIEW', notes: 'Faithful automated extraction; review against replay before production use.' }
    pages.push(page)
    const markdown = [`---`, `originalUrl: ${page.originalUrl}`, `archiveUrl: ${page.archiveUrl}`, `snapshot: "${page.snapshot}"`, `classification: ${page.classification}`, `---`, '', `# ${page.h1 ?? page.title ?? new URL(originalUrl).pathname}`, '', ...page.content.map(value => `${value}\n`)].join('\n')
    await writeFile(new URL(`content/${slugFor(originalUrl)}.md`, ROOT), markdown)
  } catch (error) { failures.push({ originalUrl, archiveUrl, error: error.message }) }
}
for (const [url, seed] of seedByUrl) if (!pages.some(page => canonicalOriginal(page.originalUrl) === url)) pages.push(seed)
const counts = pages.reduce((result, page) => { result[page.classification] = (result[page.classification] ?? 0) + 1; return result }, {})
await writeFile(new URL('pages.json', ROOT), JSON.stringify({ schemaVersion: 1, generatedAt: new Date().toISOString(), targetSnapshot: TARGET, scope: queries, summary: { cdxCaptureRows: captures.length, uniqueUrls: selected.size, successfullyRecovered: pages.filter(page => page.recoveryStatus === 'RECOVERED').length, classifications: counts, retrievalFailures: failures.length }, pages }, null, 2) + '\n')
await writeFile(new URL('retrieval-failures.json', ROOT), JSON.stringify({ attemptedAt: new Date().toISOString(), failures }, null, 2) + '\n')
console.log(`Selected ${selected.size} URLs; recovered ${pages.filter(page => page.recoveryStatus === 'RECOVERED').length}; failures ${failures.length}.`)
