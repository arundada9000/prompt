/**
 * FEATURES -- Section definitions for the prompt builder.
 *
 * Each section has:
 *   id    -- unique section identifier
 *   title -- display name
 *   desc  -- short description
 *   radio -- (optional) true if items are mutually exclusive
 *   items -- array of [itemId, itemTitle, itemDescription]
 */

const FEATURES = [
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
  {
    id: "pwa",
    title: "PWA",
    desc: "Progressive Web App capabilities.",
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
