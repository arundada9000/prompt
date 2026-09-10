/**
 * Presets -- Factory presets and file import/export.
 *
 * Factory presets are shipped with the app, marked `factory: true`,
 * and can be deleted by the user like any other preset.
 */

const SEED_FLAG = "pa-presets-seeded-v1";

const FACTORY_PRESETS = [
  {
    name: "Quality web app",
    created: 1720000000000,
    factory: true,
    checkboxes: [
      "production", "best-practices", "modular", "reusable", "polished",
      "ios-hig", "design-system", "responsive", "accessibility", "reduced",
      "loading", "empty", "errors", "404",
      "unit-tests", "integration-tests", "e2e-tests",
      "readme", "gitignore", "lint-format",
      "verify", "no-fake", "screenshots"
    ],
    dropdowns: {
      framework: "react",
      language: "typescript",
      styling: "tailwind",
      stateMgmt: "zustand",
      pkgManager: "pnpm",
      buildTool: "vite"
    },
    texts: {}
  },
  {
    name: "Installable PWA",
    created: 1720000100000,
    factory: true,
    checkboxes: [
      "production", "best-practices", "ios-hig", "design-system",
      "responsive", "accessibility",
      "pwa", "manifest", "service", "offline-support", "install",
      "core-vitals", "caching", "loading", "empty", "offline",
      "unit-tests", "coverage",
      "custom-license"
    ],
    dropdowns: {
      language: "typescript",
      pkgManager: "pnpm",
      buildTool: "vite"
    },
    texts: {
      "perf-custom": "Lighthouse PWA audit score above 95, installs via beforeinstallprompt"
    }
  },
  {
    name: "API / Backend",
    created: 1720000200000,
    factory: true,
    checkboxes: [
      "production", "best-practices",
      "input-validation", "xss", "csrf", "csp", "auth-patterns",
      "env-vars", "rate-limit", "https",
      "rest", "error-handling", "validation",
      "unit-tests", "integration-tests",
      "docker", "github-actions", "auto-test",
      "readme", "gitignore", "verify", "no-fake"
    ],
    dropdowns: {
      language: "typescript",
      pkgManager: "pnpm"
    },
    texts: {}
  },
  {
    name: "Full-stack SaaS",
    created: 1720000300000,
    factory: true,
    checkboxes: [
      "production", "best-practices", "modular", "polished",
      "ios-hig", "pro-ux", "design-system",
      "responsive", "accessibility", "a11y-testing",
      "unit-tests", "integration-tests", "e2e-tests",
      "core-vitals", "caching",
      "rest", "validation",
      "seo", "aeo", "geo", "rich", "social",
      "readme", "docs", "gitignore",
      "lint-format", "pre-commit", "auto-test", "github-actions",
      "custom-license", "no-emoji", "verify", "no-fake"
    ],
    dropdowns: {
      framework: "next",
      language: "typescript",
      styling: "tailwind",
      stateMgmt: "zustand",
      pkgManager: "pnpm",
      buildTool: "turbopack"
    },
    texts: {}
  }
];

function seedFactoryPresets() {
  try {
    if (localStorage.getItem(SEED_FLAG)) return;
    const existing = State.getPresets();
    const mine = FACTORY_PRESETS.filter((fp) =>
      !existing.some((p) => p.name === fp.name && p.factory)
    );
    if (mine.length) {
      const merged = [...mine, ...existing];
      localStorage.setItem("pa-presets", JSON.stringify(merged));
    }
    localStorage.setItem(SEED_FLAG, "1");
  } catch (e) { /* storage unavailable -- ignore */ }
}

function exportPresetsFile() {
  const presets = State.getPresets().map(({ name, checkboxes, dropdowns, texts }) => ({
    name, checkboxes: checkboxes || [], dropdowns: dropdowns || {}, texts: texts || {}
  }));
  const blob = new Blob([JSON.stringify({ app: "prompt-architect", version: 1, presets }, null, 2)],
    { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "prompt-architect-presets.json";
  a.click();
  URL.revokeObjectURL(url);
}

function importPresetsFile() {
  const input = document.createElement("input");
  input.type = "file";
  input.accept = ".json,application/json";
  input.addEventListener("change", () => {
    const file = input.files && input.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const data = JSON.parse(reader.result);
        const list = Array.isArray(data)
          ? data
          : (data && Array.isArray(data.presets) ? data.presets : []);
        const clean = list
          .filter((p) => p && typeof p.name === "string" && p.name.trim())
          .map((p) => ({
            name: p.name,
            created: Date.now(),
            checkboxes: Array.isArray(p.checkboxes) ? p.checkboxes : [],
            dropdowns: p.dropdowns && typeof p.dropdowns === "object" ? p.dropdowns : {},
            texts: p.texts && typeof p.texts === "object" ? p.texts : {}
          }));
        if (!clean.length) return showToast("No valid presets in file");
        const all = [...State.getPresets(), ...clean];
        localStorage.setItem("pa-presets", JSON.stringify(all));
        renderPresets();
        showToast(`Imported ${clean.length} preset${clean.length !== 1 ? "s" : ""}`);
      } catch (e) {
        showToast("Could not read preset file");
      }
    };
    reader.readAsText(file);
  });
  input.click();
}