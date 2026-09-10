/**
 * FEATURES -- Section definitions for the prompt builder.
 *
 * Each section has:
 *   id        -- unique section identifier
 *   title     -- display name
 *   desc      -- short description
 *   radio     -- (optional) true if items are mutually exclusive
 *   showWhen  -- (optional) { field, values } for conditional visibility
 *   items     -- array of items (see formats below)
 *
 * Item formats:
 *   Checkbox: ["id", "Title", "Description"]
 *   Dropdown: { id, type:"dropdown", title, placeholder, options:[[value,label,desc],...] }
 *   Text:     { id, type:"text", title, placeholder }
 */

const FEATURES = [

  /* ========================================================================
     1. Project quality
     ======================================================================== */
  {
    id: "quality",
    title: "Project quality",
    desc: "Core engineering and delivery standards.",
    items: [
      [
        "production",
        "Production-quality implementation",
        "Build a real production-ready product, not a throwaway prototype."
      ],
      [
        "best-practices",
        "Best coding practices",
        "Use modern, idiomatic, maintainable practices appropriate to the chosen stack."
      ],
      [
        "modular",
        "Modular architecture",
        "Keep functionality modular, cohesive, and easy to extend."
      ],
      [
        "reusable",
        "Reusable components",
        "Prefer reusable components, utilities, and patterns over duplication."
      ],
      [
        "polished",
        "Polished implementation",
        "Refine details, edge cases, states, interactions, and visual consistency."
      ]
    ]
  },

  /* ========================================================================
     2. Design system
     ======================================================================== */
  {
    id: "design",
    title: "Design system",
    desc: "Premium visual language with iOS HIG-inspired principles.",
    items: [
      [
        "ios-hig",
        "iOS Human Interface Guidelines inspired",
        "Use principles of clarity, hierarchy, depth, consistency, touch-friendly controls, and purposeful motion while retaining an original identity."
      ],
      [
        "design-system",
        "Professional design system",
        "Establish consistent design tokens for spacing, typography, color, elevation, radii, and components."
      ],
      [
        "no-inline",
        "No inline hardcoded CSS",
        "Do not scatter inline hardcoded styling. Centralize reusable styling and design tokens."
      ],
      [
        "aesthetic",
        "Impeccable project aesthetic",
        "Create a distinctive, coherent, premium visual identity rather than a generic AI-looking interface."
      ],
      [
        "pro-ux",
        "Impeccable UI/UX professional skills",
        "Apply expert product-design judgment, hierarchy, composition, usability, interaction design, and refinement throughout."
      ]
    ]
  },

  /* ========================================================================
     3. Tech stack
     ======================================================================== */
  {
    id: "techstack",
    title: "Tech stack",
    desc: "Define the exact technologies, frameworks, and tooling for the project.",
    items: [
      {
        id: "framework",
        type: "dropdown",
        title: "Framework",
        placeholder: "Select a framework",
        options: [
          ["react", "React", "A declarative, component-based library for building user interfaces."],
          ["vue", "Vue", "A progressive framework for building UIs with a reactive data model."],
          ["svelte", "Svelte", "A compile-time framework that shifts work to the build step for minimal runtime."],
          ["angular", "Angular", "A platform for building mobile and desktop apps with TypeScript."],
          ["next", "Next.js", "A React framework for production with server rendering, routing, and API routes."],
          ["nuxt", "Nuxt", "A Vue framework for production with server rendering, routing, and auto-imports."],
          ["astro", "Astro", "A web framework for content-driven sites with island architecture."],
          ["vanilla", "Vanilla JS", "No framework. Use plain JavaScript with Web APIs."]
        ]
      },
      {
        id: "language",
        type: "dropdown",
        title: "Language",
        placeholder: "Select a language",
        options: [
          ["typescript", "TypeScript", "A typed superset of JavaScript that catches errors at compile time."],
          ["javascript", "JavaScript", "The standard language of the web. No type annotations."]
        ]
      },
      {
        id: "styling",
        type: "dropdown",
        title: "Styling approach",
        placeholder: "Select a styling approach",
        options: [
          ["tailwind", "Tailwind CSS", "A utility-first CSS framework for rapid UI development."],
          ["css-modules", "CSS Modules", "Locally scoped CSS classes imported as modules to avoid naming conflicts."],
          ["styled-components", "Styled Components", "CSS-in-JS using tagged template literals for component-scoped styles."],
          ["sass", "Sass / SCSS", "A CSS preprocessor with variables, nesting, mixins, and functions."],
          ["vanilla-css", "Vanilla CSS", "Plain CSS with custom properties and modern layout techniques."],
          ["less", "Less", "A CSS preprocessor with variables, mixins, and functions."]
        ]
      },
      {
        id: "state-mgmt",
        type: "dropdown",
        title: "State management",
        placeholder: "Select state management",
        options: [
          ["zustand", "Zustand", "A small, fast, hook-based state manager for React."],
          ["jotai", "Jotai", "An atomic state management approach for React."],
          ["redux-toolkit", "Redux Toolkit", "The official, opinionated toolset for Redux state management."],
          ["pinia", "Pinia", "The official, type-safe store for Vue."],
          ["vuex", "Vuex", "A centralized state management for Vue applications."],
          ["context-api", "Context API", "Built-in React context for lightweight state sharing."],
          ["signals", "Signals", "Fine-grained reactive primitives (framework-dependent)."],
          ["none", "None", "No external state management. Use local component state."]
        ]
      },
      {
        id: "pkg-manager",
        type: "dropdown",
        title: "Package manager",
        placeholder: "Select a package manager",
        options: [
          ["npm", "npm", "The default Node.js package manager."],
          ["yarn", "Yarn", "A fast, reliable, and secure dependency management tool."],
          ["pnpm", "pnpm", "A fast, disk-space-efficient package manager using hard links."],
          ["bun", "Bun", "A fast JavaScript runtime and package manager."]
        ]
      },
      {
        id: "build-tool",
        type: "dropdown",
        title: "Build tool",
        placeholder: "Select a build tool",
        options: [
          ["vite", "Vite", "A fast development server and build tool with native ES module support."],
          ["webpack", "Webpack", "A static module bundler for modern JavaScript applications."],
          ["turbopack", "Turbopack", "An incremental bundler optimized for JavaScript and TypeScript."],
          ["esbuild", "esbuild", "An extremely fast JavaScript and CSS bundler and minifier."],
          ["rollup", "Rollup", "A module bundler for JavaScript that compiles small pieces of code."],
          ["parcel", "Parcel", "A zero-configuration build tool for the web."]
        ]
      }
    ]
  },

  /* ========================================================================
     4. Interaction
     ======================================================================== */
  {
    id: "interaction",
    title: "Interaction",
    desc: "Make the interface responsive, tactile, and alive.",
    items: [
      [
        "haptics",
        "Haptic feedback",
        "Use appropriate haptic feedback where supported without making it distracting."
      ],
      [
        "touch",
        "Touch interactions",
        "Design comfortable touch targets and mobile-first interactions."
      ],
      [
        "sound",
        "Sound feedback",
        "Use subtle, purposeful sound only where it improves the experience, with user control."
      ],
      [
        "micro",
        "Microinteractions",
        "Use meaningful microinteractions for feedback, state changes, navigation, and confirmation."
      ],
      [
        "motion",
        "Purposeful motion",
        "Use smooth, restrained animations and transitions that communicate hierarchy and state."
      ]
    ]
  },

  /* ========================================================================
     5. Responsiveness & accessibility
     ======================================================================== */
  {
    id: "responsive",
    title: "Responsiveness & accessibility",
    desc: "Make the product usable across devices and abilities.",
    items: [
      [
        "responsive",
        "Full responsiveness",
        "Support mobile, tablet, laptop, and large desktop layouts intentionally."
      ],
      [
        "accessibility",
        "Accessibility",
        "Follow accessibility best practices with semantic HTML, keyboard support, focus states, contrast, labels, and appropriate ARIA."
      ],
      [
        "reduced",
        "Reduced motion",
        "Respect prefers-reduced-motion and never rely on motion for essential information."
      ],
      [
        "fontsize",
        "Font-size considerations",
        "Use readable, scalable typography and avoid fragile fixed-size text."
      ],
      [
        "language",
        "Language readiness",
        "Structure user-facing text so language changes and localization can be supported cleanly."
      ]
    ]
  },

  /* ========================================================================
     6. Themes
     ======================================================================== */
  {
    id: "themes",
    title: "Themes",
    desc: "Flexible visual system instead of hardcoded single-theme styling.",
    items: [
      [
        "multi",
        "Multiple themes",
        "Support multiple cohesive visual themes through centralized design tokens."
      ],
      [
        "custom",
        "Custom theme support",
        "Allow theme values to be customized without rewriting components."
      ],
      [
        "switch",
        "Theme switching",
        "Provide a polished theme switching experience where appropriate."
      ],
      [
        "system",
        "System theme preference",
        "Respect operating-system light/dark preference where appropriate."
      ]
    ]
  },

  /* ========================================================================
     7. Pages & states
     ======================================================================== */
  {
    id: "states",
    title: "Pages & states",
    desc: "Treat every important state as part of the product design.",
    items: [
      [
        "404",
        "Aesthetic 404 page",
        "Create a custom 404 page matching the project identity with useful navigation."
      ],
      [
        "errors",
        "Custom error pages",
        "Design polished application/server error pages appropriate to the project."
      ],
      [
        "loading",
        "Loading states",
        "Provide intentional loading, skeleton, or progress states."
      ],
      [
        "empty",
        "Empty states",
        "Design helpful empty states rather than blank or confusing screens."
      ],
      [
        "offline",
        "Offline/network states",
        "Handle offline and network failures gracefully where relevant."
      ]
    ]
  },

  /* ========================================================================
     8. Security
     ======================================================================== */
  {
    id: "security",
    title: "Security",
    desc: "Protect the application and its users from common vulnerabilities.",
    items: [
      [
        "input-validation",
        "Input validation and sanitization",
        "Validate and sanitize all user input on both client and server. Never trust client-side data. Use schema validation libraries where appropriate."
      ],
      [
        "xss",
        "XSS protection",
        "Prevent cross-site scripting by escaping output, using safe APIs, and applying Content Security Policy headers."
      ],
      [
        "csrf",
        "CSRF protection",
        "Implement anti-CSRF tokens for state-changing operations. Use SameSite cookies and verify request origins."
      ],
      [
        "csp",
        "Content Security Policy",
        "Define and enforce a strict Content Security Policy to restrict resource loading and prevent code injection."
      ],
      [
        "auth-patterns",
        "Secure authentication patterns",
        "Use proven authentication libraries. Hash passwords with bcrypt or argon2. Implement secure session management with HttpOnly, Secure, SameSite cookies."
      ],
      [
        "env-vars",
        "Environment variable handling",
        "Never hardcode secrets, API keys, or credentials. Load configuration from environment variables. Validate required variables at startup."
      ],
      [
        "rate-limit",
        "Rate limiting",
        "Implement rate limiting on API endpoints and sensitive operations to prevent abuse, brute-force attacks, and resource exhaustion."
      ],
      [
        "https",
        "HTTPS enforcement",
        "Enforce HTTPS for all traffic. Set HSTS headers. Redirect HTTP to HTTPS."
      ]
    ]
  },

  /* ========================================================================
     9. Testing
     ======================================================================== */
  {
    id: "testing",
    title: "Testing",
    desc: "Write tests that catch regressions and document expected behavior.",
    items: [
      [
        "unit-tests",
        "Unit tests",
        "Write unit tests for individual functions, utilities, and components. Aim for meaningful coverage of business logic, not arbitrary percentages."
      ],
      [
        "integration-tests",
        "Integration tests",
        "Write integration tests that verify modules work together correctly, including data flow, API calls, and component interactions."
      ],
      [
        "e2e-tests",
        "End-to-end tests",
        "Write E2E tests that simulate real user workflows in a browser environment. Cover critical user journeys from start to finish."
      ],
      [
        "visual-regression",
        "Visual regression testing",
        "Capture and compare screenshots of key UI states to detect unintended visual changes."
      ],
      [
        "a11y-testing",
        "Accessibility testing",
        "Run automated accessibility audits (axe-core, Lighthouse) and include manual keyboard/screen-reader testing for critical flows."
      ],
      [
        "coverage",
        "Test coverage reporting",
        "Generate and review test coverage reports. Focus coverage on critical paths, edge cases, and error handling."
      ]
    ]
  },

  /* ========================================================================
     10. Performance
     ======================================================================== */
  {
    id: "performance",
    title: "Performance",
    desc: "Optimize for speed, efficiency, and a smooth user experience.",
    items: [
      [
        "core-vitals",
        "Core Web Vitals targets",
        "Optimize for LCP under 2.5s, FID under 100ms, and CLS under 0.1. Measure and monitor these metrics."
      ],
      [
        "image-opt",
        "Image optimization",
        "Use modern formats (WebP, AVIF), responsive srcset, lazy loading, and proper sizing. Avoid serving oversized images."
      ],
      [
        "code-split",
        "Code splitting and lazy loading",
        "Split code at route boundaries and lazy-load non-critical modules, components, and assets."
      ],
      [
        "caching",
        "Caching strategies",
        "Implement appropriate caching headers, service worker caching, and client-side caching to minimize redundant network requests."
      ],
      [
        "bundle-size",
        "Bundle size awareness",
        "Keep bundle size minimal. Audit dependencies, tree-shake unused code, and set size budgets."
      ],
      [
        "font-opt",
        "Font optimization",
        "Use font-display: swap, subset fonts to needed character ranges, preload critical fonts, and limit the number of font families and weights."
      ],
      {
        id: "perf-custom",
        type: "text",
        title: "Custom performance requirements",
        placeholder: "e.g. Lighthouse score above 95, first contentful paint under 1s..."
      }
    ]
  },

  /* ========================================================================
     11. PWA
     ======================================================================== */
  {
    id: "pwa",
    title: "PWA",
    desc: "Progressive Web App capabilities.",
    showWhen: { field: "projectType", values: ["PWA", "Web application", "SaaS", "E-commerce", "Dashboard"] },
    items: [
      [
        "pwa",
        "Progressive Web App",
        "Implement a production-quality PWA where appropriate."
      ],
      [
        "manifest",
        "Web App Manifest",
        "Configure appropriate name, icons, display mode, theme colors, and metadata."
      ],
      [
        "service",
        "Service worker",
        "Implement an appropriate service worker and caching strategy."
      ],
      [
        "offline-support",
        "Offline support",
        "Provide meaningful offline behavior where requirements allow it."
      ],
      [
        "install",
        "Installability",
        "Meet installability requirements and provide a polished install experience."
      ]
    ]
  },

  /* ========================================================================
     12. Data & API layer
     ======================================================================== */
  {
    id: "data-api",
    title: "Data & API layer",
    desc: "Define how data flows between the client and server.",
    items: [
      [
        "rest",
        "REST API",
        "Design a clean, resource-oriented REST API with proper HTTP methods, status codes, and consistent URL patterns."
      ],
      [
        "graphql",
        "GraphQL",
        "Implement a GraphQL API with a well-designed schema, resolvers, and appropriate query optimization (N+1 prevention, dataloader)."
      ],
      [
        "trpc",
        "tRPC",
        "Use tRPC for end-to-end typesafe APIs between client and server without code generation."
      ],
      [
        "mock-data",
        "Mock data and API simulation",
        "Provide realistic mock data and API simulation for development and testing. Use fixtures or MSW."
      ],
      [
        "pagination",
        "Pagination patterns",
        "Implement consistent pagination (cursor-based or offset) with proper loading states and infinite scroll or page navigation."
      ],
      [
        "error-handling",
        "API error handling",
        "Handle API errors consistently with typed error responses, retry logic, user-friendly messages, and proper HTTP status codes."
      ],
      [
        "validation",
        "Data validation with Zod / Yup",
        "Validate all data at system boundaries using a schema validation library. Define shared schemas for API requests, responses, and form data."
      ]
    ]
  },

  /* ========================================================================
     13. SEO / AEO / GEO
     ======================================================================== */
  {
    id: "discoverability",
    title: "SEO / AEO / GEO",
    desc: "Optimize for search engines, answer engines, and generative engines.",
    items: [
      [
        "seo",
        "SEO",
        "Implement strong technical SEO, semantic HTML, metadata, canonical URLs, crawlability, and search-friendly content."
      ],
      [
        "aeo",
        "AEO",
        "Optimize relevant content for answer engines with clear answers, question structures, FAQs where appropriate, and machine-readable information."
      ],
      [
        "geo",
        "GEO",
        "Optimize relevant content for generative search with clear entities, relationships, factual structure, and machine-readable information."
      ],
      [
        "rich",
        "Rich search results",
        "Implement appropriate structured data and validate eligible rich-result markup."
      ],
      [
        "social",
        "Social sharing metadata",
        "Implement Open Graph and relevant social preview metadata."
      ],
      [
        "sitemap",
        "Sitemap and robots",
        "Configure sitemap and robots directives appropriately."
      ]
    ]
  },

  /* ========================================================================
     14. GitHub & documentation
     ======================================================================== */
  {
    id: "github",
    title: "GitHub & documentation",
    desc: "Make the repository professional and maintainable.",
    items: [
      [
        "readme",
        "Professional README",
        "Create a polished, accurate README covering project, setup, usage, features, stack, and relevant information."
      ],
      [
        "docs",
        "Detailed documentation",
        "Create detailed Markdown documentation and additional .md files wherever useful."
      ],
      [
        "gitignore",
        "Proper .gitignore",
        "Ignore dependencies, build output, secrets, logs, temporary files, raw prompts/ideas, and unnecessary generated artifacts."
      ],
      [
        "github-files",
        "Professional GitHub files",
        "Add relevant CONTRIBUTING.md, SECURITY.md, CODE_OF_CONDUCT.md, CHANGELOG.md, or templates where appropriate."
      ],
      [
        "accurate-docs",
        "Documentation matches implementation",
        "Ensure documentation reflects actual behavior and never describes nonexistent functionality."
      ]
    ]
  },

  /* ========================================================================
     15. Keyboard shortcuts
     ======================================================================== */
  {
    id: "shortcuts",
    title: "Keyboard shortcuts",
    desc: "Power users should be able to navigate and act without touching the mouse.",
    items: [
      [
        "app-shortcuts",
        "Application keyboard shortcuts",
        "Define keyboard shortcuts for the most common actions. Use standard modifier keys (Ctrl/Cmd) and avoid conflicts with browser defaults."
      ],
      [
        "command-palette",
        "Command palette",
        "Implement a command palette (Ctrl/Cmd+K or Ctrl/Cmd+Shift+P) that provides quick access to all major features and navigation."
      ],
      [
        "custom-bindings",
        "Customizable keybindings",
        "Allow users to view and optionally customize keyboard shortcut assignments."
      ],
      [
        "shortcut-docs",
        "Shortcut documentation",
        "Include a shortcut reference (help modal or settings panel) listing all available shortcuts."
      ]
    ]
  },

  /* ========================================================================
     16. Deployment
     ======================================================================== */
  {
    id: "deployment",
    title: "Deployment",
    desc: "Define where and how the application is deployed.",
    items: [
      [
        "vercel",
        "Vercel",
        "Deploy to Vercel with appropriate configuration for serverless functions, edge middleware, and preview deployments."
      ],
      [
        "netlify",
        "Netlify",
        "Deploy to Netlify with forms, functions, and split testing configured as needed."
      ],
      [
        "aws",
        "AWS",
        "Deploy to AWS using appropriate services (S3 + CloudFront, ECS, Lambda, etc.) with infrastructure-as-code."
      ],
      [
        "docker",
        "Docker",
        "Containerize the application with a multi-stage Dockerfile, optimized image size, and docker-compose for local development."
      ],
      [
        "cloudflare",
        "Cloudflare Pages / Workers",
        "Deploy to Cloudflare's edge network with Workers for serverless compute and Pages for static hosting."
      ],
      [
        "static",
        "Static hosting",
        "Build as static files and deploy to any static host (GitHub Pages, Surge, etc.)."
      ]
    ]
  },

  /* ========================================================================
     17. CI/CD & tooling
     ======================================================================== */
  {
    id: "cicd",
    title: "CI/CD & tooling",
    desc: "Automate quality checks and deployment pipelines.",
    items: [
      [
        "github-actions",
        "GitHub Actions workflows",
        "Set up GitHub Actions for automated testing, linting, building, and deployment on push/PR."
      ],
      [
        "lint-format",
        "Linting and formatting",
        "Configure ESLint (or equivalent) and Prettier with project-specific rules. Enforce consistent code style."
      ],
      [
        "pre-commit",
        "Pre-commit hooks",
        "Use Husky and lint-staged to run linting, formatting, and type checks on staged files before commit."
      ],
      [
        "auto-test",
        "Automated testing in CI",
        "Run the full test suite (unit, integration, E2E) in CI on every push and pull request."
      ],
      [
        "docker-ci",
        "Docker in CI",
        "Build and test Docker images in CI. Push to a container registry on successful builds."
      ]
    ]
  },

  /* ========================================================================
     18. Visual documentation
     ======================================================================== */
  {
    id: "visual",
    title: "Visual documentation",
    desc: "Document the finished interface visually.",
    items: [
      [
        "screenshots",
        "Project screenshots",
        "After completion, capture polished screenshots of the finished UI and include appropriate screenshots in the README."
      ],
      [
        "major-pages",
        "Major page screenshots",
        "Screenshot important pages/routes and include representative images in the README."
      ],
      [
        "modals",
        "Important modal screenshots",
        "Screenshot important modals/dialogs or distinctive UI states that help explain the product."
      ],
      [
        "responsive-shots",
        "Responsive screenshots",
        "Capture representative mobile and desktop states when useful."
      ]
    ]
  },

  /* ========================================================================
     19. License & ownership
     ======================================================================== */
  {
    id: "license",
    title: "License & ownership",
    desc: "Choose the project licensing model.",
    radio: true,
    items: [
      [
        "mit",
        "MIT License",
        "Use a standard MIT LICENSE file."
      ],
      [
        "custom-license",
        "Custom proprietary license",
        "Everything is licensed exclusively to me. No one may use, copy, modify, distribute, or otherwise use this project without my explicit permission."
      ]
    ]
  },

  /* ========================================================================
     20. Developer attribution
     ======================================================================== */
  {
    id: "developer",
    title: "Developer attribution",
    desc: "Use the developer profile when appropriate.",
    items: [
      [
        "profile",
        "Use developer profile",
        "Read relevant information from C:\\Users\\arunn\\Desktop\\ARUN-PROFILE.md and use only appropriate information."
      ],
      [
        "watermark",
        "Developer watermark",
        "Add tasteful developer attribution where appropriate without damaging the UI or exposing unnecessary private information."
      ]
    ]
  },

  /* ========================================================================
     21. Global instructions
     ======================================================================== */
  {
    id: "global",
    title: "Global instructions",
    desc: "Rules applied to the generated prompt.",
    items: [
      [
        "no-emoji",
        "No emojis",
        "Do not use emojis in the UI, documentation, generated copy, or interface labels unless explicitly required."
      ],
      [
        "no-dash",
        "No em dashes",
        "Do not use em dashes. Use appropriate punctuation instead."
      ],
      [
        "icons",
        "Proper icons",
        "Use an appropriate icon library or designed icons instead of emoji or arbitrary Unicode symbols for UI icons."
      ],
      [
        "verify",
        "Verify before completion",
        "Run appropriate validation, inspect the result, fix discovered issues, and do not claim completion without verification."
      ],
      [
        "no-fake",
        "No fake functionality",
        "Do not leave fake buttons, placeholder functionality, misleading interactions, or claims of features that are not implemented."
      ]
    ]
  }
];
