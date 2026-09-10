/**
 * Content -- Journal articles and reference material.
 */

const Content = {
  journal: [
    {
      title: "Write prompts that get better output",
      tag: "Tips",
      date: "Sep 2026",
      minutes: 4,
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
      title: "The checklists behind a production-grade build",
      tag: "Method",
      date: "Sep 2026",
      minutes: 5,
      excerpt: "Security, testing, performance, and documentation are not optional extras. They are the difference between working and worth shipping.",
      body: [
        "Most AI coding tools are excellent at writing code and poor at remembering constraints. If your project needs input validation, XSS protection, and a CSP, the model will not infer that from 'a nice website'. Checklists exist because humans forget too.",
        "The sections in this generator are deliberately granular. Each checkbox maps to a requirement the generated prompt can state verbatim, so the assistant knows exactly what it is being graded on.",
        "Start small. A first run with five checkboxes teaches you how the model responds to your wording. Expand the checklist as you learn which requirements actually change the output and which never get read.",
        "Use dropdowns for facts, checkboxes for rules. 'Vite + React' is a fact; 'no em dashes' is a rule. Models follow rules they were explicitly told and guess at facts they were not."
      ]
    },
    {
      title: "From checklist to spec: exporting for different AI tools",
      tag: "Workflow",
      date: "Aug 2026",
      minutes: 3,
      excerpt: "Markdown for chat models, JSON for pipelines, YAML for config-heavy tools. Match the format to the context window.",
      body: [
        "Markdown is the safe default. Chat assistants (Claude, ChatGPT, Gemini) parse headings and bullets well, and the generated prompt doubles as human-readable documentation.",
        "JSON shines in pipelines. If you are generating prompts programmatically, a structured object keeps the requirements machine-checkable and lets you version-control each field.",
        "YAML is the config-lover's format. It is denser than JSON, reads like a spec sheet, and suits tools where prompts are stored next to other configuration.",
        "Whatever format you choose, keep the same information: context, requirements, and non-negotiables. The format should never be the excuse for a shorter prompt."
      ]
    }
  ]
};