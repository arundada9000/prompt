/**
 * App -- Initialization & Event Wiring
 */

(function App() {
  const $ = (id) => document.getElementById(id);
  const sectionsContainer = $("sections");
  const navContainer = $("nav");
  const output = $("output");
  const outputEditor = $("outputEditor");
  const previewPanel = $("previewPanel");
  const fullscreenBackdrop = $("fullscreenBackdrop");
  const projectName = $("projectName");
  const projectType = $("projectType");
  const projectDescription = $("projectDescription");
  const searchInput = $("searchInput");
  const searchShortcut = $("searchShortcut");

  let isFullscreen = false;

  /* ---- Theme ---- */
  function initTheme() {
    const saved = localStorage.getItem("pa-theme");
    if (saved) {
      document.documentElement.dataset.theme = saved;
    } else if (
      window.matchMedia &&
      window.matchMedia("(prefers-color-scheme: dark)").matches
    ) {
      document.documentElement.dataset.theme = "dark";
    }
    // Detect OS for shortcut label
    if (searchShortcut) {
      const isMac = /Mac|iPhone|iPad/.test(navigator.userAgent);
      searchShortcut.textContent = isMac ? "⌘K" : "Ctrl+K";
    }
  }

  function toggleTheme() {
    Interactions.themeTransition(() => {
      const isDark = document.documentElement.dataset.theme === "dark";
      const next = isDark ? "light" : "dark";
      document.documentElement.dataset.theme = next;
      localStorage.setItem("pa-theme", next);
    });
  }

  /* ---- Helpers ---- */
  function getProject() {
    return {
      name: projectName.value.trim(),
      type: projectType.value,
      description: projectDescription.value.trim()
    };
  }

  function getCurrentText() {
    return isFullscreen
      ? outputEditor.value
      : PromptBuilder.build(getProject(), FEATURES, State);
  }

  /* ---- Update ---- */
  function update() {
    const prompt = PromptBuilder.build(getProject(), FEATURES, State);
    output.textContent = prompt;

    if (document.activeElement !== outputEditor) {
      outputEditor.value = prompt;
    }

    Renderer.updatePills();
    Renderer.updateStats();

    const charsEl = $("chars");
    if (charsEl) {
      const len = isFullscreen ? outputEditor.value.length : prompt.length;
      charsEl.textContent = `${len.toLocaleString()} chars`;
    }
  }

  /* ---- Search ---- */
  function escapeRegex(str) {
    return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  }

  function highlightText(text, regex) {
    return text.replace(regex, (match) => `<mark>${match}</mark>`);
  }

  function handleSearch() {
    const query = searchInput.value.trim().toLowerCase();

    // Remove old "no results" message
    const oldMsg = sectionsContainer.querySelector(".search-no-results");
    if (oldMsg) oldMsg.remove();

    // If empty query, show everything and restore original text
    if (!query) {
      clearSearchHighlights();
      return;
    }

    const regex = new RegExp(`(${escapeRegex(query)})`, "gi");
    let totalVisible = 0;

    FEATURES.forEach((section) => {
      const card = document.getElementById(`s-${section.id}`);
      if (!card) return;

      let sectionHasMatch = false;

      // Check if section title matches
      const titleMatches = section.title.toLowerCase().includes(query);

      section.items.forEach(([id, title, desc]) => {
        const optionEl = card.querySelector(`#f-${CSS.escape(id)}`)?.closest(".option");
        if (!optionEl) return;

        const titleMatch = title.toLowerCase().includes(query);
        const descMatch = desc.toLowerCase().includes(query);
        const match = titleMatch || descMatch || titleMatches;

        if (match) {
          optionEl.classList.remove("search-hidden");
          sectionHasMatch = true;

          // Highlight matching text
          const titleEl = optionEl.querySelector(".option-title");
          const descEl = optionEl.querySelector(".option-desc");
          if (titleEl) titleEl.innerHTML = highlightText(Renderer.esc(title), regex);
          if (descEl) descEl.innerHTML = highlightText(Renderer.esc(desc), regex);
        } else {
          optionEl.classList.add("search-hidden");
        }
      });

      if (sectionHasMatch) {
        card.classList.remove("search-hidden");
        totalVisible++;
      } else {
        card.classList.add("search-hidden");
      }
    });

    // Also hide/show project card based on query
    const projectCard = document.querySelector(".project-card");
    if (projectCard) {
      const projMatch = "project basics".includes(query) || 
                        "project name".includes(query) || 
                        "project type".includes(query) ||
                        "project description".includes(query);
      if (projMatch) {
        projectCard.classList.remove("search-hidden");
        totalVisible++;
      } else {
        projectCard.classList.add("search-hidden");
      }
    }

    // Show "no results" if nothing matched
    if (totalVisible === 0) {
      const msg = document.createElement("div");
      msg.className = "search-no-results";
      msg.innerHTML = `<strong>No results</strong>No requirements match "${Renderer.esc(query)}"`;
      sectionsContainer.appendChild(msg);
    }
  }

  function clearSearchHighlights() {
    // Remove hidden classes
    document.querySelectorAll(".search-hidden").forEach((el) => {
      el.classList.remove("search-hidden");
    });

    // Restore original text (remove <mark> tags)
    FEATURES.forEach((section) => {
      const card = document.getElementById(`s-${section.id}`);
      if (!card) return;

      section.items.forEach(([id, title, desc]) => {
        const optionEl = card.querySelector(`#f-${CSS.escape(id)}`)?.closest(".option");
        if (!optionEl) return;

        const titleEl = optionEl.querySelector(".option-title");
        const descEl = optionEl.querySelector(".option-desc");
        if (titleEl) titleEl.textContent = title;
        if (descEl) descEl.textContent = desc;
      });
    });

    // Remove no-results message
    const msg = sectionsContainer.querySelector(".search-no-results");
    if (msg) msg.remove();
  }

  /* ---- Copy ---- */
  async function copyPrompt() {
    try {
      await navigator.clipboard.writeText(getCurrentText());
      showToast("Copied to clipboard");
    } catch {
      showToast("Clipboard access failed");
    }
  }

  /* ---- Download ---- */
  function downloadMarkdown() {
    const text = getCurrentText();
    const blob = new Blob([text], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "generated-development-prompt.md";
    a.click();
    URL.revokeObjectURL(url);
    showToast("Markdown downloaded");
  }

  /* ---- Fullscreen ---- */
  function toggleFullscreen() {
    isFullscreen = !isFullscreen;

    if (isFullscreen) {
      outputEditor.value = PromptBuilder.build(getProject(), FEATURES, State);
      previewPanel.classList.add("fullscreen");
      fullscreenBackdrop.classList.add("visible");
      document.body.style.overflow = "hidden";
      requestAnimationFrame(() => {
        outputEditor.focus();
        outputEditor.setSelectionRange(0, 0);
      });
    } else {
      previewPanel.classList.remove("fullscreen");
      fullscreenBackdrop.classList.remove("visible");
      document.body.style.overflow = "";
    }
  }

  function closeFullscreen() {
    if (!isFullscreen) return;
    isFullscreen = false;
    previewPanel.classList.remove("fullscreen");
    fullscreenBackdrop.classList.remove("visible");
    document.body.style.overflow = "";
  }

  /* ---- Reset ---- */
  function reset() {
    State.clear();
    projectName.value = "";
    projectType.value = "";
    projectDescription.value = "";
    if (searchInput) searchInput.value = "";
    clearSearchHighlights();
    render();
    showToast("Generator reset");
  }

  /* ---- Toast ---- */
  let toastTimer = null;
  function showToast(message) {
    const toast = $("toast");
    if (!toast) return;
    toast.textContent = message;
    toast.classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove("show"), 2200);
  }

  /* ---- Render ---- */
  function render() {
    Renderer.renderSections(sectionsContainer);
    Renderer.renderNav(navContainer);
    update();
    requestAnimationFrame(() => {
      Interactions.init();
      // Initialize circular nav for mobile
      if (window.innerWidth <= 820 && typeof CircularNav !== "undefined") {
        CircularNav.init(FEATURES);
      }
    });
  }

  /* ---- Events ---- */
  function wireEvents() {
    document.addEventListener("selectionchange", update);

    [projectName, projectType, projectDescription].forEach((el) => {
      el.addEventListener("input", update);
    });

    // Theme
    const themeBtn = $("themeBtn");
    if (themeBtn) themeBtn.addEventListener("click", toggleTheme);

    // Copy
    ["copyBtn", "copySmall"].forEach((id) => {
      const btn = $(id);
      if (btn) btn.addEventListener("click", copyPrompt);
    });

    // Reset
    const resetBtn = $("resetBtn");
    if (resetBtn) resetBtn.addEventListener("click", reset);
    const clearBtn = $("clearBtn");
    if (clearBtn) clearBtn.addEventListener("click", reset);

    // Download
    const downloadBtn = $("download");
    if (downloadBtn) downloadBtn.addEventListener("click", downloadMarkdown);

    // Fullscreen
    const fullscreenBtn = $("fullscreenBtn");
    if (fullscreenBtn) fullscreenBtn.addEventListener("click", toggleFullscreen);
    if (fullscreenBackdrop) fullscreenBackdrop.addEventListener("click", closeFullscreen);

    // Search
    if (searchInput) {
      let searchDebounce = null;
      searchInput.addEventListener("input", () => {
        clearTimeout(searchDebounce);
        searchDebounce = setTimeout(handleSearch, 150);
      });

      // Clear search on Escape when focused
      searchInput.addEventListener("keydown", (e) => {
        if (e.key === "Escape") {
          searchInput.value = "";
          searchInput.blur();
          clearSearchHighlights();
        }
      });
    }

    // Editor char count
    if (outputEditor) {
      outputEditor.addEventListener("input", () => {
        const charsEl = $("chars");
        if (charsEl) charsEl.textContent = `${outputEditor.value.length.toLocaleString()} chars`;
      });
    }

    // Keyboard shortcuts
    document.addEventListener("keydown", (e) => {
      // Ctrl/Cmd + Shift + C to copy
      if ((e.metaKey || e.ctrlKey) && e.shiftKey && e.key === "C") {
        e.preventDefault();
        copyPrompt();
      }
      // Ctrl/Cmd + K to focus search
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        if (searchInput) {
          searchInput.focus();
          searchInput.select();
        }
      }
      // Escape to close fullscreen
      if (e.key === "Escape" && isFullscreen) {
        closeFullscreen();
      }
    });
  }

  /* ---- Boot ---- */
  initTheme();
  wireEvents();
  render();
})();
