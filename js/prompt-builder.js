/**
 * Prompt Builder
 *
 * Pure function that assembles the generated prompt from the
 * current selections and project context fields.
 * Supports checkboxes, dropdowns, text inputs, and custom sections.
 * Has no DOM dependencies -- receives all data as arguments.
 */

const PromptBuilder = (() => {
  /**
   * Build the full prompt text (Markdown format).
   * @param {Object} project - { name, type, description }
   * @param {Array}  features - The FEATURES array
   * @param {Object} state - The State module
   * @returns {string} The generated prompt markdown
   */
  function build(project, features, state) {
    const name = project.name || "[PROJECT NAME]";
    const type = project.type || "[PROJECT TYPE]";
    const desc = project.description || "[PROJECT DESCRIPTION]";

    const lines = [
      `# ${name} - Development Prompt`,
      "",
      "## Project",
      `- **Name:** ${name}`,
      `- **Type:** ${type}`,
      `- **Description:** ${desc}`,
      "",
      "## Core instruction",
      "Act as a senior software engineer and an expert product designer with impeccable UI/UX skills. Build this as a polished, production-quality product. Make deliberate technical and design decisions, use modern best practices, keep the implementation modular and maintainable, and verify the result before declaring completion.",
      ""
    ];

    let hasAny = false;

    features.forEach((section) => {
      const picked = [];
      const dropdowns = [];
      const texts = [];

      section.items.forEach((item) => {
        if (Array.isArray(item)) {
          /* checkbox */
          if (state.has(item[0])) picked.push(item);
        } else if (item.type === "dropdown") {
          const val = state.getDropdown(item.id);
          if (val) {
            const opt = item.options.find(([v]) => v === val);
            if (opt) dropdowns.push({ title: item.title, value: opt[1], desc: opt[2] });
          }
        } else if (item.type === "text") {
          const val = state.getText(item.id);
          if (val && val.trim()) texts.push({ title: item.title, value: val.trim() });
        }
      });

      if (!picked.length && !dropdowns.length && !texts.length) return;

      hasAny = true;
      lines.push(`## ${section.title}`);
      picked.forEach(([, title, description]) => {
        lines.push(`- **${title}:** ${description}`);
      });
      dropdowns.forEach(({ title, value, desc }) => {
        lines.push(`- **${title}:** ${value} -- ${desc}`);
      });
      texts.forEach(({ title, value }) => {
        lines.push(`- **${title}:** ${value}`);
      });
      lines.push("");
    });

    // Custom sections
    const customSections = state.getCustomSections ? state.getCustomSections() : [];
    customSections.forEach((section) => {
      if (!section.title || !section.content) return;
      hasAny = true;
      lines.push(`## ${section.title}`);
      section.content.split("\n").forEach((line) => {
        const trimmed = line.trim();
        if (trimmed) lines.push(`- ${trimmed}`);
      });
      lines.push("");
    });

    if (!hasAny) {
      lines.push(
        "## Selected requirements",
        "No optional requirements selected yet.",
        ""
      );
    }

    lines.push(
      "## Quality bar",
      "- Use impeccable UI/UX and professional product-design judgment.",
      "- Prioritize accessibility, responsiveness, maintainability, consistency, and polish.",
      "- Do not use emojis or em dashes.",
      "- Use proper icons rather than arbitrary Unicode symbols for interface icons.",
      "- Do not use inline hardcoded CSS.",
      "- Prefer modular, reusable components and centralized design tokens.",
      "- Do not leave fake or unfinished functionality.",
      "- Inspect the finished implementation and fix issues before considering the project complete."
    );

    if (state.has("profile")) {
      lines.push(
        "",
        "## Developer profile",
        String.raw`Read the developer profile at C:\Users\arunn\Desktop\ARUN-PROFILE.md and use only relevant information for appropriate attribution, author metadata, documentation, or project context.`
      );
    }

    if (state.has("custom-license")) {
      lines.push(
        "",
        "## License",
        "> Everything is licensed exclusively to me. No one may use, copy, modify, distribute, or otherwise use this project without my explicit permission."
      );
    }

    if (state.has("mit")) {
      lines.push(
        "",
        "## License",
        "Use the MIT License and include a proper LICENSE file."
      );
    }

    return lines.join("\n");
  }

  /**
   * Build a structured data object from the current state.
   */
  function buildStructured(project, features, state) {
    const sections = [];
    const customSections = state.getCustomSections ? state.getCustomSections() : [];

    features.forEach((section) => {
      const items = [];
      section.items.forEach((item) => {
        if (Array.isArray(item)) {
          if (state.has(item[0])) {
            items.push({ id: item[0], title: item[1], description: item[2] });
          }
        } else if (item.type === "dropdown") {
          const val = state.getDropdown(item.id);
          if (val) {
            const opt = item.options.find(([v]) => v === val);
            if (opt) items.push({ id: item.id, title: item.title, value: opt[1], description: opt[2] });
          }
        } else if (item.type === "text") {
          const val = state.getText(item.id);
          if (val && val.trim()) {
            items.push({ id: item.id, title: item.title, value: val.trim() });
          }
        }
      });
      if (items.length) sections.push({ title: section.title, items });
    });

    customSections.forEach((cs) => {
      if (cs.title && cs.content) {
        sections.push({
          title: cs.title,
          items: cs.content.split("\n").filter((l) => l.trim()).map((l) => ({ value: l.trim() }))
        });
      }
    });

    return {
      project: {
        name: project.name || "",
        type: project.type || "",
        description: project.description || ""
      },
      sections,
      license: state.has("mit") ? "MIT" : state.has("custom-license") ? "Proprietary" : "",
      developerProfile: state.has("profile")
    };
  }

  /**
   * Build JSON export.
   */
  function buildJSON(project, features, state) {
    return JSON.stringify(buildStructured(project, features, state), null, 2);
  }

  /**
   * Build YAML export.
   */
  function buildYAML(project, features, state) {
    const data = buildStructured(project, features, state);
    const lines = [];
    lines.push("project:");
    lines.push(`  name: "${data.project.name}"`);
    lines.push(`  type: "${data.project.type}"`);
    lines.push(`  description: "${data.project.description}"`);
    lines.push("");
    lines.push("sections:");
    data.sections.forEach((section) => {
      lines.push(`  - title: "${section.title}"`);
      lines.push("    items:");
      section.items.forEach((item) => {
        if (item.title && item.description) {
          lines.push(`      - title: "${item.title}"`);
          lines.push(`        description: "${item.description}"`);
        } else if (item.title && item.value) {
          lines.push(`      - title: "${item.title}"`);
          lines.push(`        value: "${item.value}"`);
        } else if (item.value) {
          lines.push(`      - "${item.value}"`);
        }
      });
    });
    if (data.license) {
      lines.push("");
      lines.push(`license: "${data.license}"`);
    }
    return lines.join("\n");
  }

  /**
   * Build plain text export.
   */
  function buildPlainText(project, features, state) {
    const md = build(project, features, state);
    return md
      .replace(/^#{1,6}\s+/gm, "")
      .replace(/\*\*(.+?)\*\*/g, "$1")
      .replace(/^-\s+/gm, "  - ")
      .replace(/^>\s+/gm, "")
      .replace(/\n{3,}/g, "\n\n")
      .trim();
  }

  /**
   * Build prompt from imported text by matching known keywords.
   * Returns { matched: [...ids], prompt: string }.
   */
  function matchImport(text, features) {
    const matched = [];
    const lower = text.toLowerCase();

    features.forEach((section) => {
      section.items.forEach((item) => {
        if (Array.isArray(item)) {
          /* checkbox -- match title and key words */
          const titleWords = item[1].toLowerCase().split(/\s+/);
          const descWords = item[2].toLowerCase().split(/\s+/);
          const allWords = [...titleWords, ...descWords];
          const hits = allWords.filter((w) => w.length > 3 && lower.includes(w)).length;
          if (hits >= 2 || lower.includes(item[1].toLowerCase())) {
            matched.push(item[0]);
          }
        } else if (item.type === "dropdown") {
          /* dropdown -- match selected option labels */
          item.options.forEach(([value, label]) => {
            if (lower.includes(label.toLowerCase())) {
              matched.push({ id: item.id, value });
            }
          });
        }
      });
    });

    return matched;
  }

  return {
    build,
    buildJSON,
    buildYAML,
    buildPlainText,
    buildStructured,
    matchImport
  };
})();
