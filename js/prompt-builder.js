/**
 * Prompt Builder
 *
 * Pure function that assembles the generated prompt markdown from the
 * current selections and project context fields.
 * Has no DOM dependencies -- receives all data as arguments.
 */

const PromptBuilder = (() => {
  /**
   * Build the full prompt text.
   * @param {Object} project - { name, type, description }
   * @param {Array}  features - The FEATURES array
   * @param {Set|Object} selected - Object with .has(id) method
   * @returns {string} The generated prompt markdown
   */
  function build(project, features, selected) {
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
      const picked = section.items.filter(([id]) => selected.has(id));
      if (!picked.length) return;

      hasAny = true;
      lines.push(`## ${section.title}`);
      picked.forEach(([, title, description]) => {
        lines.push(`- **${title}:** ${description}`);
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

    if (selected.has("profile")) {
      lines.push(
        "",
        "## Developer profile",
        String.raw`Read the developer profile at C:\Users\arunn\Desktop\ARUN-PROFILE.md and use only relevant information for appropriate attribution, author metadata, documentation, or project context.`
      );
    }

    if (selected.has("custom-license")) {
      lines.push(
        "",
        "## License",
        "> Everything is licensed exclusively to me. No one may use, copy, modify, distribute, or otherwise use this project without my explicit permission."
      );
    }

    if (selected.has("mit")) {
      lines.push(
        "",
        "## License",
        "Use the MIT License and include a proper LICENSE file."
      );
    }

    return lines.join("\n");
  }

  return { build };
})();
