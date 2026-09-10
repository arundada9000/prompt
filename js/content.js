/**
 * Content -- Journal articles and reference material.
 * Single source of truth for the journal. The build tool tools/build-pages.js
 * reads this file to emit standalone SEO pages under journal/ and guide/.
 */

const Content = {
  journal: [
    {
      slug: "write-prompts-that-get-better-output",
      title: "Write prompts that get better output",
      tag: "Tips",
      date: "Sep 2026",
      minutes: 4,
      description: "The difference between a mediocre and an excellent AI build is rarely the model. It is the prompt. Five concrete habits that raise output quality immediately.",
      excerpt: "The difference between a mediocre and an excellent AI build is rarely the model. It is the prompt.",
      body: [
        "Be explicit about the outcome. 'Build a dashboard' invites interpretation; 'build an admin dashboard with role-based views, empty states, and a 404 page' sets a contract. Every sentence your prompt adds narrows the space of plausible-but-wrong outputs.",
        "Give the assistant ownership. Phrases like 'you are the lead engineer on this project' change tone and thoroughness. The prompt becomes a brief, not a request.",
        "Stake out boundaries before they become problems. Say what not to do (no emoji, no em dashes, no fake buttons) up front. Prevention beats correction every time, especially in one-shot generations.",
        "Define 'done'. Production-ready means different things to different models. If you want validation, tests, and documented decisions, say so in the same sentence.",
        "Finally, iterate. Run the prompt, read the output like a reviewer, and tighten one section a week. Prompt quality compounds the same way code quality does."
      ]
    },
    {
      slug: "the-checklists-behind-a-production-grade-build",
      title: "The checklists behind a production-grade build",
      tag: "Method",
      date: "Sep 2026",
      minutes: 5,
      description: "Security, testing, performance, and documentation are not optional extras. They are the difference between working and worth shipping.",
      excerpt: "Security, testing, performance, and documentation are not optional extras. They are the difference between working and worth shipping.",
      body: [
        "Most AI coding tools are excellent at writing code and poor at remembering constraints. If your project needs input validation, XSS protection, and a CSP, the model will not infer that from 'a nice website'. Checklists exist because humans forget too.",
        "The sections in this generator are deliberately granular. Each checkbox maps to a requirement the generated prompt can state verbatim, so the assistant knows exactly what it is being graded on.",
        "Start small. A first run with five checkboxes teaches you how the model responds to your wording. Expand the checklist as you learn which requirements actually change the output and which never get read.",
        "Use dropdowns for facts, checkboxes for rules. 'Vite + React' is a fact; 'no em dashes' is a rule. Models follow rules they were explicitly told and guess at facts they were not."
      ]
    },
    {
      slug: "from-checklist-to-spec-exporting-for-different-ai-tools",
      title: "From checklist to spec: exporting for different AI tools",
      tag: "Workflow",
      date: "Aug 2026",
      minutes: 3,
      description: "Markdown for chat models, JSON for pipelines, YAML for config-heavy tools. Match the export format to the context window and the tool.",
      excerpt: "Markdown for chat models, JSON for pipelines, YAML for config-heavy tools. Match the format to the context window.",
      body: [
        "Markdown is the safe default. Chat assistants (Claude, ChatGPT, Gemini) parse headings and bullets well, and the generated prompt doubles as human-readable documentation.",
        "JSON shines in pipelines. If you are generating prompts programmatically, a structured object keeps the requirements machine-checkable and lets you version-control each field.",
        "YAML is the config-lover's format. It is denser than JSON, reads like a spec sheet, and suits tools where prompts are stored next to other configuration.",
        "Whatever format you choose, keep the same information: context, requirements, and non-negotiables. The format should never be the excuse for a shorter prompt."
      ]
    },
    {
      slug: "prompt-security-your-first-layer-of-defense",
      title: "Prompt security: your first layer of defense",
      tag: "Security",
      date: "Sep 2026",
      minutes: 4,
      description: "Injection, data leakage, and hallucinated dependencies are real risks in AI-generated code. Fold these requirements into every prompt.",
      excerpt: "Injection, data leakage, and hallucinated dependencies are real risks in AI-generated code. Fold these requirements into every prompt.",
      body: [
        "AI assistants happily produce code that echoes secrets, calls packages that do not exist, or trusts untrusted input. The cheapest mitigation is to say no up front as a requirement, not as a review comment.",
        "State it plainly: never log or print secrets, keys, or tokens; never commit credentials; never suggest unverified dependencies. Models comply with explicit prohibitions far better than with good intentions.",
        "Ask for input validation and authorization on every public endpoint, and for a Content Security Policy on any client-side app. These phrases show up in the checklist output of this generator because they belong there.",
        "Treat AI output like a pull request from a stranger. A prompt that demands a review pass, a test run, and a security scan before merge is the difference between shipping features and shipping footguns."
      ]
    },
    {
      slug: "performance-requirements-models-actually-follow",
      title: "Performance requirements models actually follow",
      tag: "Performance",
      date: "Aug 2026",
      minutes: 4,
      description: "Vague goals like 'make it fast' do nothing. Objective budgets, measured checkpoints, and code-split rules produce measurable results.",
      excerpt: "Vague goals like 'make it fast' do nothing. Objective budgets, measured checkpoints, and code-split rules produce measurable results.",
      body: [
        "'Make it fast' is a wish, not a requirement. A generated build with no performance constraints ships images at 10 MB, unvendored bundles, and blocking fonts, and nobody can argue.",
        "Give numbers. LCP under 2.5 seconds, total transfer under 1 MB on mobile, fewer than 12 render-blocking requests. A model can target a budget it was given.",
        "Name the mechanics you care about: code-splitting lazy routes, image `srcset` and AVIF/WebP, font subsetting, and `content-visibility` for off-screen sections.",
        "Ask for a measurable pass at the end. A short performance checklist run and reported before/after numbers are the only reliable signal that the constraint was honored."
      ]
    },
    {
      slug: "accessibility-built-into-the-prompt",
      title: "Accessibility built into the prompt",
      tag: "Accessibility",
      date: "Aug 2026",
      minutes: 3,
      description: "WCAG compliance is not a nice-to-have. Landmark roles, focus rings, contrast, and keyboard paths survive generation only if you request them.",
      excerpt: "WCAG compliance is not a nice-to-have. Landmark roles, focus rings, contrast, and keyboard paths survive generation only if you request them.",
      body: [
        "Accessibility retrofits are expensive and less effective than generated-first accessibility. One requirement sentence up front beats three fixing commits later.",
        "Ask for semantic landmarks, logical heading order, visible focus states, and full keyboard operability for menus, forms, and modals.",
        "Contrast is a numeric problem. AA contrast (4.5:1 for text) and touch targets of at least 44 CSS pixels are the kinds of measurable constraints models can honor.",
        "Close with an audit ask: run a quick automated check and list any remaining items instead of silently ignoring them."
      ]
    },
    {
      slug: "designing-a-design-system-with-ai",
      title: "Designing a design system with AI",
      tag: "Design systems",
      date: "Jul 2026",
      minutes: 5,
      description: "Tokens, primitives, and components. A prompt that requests a real design system yields interfaces that look deliberate instead of random.",
      excerpt: "Tokens, primitives, and components. A prompt that requests a real design system yields interfaces that look deliberate instead of random.",
      body: [
        "The fastest tell of AI-generated UI is inconsistency: three spacing scales, ten font sizes, and neon purples that do not belong together. A design system requirement fixes this at the source.",
        "Ask for design tokens first (color, spacing, typography, radii, elevation) drawn from a defined palette, then primitives (Button, Input, Card, Modal), then page composition.",
        "Name a platform language so the model stays in bounds, whether that is iOS-era HIG cards and rounded corners, Material, or a brutalist grid.",
        "Require dark mode as a twin of light mode, not an afterthought, and ask for hover, active, and disabled states for every interactive element.",
        "The payoff is compounding: components built on tokens lead to fewer one-off exceptions and an interface that looks like one designer held the pen."
      ]
    },
    {
      slug: "pwa-thinking-outside-the-tab",
      title: "PWA: thinking outside the tab",
      tag: "PWA",
      date: "Jul 2026",
      minutes: 4,
      description: "Installable, offline, and fast. What a service worker and manifest actually commit to, and the prompt lines that make them real.",
      excerpt: "Installable, offline, and fast. What a service worker and manifest actually commit to, and the prompt lines that make them real.",
      body: [
        "A PWA is a promise with three clauses: it installs like an app, opens offline, and loads fast on repeat visits. Each clause maps to concrete files: manifest, service worker, and a runtime cache strategy.",
        "The manifest needs a name, a theme color with backdrop, icons in 192 and 512 (plus maskable), and a start URL. The service worker needs a precache list, a network-first update path, and an offline fallback page.",
        "Offline is the contract people notice first. Precache the app shell, route navigations to the cache, and serve a friendly offline page when the network is missing.",
        "Ask the model to verify installation criteria and the offline flow in the audit section of the prompt. Installability regressions are silent and expensive to find later."
      ]
    },
    {
      slug: "seo-and-generative-engine-optimization",
      title: "SEO in the age of generative answer engines",
      tag: "SEO",
      date: "Jul 2026",
      minutes: 5,
      description: "For SEO you need meta, structured data, and crawlable pages. For AEO and GEO you need your content to be quotable by machines.",
      excerpt: "For SEO you need meta, structured data, and crawlable pages. For AEO and GEO you need your content to be quotable by machines.",
      body: [
        "Classic SEO still runs on fundamentals: unique titles, meta descriptions, canonical URLs, semantic headings, fast pages, and a sitemap. Generated apps routinely skip all of them unless the prompt insists.",
        "Structured data is where generation shines. JSON-LD for organization, website, and article scope makes a site a better candidate for rich results and entity recognition.",
        "Answer engines (AEO) quote your content, so write for extraction: a direct answer in the first paragraph, precise facts, and plain language. GEO is the same discipline aimed at model training and retrieval pipelines.",
        "If SEO matters at all, require it in the prompt: one title and description per page, one canonical, one h1 per page, alt text everywhere, and a changelog-friendly sitemap. Gratuitous meta makes machines trust the page."
      ]
    },
    {
      slug: "version-control-for-your-prompts",
      title: "Version control for your prompts",
      tag: "Workflow",
      date: "Jun 2026",
      minutes: 3,
      description: "Prompts change like code. Keep them reviewed, diffed, and exported so a great build is reproducible next week.",
      excerpt: "Prompts change like code. Keep them reviewed, diffed, and exported so a great build is reproducible next week.",
      body: [
        "A prompt that produced a great result is an asset. The moment it lives only in a chat window, it is a liability you cannot diff, share, or rerun.",
        "Export every good run (the app makes this one click), name it by project and date, and drop it in the repository next to the code it generated.",
        "Write prompts like pull requests: small changes, described intent, and a reason. Future you will want to know why 'enforce CSP' became 'add a nonce policy'.",
        "When a build regresses, diff the prompt first. Models change, but your requirements should not be the moving part."
      ]
    }
  ],
  guide: {
    title: "The Prompt Architect guide",
    description: "How to assemble, tune, export, and reuse precise development prompts for AI coding assistants.",
    intro: [
      "Prompt Architect turns reusable requirements into one clean, production-ready development prompt. This guide covers the full workflow, from first click to repeatable presets."
    ],
    sections: [
      {
        heading: "Start with the project card",
        text: "Give the project a name and the surface type on the left. The type may reveal extra sections (choose PWA and the platform section appears by itself). Type a quick description of what you are building, then select a tech stack from the dropdowns. Each dropdown shows a short rationale under the select.",
        list: [
          "Name and type are always included in the output.",
          "Description is free text; the assistant treats it as context, so write full sentences.",
          "Dropdowns give you presets only, with rationale shown for each."
        ]
      },
      {
        heading: "Mark requirements across the sections",
        text: "The sidebar lists all sections with a running count. Each checkbox is a requirement the generated prompt states verbatim. There is no wrong combination, but fewer, precise boxes often outperform a wall of boxes.",
        list: [
          "Use 'Select all' in a section when it fully applies.",
          "Balance rule-style boxes (no em dashes) with fact-style dropdowns (Vite + React).",
          "Check the workflow section so the assistant plans, tracks, and commits properly."
        ]
      },
      {
        heading: "Reviews and previews",
        text: "The preview pane updates live in Markdown by default. Switch to JSON or YAML for pipelines and config-heavy tools. Use fullscreen to inspect long prompts before exporting.",
        list: [
          "Markdown for chat assistants, JSON for automation, YAML for config lovers.",
          "Fullscreen (`Ctrl/Cmd + Shift + F`) helps you read the whole brief.",
          "The character count in the footer is a rough context-window sanity check."
        ]
      },
      {
        heading: "Export, copy, and save",
        text: "Copy to clipboard or download the prompt. Save any combination as a preset, and export your presets as a JSON file to back them up or move machines.",
        list: [
          "Paste and match lets you re-import an older prompt to restore all selections.",
          "Every good run belongs in your repository next to the code it generated.",
          "The footer counter tracks how many prompts you have generated."
        ]
      },
      {
        heading: "History, undo, and sharing",
        text: "Prompt history keeps the last 20 generated prompts, undo/redo covers the last 50 edits, and any configuration fits in the URL hash for sharing.",
        list: [
          "Open history with `Ctrl/Cmd + Shift + H` to recall any generated prompt.",
          "Supply the full URL and the recipient sees the same selections.",
          "Search filters every section, checkbox, dropdown, and text field at once."
        ]
      }
    ],
    tips: [
      "Be explicit about the outcome; every sentence narrows the space of plausible-but-wrong outputs.",
      "Use dropdowns for facts and checkboxes for rules.",
      "Prevention beats correction: state what not to do before it happens.",
      "Iterate weekly and tighten one section at a time.",
      "Read the output like a reviewer, not like a user."
    ]
  }
};