/* Build standalone SEO pages for Prompt Architect (journal/ + guide/).
 * Reads js/content.js as the single source of truth and emits static HTML.
 * Usage: node tools/build-pages.js
 */
const fs = require("fs");
const path = require("path");

const ROOT = path.join(__dirname, "..");
const SITE = "https://sajiloprompt.vercel.app";

const src = fs.readFileSync(path.join(ROOT, "js", "content.js"), "utf8");
const Content = eval(src + "\nmodule.exports = Content;");

const esc = (s) => String(s)
  .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
  .replace(/"/g, "&quot;").replace(/'/g, "&#39;");

function head({ title, description, url, jsonld }) {
  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
  <title>${esc(title)}</title>
  <meta name="description" content="${esc(description)}">
  <link rel="canonical" href="${url}">
  <link rel="llms" href="/llms.txt">
  <meta property="og:type" content="article">
  <meta property="og:site_name" content="Prompt Architect">
  <meta property="og:url" content="${url}">
  <meta property="og:title" content="${esc(title)}">
  <meta property="og:description" content="${esc(description)}">
  <meta property="og:image" content="${SITE}/og-image.png">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="${esc(title)}">
  <meta name="twitter:description" content="${esc(description)}">
  <meta name="twitter:image" content="${SITE}/og-image.png">
  <link rel="stylesheet" href="/css/pages.css">
  <link rel="icon" href="/icons/icons.svg" type="image/svg+xml">
  <link rel="apple-touch-icon" href="/icons/pwa/apple-touch-icon.png">
  <script type="application/ld+json">${JSON.stringify(jsonld)}</script>
</head>
<body class="page-shell">`;
}

const header = `
  <header class="page-header">
    <div class="page-header-inner">
      <a class="page-brand" href="/" aria-label="Prompt Architect home">
        <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2l2.09 6.26L20 9.27l-4.45 4.7L16.91 20 12 16.9 7.09 20l1.36-6.03L4 9.27l5.91-1.01z"/></svg>
        Prompt Architect
      </a>
      <nav class="page-nav" aria-label="Site">
        <a href="/">Builder</a>
        <a href="/journal/">Journal</a>  
        <a href="/guide/">Guide</a>
      </nav>
    </div>
  </header>`;

const footer = `
  <footer class="page-footer">
    <span>&copy; 2026 Prompt Architect &middot; Built by <a href="https://github.com/arundada9000" target="_blank" rel="noopener noreferrer">Arun Neupane</a></span>
    <a href="/index.html#t=PWA">Open the builder</a>
  </footer>
</body>
</html>`;

function articleJSONLD(a) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: a.title,
    description: a.description,
    datePublished: a.date,
    author: { "@type": "Person", name: "Arun Neupane", url: "https://github.com/arundada9000" },
    publisher: { "@type": "Organization", name: "Prompt Architect", url: SITE },
    image: `${SITE}/og-image.png`,
    mainEntityOfPage: `${SITE}/journal/${a.slug}.html`
  };
}

function articlePage(a) {
  const url = `${SITE}/journal/${a.slug}.html`;
  const paragraphs = a.body.map((p) => `    <p>${esc(p)}</p>`).join("\n");
  return `${head({ title: `${a.title} | Prompt Architect`, description: a.description, url, jsonld: articleJSONLD(a) })}
${header}
  <main class="page-main">
    <a class="back-link" href="/journal/">&larr; All journal posts</a>
    <article class="page-prose">
      <div class="article-meta">
        <span class="tag-pill">${esc(a.tag)}</span>
        <span>${esc(a.date)} &middot; ${a.minutes} min read</span>
      </div>
      <div class="page-hero">
        <h1>${esc(a.title)}</h1>
        <p>${esc(a.excerpt)}</p>
      </div>
${paragraphs}
    </article>
    <nav class="page-nav" aria-label="Continue">
      <a href="/journal/">More from the journal</a> &middot; <a href="/guide/">Read the guide</a>
    </nav>
  </main>
${footer}`;
}

function journalIndex() {
  const url = `${SITE}/journal/`;
  const jsonld = {
    "@context": "https://schema.org",
    "@type": "Blog",
    name: "Prompt Architect Journal",
    description: "Practical articles on writing precise, production-ready development prompts for AI coding assistants.",
    url,
    blogPost: Content.journal.map((a) => ({
      "@type": "BlogPosting",
      headline: a.title,
      datePublished: a.date,
      url: `${SITE}/journal/${a.slug}.html`
    }))
  };
  const cards = Content.journal.map((a) => `
      <a class="journal-card" href="/journal/${esc(a.slug)}.html">
        <span class="tag-pill">${esc(a.tag)}</span>
        <h3>${esc(a.title)}</h3>
        <p>${esc(a.excerpt)}</p>
        <span class="card-date">${esc(a.date)} &middot; ${a.minutes} min read</span>
      </a>`).join("\n");
  return `${head({ title: "Journal | Prompt Architect", description: "Practical articles on writing precise, production-ready development prompts for AI coding assistants.", url, jsonld })}
${header}
  <main class="page-main">
    <div class="page-hero">
      <h1>The Prompt Architect journal</h1>
      <p>Practical notes on writing precise, production-ready development prompts for AI coding assistants, and on the habits that make generated builds reliable.</p>
    </div>
    <div class="journal-list">
${cards}
    </div>
    <nav class="page-prose" style="margin-top:40px">
      <p>New to prompt design? Start with the <a href="/guide/">full guide</a>, then <a href="/">build your own prompt</a>.</p>
    </nav>
  </main>
${footer}`;
}

function guidePage() {
  const g = Content.guide;
  const url = `${SITE}/guide/`;
  const jsonld = {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name: g.title,
    description: g.description,
    url,
    author: { "@type": "Person", name: "Arun Neupane", url: "https://github.com/arundada9000" }
  };
  const cards = g.sections.map((s) => `
    <section class="guide-card">
      <h2>${esc(s.heading)}</h2>
      <p>${esc(s.text)}</p>
      <ul>
        ${s.list.map((li) => `<li>${esc(li)}</li>`).join("\n        ")}
      </ul>
    </section>`).join("\n");
  const tips = g.tips.map((t) => `<li>${esc(t)}</li>`).join("\n      ");
  return `${head({ title: `${g.title} | Prompt Architect`, description: g.description, url, jsonld })}
${header}
  <main class="page-main">
    <div class="page-hero">
      <h1>${esc(g.title)}</h1>
      <p>${esc(g.description)}</p>
    </div>
    <div class="page-prose">
      ${g.intro.map((p) => `<p>${esc(p)}</p>`).join("\n      ")}
    </div>
${cards}
    <section class="tip-box page-prose">
      <h2>Five habits that raise prompt quality</h2>
      <ol>
      ${tips}
      </ol>
    </section>
  </main>
${footer}`;
}

function llmsFull() {
  const L = [];
  L.push("# Prompt Architect");
  L.push("");
  L.push("Prompt Architect is a free, offline-first prompt generator that assembles precise, production-ready development prompts for AI coding assistants. Pick requirement checkboxes, tune tech-stack dropdowns, and export one clean structured spec in Markdown, JSON, YAML, or plain text. No account, no tracking, no sign-up.");
  L.push("");
  L.push(`- [Prompt Architect builder](${SITE}/): the interactive prompt builder`);
  L.push(`- [Guide](${SITE}/guide/): the full walkthrough`);
  L.push(`- [Journal](${SITE}/journal/): practical articles on writing development prompts`);
  L.push("");
  L.push("## The tool");
  L.push("");
  L.push("The builder turns reusable requirements into one clean, production-ready development prompt. Requirements are organised into 22 sections covering security, testing, performance, accessibility, PWA, SEO/AEO/GEO, deployment, CI/CD, design systems, and development workflow rules. Each section offers checkboxes (rules the prompt states verbatim), dropdowns (facts such as framework versions with rationale), and free-text fields. Conditional sections appear automatically; for example, picking PWA as the project type reveals the PWA requirements. The prompt preview updates live in Markdown, JSON, YAML, and plain text. Presets, prompt history (last 20), and undo/redo (last 50 steps) make work reusable, and any configuration can be shared as a URL hash. The app is an installable offline PWA with custom 404 and offline pages. Generated prompts enforce a strict quality bar: no em dashes and no emoji, plus explicit security, performance, accessibility, and documentation expectations drawn from the selected checkboxes.");
  L.push("");
  const g = Content.guide;
  L.push(`## ${g.title}`);
  L.push("");
  L.push(`> ${g.description}`);
  L.push("");
  for (const p of g.intro) L.push(p + "");
  L.push("");
  for (const s of g.sections) {
    L.push(`### ${s.heading}`);
    L.push("");
    L.push(s.text);
    L.push("");
    for (const li of s.list) L.push(`- ${li}`);
    L.push("");
  }
  L.push("### Five habits that raise prompt quality");
  L.push("");
  for (let i = 0; i < g.tips.length; i++) L.push(`${i + 1}. ${g.tips[i]}`);
  L.push("");
  L.push("## Journal");
  L.push("");
  L.push("The journal publishes practical articles on writing precise, production-ready development prompts for AI coding assistants, and on the habits that make AI-generated builds reliable.");
  L.push("");
  for (const a of Content.journal) {
    L.push(`### ${a.title}`);
    L.push("");
    L.push(`URL: ${SITE}/journal/${a.slug}.html`);
    L.push("");
    L.push(`> ${a.excerpt}`);
    L.push("");
    for (const p of a.body) L.push(p + "");
    L.push("");
  }
  return L.join("\n") + "\n";
}

fs.mkdirSync(path.join(ROOT, "journal"), { recursive: true });
fs.mkdirSync(path.join(ROOT, "guide"), { recursive: true });

fs.writeFileSync(path.join(ROOT, "journal", "index.html"), journalIndex());
for (const a of Content.journal) {
  fs.writeFileSync(path.join(ROOT, "journal", `${a.slug}.html`), articlePage(a));
}
fs.writeFileSync(path.join(ROOT, "guide", "index.html"), guidePage());
fs.writeFileSync(path.join(ROOT, "llms-full.txt"), llmsFull());

console.log(`emitted journal/index.html, ${Content.journal.length} article pages, guide/index.html, llms-full.txt`);