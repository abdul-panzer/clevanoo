// Assembles every page from src/pages/*.html plus the shared header and footer.
// Pages may contain {{> name}} for a generated fragment (case studies, jobs).
import { readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { PAGES } from '../src/data/site.js';
import { CASE_STUDIES, CATEGORIES } from '../src/data/case-studies.js';

const read = (file) => readFileSync(new URL('../' + file, import.meta.url), 'utf8');
const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const slug = (s) => s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

const ICONS = {
  'AI & Routing': '<path d="M12 3v3M12 18v3M3 12h3M18 12h3"/><rect x="7" y="7" width="10" height="10" rx="2"/><path d="M10 10h4v4h-4z"/>',
  Omnichannel: '<path d="M4 6h10v7H8l-4 3z"/><path d="M14 9h6v7l-3-2h-5v-2"/>',
  Automation: '<path d="M20 12a8 8 0 1 1-2.3-5.6"/><path d="M20 4v4h-4"/><path d="M12 8v4l3 2"/>',
  Analytics: '<path d="M4 20V4M4 20h16"/><path d="M8 16v-4M12 16V8M16 16v-6"/>',
  Apps: '<rect x="4" y="4" width="7" height="7" rx="1.5"/><rect x="13" y="4" width="7" height="7" rx="1.5"/><rect x="4" y="13" width="7" height="7" rx="1.5"/><rect x="13" y="13" width="7" height="7" rx="1.5"/>',
  Integrations: '<circle cx="6" cy="6" r="2.5"/><circle cx="18" cy="18" r="2.5"/><path d="M8.5 6H14a4 4 0 0 1 4 4v5.5M15.5 18H10a4 4 0 0 1-4-4V8.5"/>',
  Quality: '<path d="M12 3l7 3v5c0 4.5-3 8-7 10-4-2-7-5.5-7-10V6z"/><path d="M9 12l2 2 4-4"/>',
  Experience: '<circle cx="12" cy="12" r="8.5"/><path d="M8.5 14.5a4.5 4.5 0 0 0 7 0M9 10h.01M15 10h.01"/>',
  CCaaS: '<path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2z"/>',
};
const icon = (cat) => `<svg viewBox="0 0 24 24" aria-hidden="true">${ICONS[cat] || ICONS.Apps}</svg>`;

const FRAGMENTS = {
  'job-card': () => read('src/partials/job-card.html'),
  'case-filters': () => ['All', ...CATEGORIES].map((c, i) =>
    `<button type="button" class="chip-btn" data-filter="${i ? slug(c) : 'all'}" aria-pressed="${i ? 'false' : 'true'}">${esc(c)}</button>`).join('\n'),
  'case-studies': () => CASE_STUDIES.map((c) => `
<article class="case reveal" data-cat="${slug(c.category)}" aria-labelledby="case-${c.n}">
  <header class="case-head"><span class="case-ico">${icon(c.category)}</span><div><p class="case-cat">${esc(c.category)}</p><h3 id="case-${c.n}">Case Study ${c.n}: ${esc(c.title)}</h3></div></header>
  <dl class="case-body">
    <dt>Business Challenge</dt><dd>${esc(c.challenge)}</dd>
    <dt>Solution</dt><dd>${esc(c.solution)}</dd>
  </dl>
  <p class="case-tech"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9 7 4 12l5 5M15 7l5 5-5 5"/></svg><span>${esc(c.tech)}</span></p>
  <div class="case-impact"><p class="case-impact-label">Business Impact</p><p>${esc(c.impact)}</p></div>
</article>`).join('\n'),
};

const header = read('src/partials/header.html'), footer = read('src/partials/footer.html');
const legacyHead = read('../public/index.html');
const tagManager = legacyHead.match(/<!-- Google Tag Manager -->\s*(<script>[\s\S]+?<\/script>)/)?.[1] || '';
const tagManagerFallback = legacyHead.match(/<!-- Google Tag Manager \(noscript\) -->\s*(<noscript>[\s\S]+?<\/noscript>)/)?.[1] || '';

function layout(key, meta, body, apiBase, analytics, bundles) {
  let head = header.replace(`data-nav="${key}"`, `data-nav="${key}" class="is-active" aria-current="page"`);
  if (meta.group) head = head.replace(`data-nav-group="${meta.group}"`, `data-nav-group="${meta.group}" data-active="true"`);
  const isHome = key === 'home';
  const isJobUpload = key === 'job-upload';
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(meta.title)}</title>
${meta.description ? `<meta name="description" content="${esc(meta.description)}">` : ''}
${meta.path ? `<link rel="canonical" href="https://clevanoo.com${meta.path}">
<meta property="og:url" content="https://clevanoo.com${meta.path}">` : ''}
${meta.noindex ? '<meta name="robots" content="noindex">' : ''}
<meta property="og:title" content="${esc(meta.title)}">
<meta property="og:type" content="website">
<meta property="og:image" content="https://clevanoo.com/logo.webp">
<meta name="clevanoo-api" content="${esc(apiBase)}">
${analytics ? tagManager : ''}
<link rel="icon" href="/favicon.ico">
<meta name="theme-color" content="#1A2955">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
${isJobUpload ? `<link rel="stylesheet" href="/${bundles.jobUploadCss}">` : ''}
<link rel="stylesheet" href="/${bundles.css}">
</head>
<body data-page="${key}"${isHome ? '' : ' class="inner"'}>
${analytics ? tagManagerFallback : ''}
${head}
${body.trim()}
${footer}
${isHome ? `<script src="https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js" defer></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/gsap.min.js" defer></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/ScrollTrigger.min.js" defer></script>
` : ''}<script src="/${isHome ? bundles.home : bundles.inner}" defer></script>
${isJobUpload ? `<script src="/${bundles.jobUpload}" defer></script>` : ''}
</body>
</html>
`;
}


export function buildPages(output, apiBase, analytics, bundles) {
  for (const [key, meta] of Object.entries(PAGES)) {
    const template = read(`src/pages/${key}.html`);
    const body = template.replace(/\{\{>\s*([\w-]+)\s*\}\}/g, (_, name) => {
      if (!FRAGMENTS[name]) throw new Error(`Unknown fragment ${name} in ${key}`);
      return FRAGMENTS[name]();
    });
    writeFileSync(join(output, meta.file), layout(key, meta, body, apiBase, analytics, bundles));
  }
}
