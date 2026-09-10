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
  let activePopover = null;

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
    const oldMsg = sectionsContainer.querySelector(".search-no-results");
    if (oldMsg) oldMsg.remove();

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
      const titleMatches = section.title.toLowerCase().includes(query);

      // If section title matches, show the whole section
      if (titleMatches) {
        sectionHasMatch = true;
        card.classList.remove("search-hidden");
        card.querySelectorAll(".option").forEach((el) => el.classList.remove("search-hidden"));
        totalVisible++;
        return;
      }

      section.items.forEach((item) => {
        if (!Array.isArray(item)) return;
        const [id, title, desc] = item;
        const optionEl = card.querySelector(`#f-${CSS.escape(id)}`)?.closest(".option");
        if (!optionEl) return;

        const titleMatch = title.toLowerCase().includes(query);
        const descMatch = desc.toLowerCase().includes(query);
        const match = titleMatch || descMatch;

        if (match) {
          optionEl.classList.remove("search-hidden");
          sectionHasMatch = true;
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

    if (totalVisible === 0) {
      const msg = document.createElement("div");
      msg.className = "search-no-results";
      msg.innerHTML = `<strong>No results</strong>No requirements match "${Renderer.esc(query)}"`;
      sectionsContainer.appendChild(msg);
    }
  }

  function clearSearchHighlights() {
    document.querySelectorAll(".search-hidden").forEach((el) => {
      el.classList.remove("search-hidden");
    });

    FEATURES.forEach((section) => {
      const card = document.getElementById(`s-${section.id}`);
      if (!card) return;

      section.items.forEach((item) => {
        if (!Array.isArray(item)) return;
        const [id, title, desc] = item;
        const optionEl = card.querySelector(`#f-${CSS.escape(id)}`)?.closest(".option");
        if (!optionEl) return;

        const titleEl = optionEl.querySelector(".option-title");
        const descEl = optionEl.querySelector(".option-desc");
        if (titleEl) titleEl.textContent = title;
        if (descEl) descEl.textContent = desc;
      });
    });

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

  /* ---- Export ---- */
  function getExportFormat() {
    return localStorage.getItem("pa-export-format") || "markdown";
  }

  function setExportFormat(fmt) {
    localStorage.setItem("pa-export-format", fmt);
  }

  function exportPrompt() {
    const fmt = getExportFormat();
    const project = getProject();
    let text, ext, mime;

    switch (fmt) {
      case "json":
        text = PromptBuilder.buildJSON(project, FEATURES, State);
        ext = "json";
        mime = "application/json";
        break;
      case "yaml":
        text = PromptBuilder.buildYAML(project, FEATURES, State);
        ext = "yaml";
        mime = "text/yaml";
        break;
      case "text":
        text = PromptBuilder.buildPlainText(project, FEATURES, State);
        ext = "txt";
        mime = "text/plain";
        break;
      default:
        text = getCurrentText();
        ext = "md";
        mime = "text/markdown";
    }

    const blob = new Blob([text], { type: mime });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `generated-prompt.${ext}`;
    a.click();
    URL.revokeObjectURL(url);
    showToast(`Downloaded as .${ext}`);
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

  /* ---- Popovers ---- */
  function closeAllPopovers() {
    document.querySelectorAll(".popover.open").forEach((p) => {
      p.classList.remove("open");
    });
    activePopover = null;
  }

  function togglePopover(popoverEl) {
    const isOpen = popoverEl.classList.contains("open");
    closeAllPopovers();
    if (!isOpen) {
      popoverEl.classList.add("open");
      activePopover = popoverEl;
    }
  }

  /* ---- Presets ---- */
  function renderPresets() {
    const list = $("presetsList");
    const presets = State.getPresets();
    if (!list) return;

    if (!presets.length) {
      list.innerHTML = '<div class="popover-empty">No saved presets yet.</div>';
      return;
    }

    list.innerHTML = presets.map((p, i) => {
      const date = new Date(p.created).toLocaleDateString();
      const count = (p.checkboxes?.length || 0) + Object.keys(p.dropdowns || {}).length;
      return `
        <div class="popover-item" data-preset-load="${i}">
          <div class="popover-item-info">
            <div class="popover-item-name">${Renderer.esc(p.name)}</div>
            <div class="popover-item-meta">${date} &middot; ${count} selections</div>
          </div>
          <div class="popover-item-actions">
            <button class="icon-btn" data-preset-delete="${i}" aria-label="Delete preset" title="Delete" style="width:28px;height:28px;">
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
            </button>
          </div>
        </div>
      `;
    }).join("");

    list.querySelectorAll("[data-preset-load]").forEach((el) => {
      el.addEventListener("click", (e) => {
        if (e.target.closest("[data-preset-delete]")) return;
        const idx = parseInt(el.dataset.presetLoad);
        State.loadPreset(idx);
        render();
        closeAllPopovers();
        showToast("Preset loaded");
      });
    });

    list.querySelectorAll("[data-preset-delete]").forEach((el) => {
      el.addEventListener("click", (e) => {
        e.stopPropagation();
        const idx = parseInt(el.dataset.presetDelete);
        State.deletePreset(idx);
        renderPresets();
        showToast("Preset deleted");
      });
    });
  }

  function saveCurrentPreset() {
    const input = $("presetNameInput");
    const name = input?.value.trim();
    if (!name) {
      showToast("Enter a preset name");
      return;
    }
    State.savePreset(name);
    input.value = "";
    renderPresets();
    showToast(`Preset "${name}" saved`);
  }

  /* ---- History ---- */
  function renderHistory() {
    const list = $("historyList");
    const history = State.getHistory();
    if (!list) return;

    if (!history.length) {
      list.innerHTML = '<div class="popover-empty">No history yet.</div>';
      return;
    }

    list.innerHTML = history.map((h, i) => {
      const date = new Date(h.timestamp).toLocaleString();
      const chars = h.prompt?.length || 0;
      const name = h.project?.name || "Untitled";
      return `
        <div class="popover-item" data-history-load="${i}">
          <div class="popover-item-info">
            <div class="popover-item-name">${Renderer.esc(name)}</div>
            <div class="popover-item-meta">${date} &middot; ${chars.toLocaleString()} chars</div>
          </div>
        </div>
      `;
    }).join("");

    list.querySelectorAll("[data-history-load]").forEach((el) => {
      el.addEventListener("click", () => {
        const idx = parseInt(el.dataset.historyLoad);
        const entry = State.loadHistory(idx);
        if (entry) {
          if (entry.project) {
            projectName.value = entry.project.name || "";
            projectType.value = entry.project.type || "";
            projectDescription.value = entry.project.description || "";
          }
          render();
          closeAllPopovers();
          showToast("History entry restored");
        }
      });
    });
  }

  /* ---- Import / Paste-and-match ---- */
  function openImportModal() {
    $("importModal")?.classList.add("open");
    $("importTextarea").value = "";
    $("importResults").style.display = "none";
    $("importTextarea").focus();
  }

  function closeImportModal() {
    $("importModal")?.classList.remove("open");
  }

  function matchImport() {
    const text = $("importTextarea")?.value || "";
    if (!text.trim()) {
      showToast("Paste a prompt first");
      return;
    }

    const matches = PromptBuilder.matchImport(text, FEATURES);
    const resultsEl = $("importResults");
    const listEl = $("importMatchList");

    if (!matches.length) {
      listEl.innerHTML = '<span style="color: var(--secondaryLabel);">No matching requirements found.</span>';
      resultsEl.style.display = "block";
      return;
    }

    // Apply matches
    let checkboxesApplied = 0;
    let dropdownsApplied = 0;
    matches.forEach((m) => {
      if (typeof m === "string") {
        /* checkbox id */
        if (!State.has(m)) {
          State.toggle(m);
          checkboxesApplied++;
        }
      } else if (m.id && m.value) {
        /* dropdown */
        State.setDropdown(m.id, m.value);
        dropdownsApplied++;
      }
    });
    State.save();

    // Show results
    const names = matches.map((m) => {
      if (typeof m === "string") {
        const section = FEATURES.find((s) => s.items.some((it) => Array.isArray(it) && it[0] === m));
        const item = section?.items.find((it) => Array.isArray(it) && it[0] === m);
        return item ? item[1] : m;
      }
      return `${m.id}: ${m.value}`;
    });

    listEl.innerHTML = `
      <div style="margin-bottom: var(--sp-8); color: var(--systemGreen); font-weight: 500;">
        ${checkboxesApplied} checkbox${checkboxesApplied !== 1 ? "es" : ""} and ${dropdownsApplied} dropdown${dropdownsApplied !== 1 ? "s" : ""} applied
      </div>
      ${names.map((n) => `<div style="padding: 2px 0;">${Renderer.esc(n)}</div>`).join("")}
    `;
    resultsEl.style.display = "block";

    render();
    setTimeout(() => {
      closeImportModal();
      showToast(`Imported ${matches.length} requirements`);
    }, 1200);
  }

  /* ---- Custom Sections ---- */
  function openCustomSectionModal() {
    $("customSectionModal")?.classList.add("open");
    $("customSectionTitle").value = "";
    $("customSectionContent").value = "";
    $("customSectionTitle").focus();
  }

  function closeCustomSectionModal() {
    $("customSectionModal")?.classList.remove("open");
  }

  function saveCustomSection() {
    const title = $("customSectionTitle")?.value.trim();
    const content = $("customSectionContent")?.value.trim();
    if (!title || !content) {
      showToast("Fill in both fields");
      return;
    }
    State.addCustomSection({ title, content });
    closeCustomSectionModal();
    render();
    showToast("Custom section added");
  }

  /* ---- URL Hash ---- */
  function loadFromHash() {
    const project = State.fromHash();
    if (project) {
      projectName.value = project.name;
      projectType.value = project.type;
      projectDescription.value = project.description;
    }
  }

  function shareConfig() {
    const hash = State.toHash(getProject());
    const url = `${window.location.origin}${window.location.pathname}#${hash}`;
    navigator.clipboard.writeText(url).then(() => {
      showToast("Shareable URL copied");
    }).catch(() => {
      showToast("Failed to copy URL");
    });
    history.replaceState(null, "", `#${hash}`);
  }

  /* ---- Undo / Redo ---- */
  function undo() {
    if (State.undo()) {
      render();
      showToast("Undo");
    }
  }

  function redo() {
    if (State.redo()) {
      render();
      showToast("Redo");
    }
  }

  /* ---- Render ---- */
  function render() {
    Renderer.renderSections(sectionsContainer);
    Renderer.renderNav(navContainer);
    Renderer.updateConditionalVisibility();
    update();
    requestAnimationFrame(() => {
      Interactions.init();
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

    // Conditional visibility on project type change
    projectType.addEventListener("change", () => {
      Renderer.updateConditionalVisibility();
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

    // Download / Export
    const downloadBtn = $("download");
    if (downloadBtn) downloadBtn.addEventListener("click", exportPrompt);

    // Export trigger
    const exportTrigger = $("exportTrigger");
    if (exportTrigger) {
      exportTrigger.addEventListener("click", (e) => {
        e.stopPropagation();
        togglePopover($("exportPopover"));
      });
    }

    // Export format options
    document.querySelectorAll("[data-format]").forEach((btn) => {
      btn.addEventListener("click", () => {
        setExportFormat(btn.dataset.format);
        closeAllPopovers();
        exportPrompt();
      });
    });

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

    // Presets
    const presetsBtn = $("presetsBtn");
    if (presetsBtn) {
      presetsBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        renderPresets();
        togglePopover($("presetsPopover"));
      });
    }
    const savePresetBtn = $("savePresetBtn");
    if (savePresetBtn) savePresetBtn.addEventListener("click", saveCurrentPreset);
    const presetNameInput = $("presetNameInput");
    if (presetNameInput) {
      presetNameInput.addEventListener("keydown", (e) => {
        if (e.key === "Enter") saveCurrentPreset();
        e.stopPropagation();
      });
    }

    // History
    const historyBtn = $("historyBtn");
    if (historyBtn) {
      historyBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        renderHistory();
        togglePopover($("historyPopover"));
      });
    }
    const clearHistoryBtn = $("clearHistoryBtn");
    if (clearHistoryBtn) {
      clearHistoryBtn.addEventListener("click", () => {
        State.clearHistory();
        renderHistory();
        showToast("History cleared");
      });
    }

    // Import
    const importBtn = $("importBtn");
    if (importBtn) importBtn.addEventListener("click", openImportModal);
    const importModalClose = $("importModalClose");
    if (importModalClose) importModalClose.addEventListener("click", closeImportModal);
    const importCancelBtn = $("importCancelBtn");
    if (importCancelBtn) importCancelBtn.addEventListener("click", closeImportModal);
    const importMatchBtn = $("importMatchBtn");
    if (importMatchBtn) importMatchBtn.addEventListener("click", matchImport);

    // Share
    const shareBtn = $("shareBtn");
    if (shareBtn) shareBtn.addEventListener("click", shareConfig);

    // Undo / Redo
    const undoBtn = $("undoBtn");
    if (undoBtn) undoBtn.addEventListener("click", undo);
    const redoBtn = $("redoBtn");
    if (redoBtn) redoBtn.addEventListener("click", redo);

    // Custom sections
    const addCustomBtn = $("addCustomSectionBtn");
    if (addCustomBtn) addCustomBtn.addEventListener("click", openCustomSectionModal);
    const customModalClose = $("customSectionModalClose");
    if (customModalClose) customModalClose.addEventListener("click", closeCustomSectionModal);
    const customCancelBtn = $("customSectionCancelBtn");
    if (customCancelBtn) customCancelBtn.addEventListener("click", closeCustomSectionModal);
    const customSaveBtn = $("customSectionSaveBtn");
    if (customSaveBtn) customSaveBtn.addEventListener("click", saveCustomSection);

    // Close popovers on outside click
    document.addEventListener("click", (e) => {
      if (!e.target.closest(".nav-popover-wrap") && !e.target.closest(".export-group")) {
        closeAllPopovers();
      }
    });

    // Close modals on backdrop click
    document.querySelectorAll(".modal-backdrop").forEach((backdrop) => {
      backdrop.addEventListener("click", (e) => {
        if (e.target === backdrop) {
          backdrop.classList.remove("open");
        }
      });
    });

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
      // Escape to close modals
      if (e.key === "Escape") {
        document.querySelectorAll(".modal-backdrop.open").forEach((m) => {
          m.classList.remove("open");
        });
        closeAllPopovers();
      }
      // Ctrl/Cmd + Z for undo
      if ((e.metaKey || e.ctrlKey) && !e.shiftKey && e.key === "z") {
        // Don't intercept if in an input/textarea
        if (document.activeElement?.tagName === "INPUT" || document.activeElement?.tagName === "TEXTAREA") return;
        e.preventDefault();
        undo();
      }
      // Ctrl/Cmd + Shift + Z for redo
      if ((e.metaKey || e.ctrlKey) && e.shiftKey && e.key === "z") {
        if (document.activeElement?.tagName === "INPUT" || document.activeElement?.tagName === "TEXTAREA") return;
        e.preventDefault();
        redo();
      }
    });
  }

  /* ---- Boot ---- */
  initTheme();
  loadFromHash();
  wireEvents();
  render();
})();
