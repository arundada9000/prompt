/**
 * Renderer
 *
 * Builds all dynamic DOM elements: section cards, sidebar navigation,
 * and updates stats/pills. Uses the FEATURES data and State module.
 * Supports checkboxes, dropdowns, and text inputs.
 */

const Renderer = (() => {
  /**
   * Escape HTML special characters.
   */
  function esc(str) {
    if (!str) return "";
    const map = { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;" };
    return str.replace(/[&<>"']/g, (c) => map[c]);
  }

  /**
   * Check if a section should be visible given current project type.
   */
  function isSectionVisible(section) {
    if (!section.showWhen) return true;
    const val = document.getElementById("projectType")?.value || "";
    return section.showWhen.values.includes(val);
  }

  /**
   * Render a checkbox item tile.
   */
  function renderCheckboxItem(id, title, desc, section) {
    const inputType = section.radio ? "radio" : "checkbox";
    return `
      <div class="option">
        <input
          class="option-input"
          id="f-${id}"
          type="${inputType}"
          name="${section.radio ? section.id : id}"
          value="${id}"
          ${State.has(id) ? "checked" : ""}
        >
        <label class="option-label" for="f-${id}">
          <span class="option-check">
            <svg><use href="icons/icons.svg#icon-check"/></svg>
          </span>
          <span>
            <span class="option-title">${esc(title)}</span>
            <span class="option-desc">${esc(desc)}</span>
          </span>
        </label>
      </div>
    `;
  }

  /**
   * Render a dropdown item.
   */
  function renderDropdownItem(item) {
    const current = State.getDropdown(item.id);
    const optionsHtml = item.options
      .map(([value, label, desc]) => {
        const sel = current === value ? "selected" : "";
        return `<option value="${esc(value)}" ${sel} title="${esc(desc)}">${esc(label)}</option>`;
      })
      .join("");

    return `
      <div class="option option--dropdown">
        <label class="option-dropdown-label" for="f-${item.id}">
          <span class="option-title">${esc(item.title)}</span>
        </label>
        <select
          class="form-select option-dropdown-select"
          id="f-${item.id}"
          data-dropdown="${item.id}"
        >
          <option value="">${esc(item.placeholder || "Select...")}</option>
          ${optionsHtml}
        </select>
        ${current ? `<span class="option-dropdown-desc">${esc(
          (item.options.find(([v]) => v === current) || [])[2] || ""
        )}</span>` : ""}
      </div>
    `;
  }

  /**
   * Render a text input item.
   */
  function renderTextItem(item) {
    const current = State.getText(item.id);
    return `
      <div class="option option--text">
        <label class="option-text-label" for="f-${item.id}">
          <span class="option-title">${esc(item.title)}</span>
        </label>
        <textarea
          class="form-textarea option-textarea"
          id="f-${item.id}"
          data-text="${item.id}"
          rows="2"
          placeholder="${esc(item.placeholder || "Type here...")}"
        >${esc(current)}</textarea>
      </div>
    `;
  }

  /**
   * Render all section cards into the builder area.
   */
  function renderSections(container) {
    container.innerHTML = "";

    FEATURES.forEach((section, index) => {
      const visible = isSectionVisible(section);
      const card = document.createElement("article");
      card.className = `section-card${visible ? "" : " section-card--hidden"}`;
      card.id = `s-${section.id}`;
      card.style.animationDelay = `${index * 0.05}s`;

      const checkboxItems = section.items.filter((item) => Array.isArray(item));
      const allCount = checkboxItems.length;
      const selectedCount = State.countInSection(section);
      const allSelected = allCount > 0 && selectedCount === allCount;

      let itemsHtml = "";
      section.items.forEach((item) => {
        if (Array.isArray(item)) {
          itemsHtml += renderCheckboxItem(item[0], item[1], item[2], section);
        } else if (item.type === "dropdown") {
          itemsHtml += renderDropdownItem(item);
        } else if (item.type === "text") {
          itemsHtml += renderTextItem(item);
        }
      });

      card.innerHTML = `
        <div class="card-header">
          <div class="card-header-left">
            <span class="section-num">${index + 1}</span>
            <h2 class="card-title">${esc(section.title)}</h2>
          </div>
          <div class="card-header-right">
            <span class="pill ${selectedCount > 0 ? "pill--accent" : "pill--muted"}" id="pill-${section.id}">${selectedCount}/${section.items.length}</span>
            ${!section.radio && allCount > 0 ? `<button class="select-all-btn" data-section="${section.id}">${allSelected ? "Deselect all" : "Select all"}</button>` : ""}
          </div>
        </div>
        <p class="card-desc">${esc(section.desc)}</p>
        <div class="options-grid">
          ${itemsHtml}
        </div>
      `;

      container.appendChild(card);
    });

    // Bind checkbox change events
    container.querySelectorAll(".option-input").forEach((input) => {
      input.addEventListener("change", () => {
        if (input.type === "radio") {
          const siblings = container.querySelectorAll(
            `input[name="${CSS.escape(input.name)}"]`
          );
          const groupIds = [...siblings].map((s) => s.value);
          State.selectRadio(input.value, groupIds);
        } else {
          State.toggle(input.value);
        }
        updatePills();
        updateSelectAllButtons();
      });
    });

    // Bind dropdown change events
    container.querySelectorAll("[data-dropdown]").forEach((select) => {
      select.addEventListener("change", () => {
        State.setDropdown(select.dataset.dropdown, select.value);
        updatePills();
        // Update description below select
        const parent = select.closest(".option--dropdown");
        if (parent) {
          let descEl = parent.querySelector(".option-dropdown-desc");
          const itemId = select.dataset.dropdown;
          const section = FEATURES.find((s) =>
            s.items.some((it) => !Array.isArray(it) && it.id === itemId)
          );
          const item = section?.items.find((it) => !Array.isArray(it) && it.id === itemId);
          const opt = item?.options?.find(([v]) => v === select.value);
          if (opt && opt[2]) {
            if (!descEl) {
              descEl = document.createElement("span");
              descEl.className = "option-dropdown-desc";
              select.parentElement.appendChild(descEl);
            }
            descEl.textContent = opt[2];
          } else if (descEl) {
            descEl.remove();
          }
        }
      });
    });

    // Bind text input events (debounced)
    container.querySelectorAll("[data-text]").forEach((textarea) => {
      let debounce = null;
      textarea.addEventListener("input", () => {
        clearTimeout(debounce);
        debounce = setTimeout(() => {
          State.setText(textarea.dataset.text, textarea.value);
          updatePills();
        }, 300);
      });
    });

    // Bind select all buttons
    container.querySelectorAll(".select-all-btn").forEach((btn) => {
      btn.addEventListener("click", () => {
        const sectionId = btn.dataset.section;
        const section = FEATURES.find((s) => s.id === sectionId);
        if (!section) return;

        const checkboxItems = section.items.filter((item) => Array.isArray(item));
        const allCount = checkboxItems.length;
        const selectedCount = State.countInSection(section);
        const shouldSelectAll = selectedCount < allCount;

        checkboxItems.forEach(([id]) => {
          if (shouldSelectAll) {
            State.select(id);
          } else {
            State.deselect(id);
          }
        });

        // Update checkbox visual state
        checkboxItems.forEach(([id]) => {
          const checkbox = document.getElementById(`f-${id}`);
          if (checkbox) checkbox.checked = shouldSelectAll;
        });

        State.save();
        updateSelectAllButtons();
        updatePills();
      });
    });

    // Render custom sections
    renderCustomSections(container);
  }

  /**
   * Render user-added custom sections as cards.
   */
  function renderCustomSections(container) {
    const customSections = State.getCustomSections ? State.getCustomSections() : [];
    customSections.forEach((section, index) => {
      const card = document.createElement("article");
      card.className = "section-card custom-section-card";
      card.id = `s-custom-${index}`;
      const totalIndex = FEATURES.length + index + 1;

      const lines = section.content
        .split("\n")
        .map((line) => line.trim())
        .filter((line) => line);
      const count = lines.length;

      card.innerHTML = `
        <div class="card-header">
          <div class="card-header-left">
            <span class="section-num">${totalIndex}</span>
            <h2 class="card-title">${esc(section.title)}</h2>
          </div>
          <div class="card-header-right">
            <span class="pill pill--accent">${count} line${count !== 1 ? "s" : ""}</span>
            <button class="icon-btn custom-section-remove" data-custom-index="${index}" aria-label="Remove section" title="Remove section" style="width:28px;height:28px;">
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
            </button>
          </div>
        </div>
        <ul class="custom-section-list">
          ${lines.map((line) => `<li>${esc(line)}</li>`).join("")}
        </ul>
      `;

      const removeBtn = card.querySelector(".custom-section-remove");
      removeBtn.addEventListener("click", () => {
        State.removeCustomSection(index);
        // Re-render from scratch (indexes may shift)
        const container = document.getElementById("sections");
        renderSections(container);
      });

      container.appendChild(card);
    });
  }

  /**
   * Update all "Select all" / "Deselect all" button labels.
   */
  function updateSelectAllButtons() {
    document.querySelectorAll(".select-all-btn").forEach((btn) => {
      const sectionId = btn.dataset.section;
      const section = FEATURES.find((s) => s.id === sectionId);
      if (!section) return;

      const checkboxItems = section.items.filter((item) => Array.isArray(item));
      const allCount = checkboxItems.length;
      const selectedCount = checkboxItems.filter(([id]) => State.has(id)).length;
      const allSelected = selectedCount === allCount;
      btn.textContent = allSelected ? "Deselect all" : "Select all";
    });
  }

  /**
   * Render sidebar navigation items.
   */
  function renderNav(container) {
    container.innerHTML = "";

    FEATURES.forEach((section, index) => {
      const btn = document.createElement("button");
      btn.className = "nav-item";
      btn.dataset.section = section.id;
      btn.innerHTML = `
        <span class="nav-index">${String(index + 1).padStart(2, "0")}</span>
        <span class="nav-label">${esc(section.title)}</span>
      `;
      btn.addEventListener("click", () => {
        const target = document.getElementById(`s-${section.id}`);
        if (target) {
          target.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      });
      container.appendChild(btn);
    });
  }

  /**
   * Update pill counts for each section.
   */
  function updatePills() {
    FEATURES.forEach((section) => {
      const count = State.countInSection(section);
      const total = section.items.length;
      const pill = document.getElementById(`pill-${section.id}`);
      if (pill) {
        pill.textContent = `${count}/${total}`;
        pill.className = count > 0 ? "pill pill--accent" : "pill pill--muted";
      }
    });
    updateSelectAllButtons();
  }

  /**
   * Update hero stats.
   */
  function updateStats() {
    const selectedEl = document.getElementById("selectedCount");
    const sectionEl = document.getElementById("sectionCount");

    if (selectedEl) selectedEl.textContent = State.count;
    if (sectionEl) sectionEl.textContent = FEATURES.length;
  }

  /**
   * Update conditional section visibility based on project type.
   */
  function updateConditionalVisibility() {
    const projectType = document.getElementById("projectType")?.value || "";
    FEATURES.forEach((section) => {
      if (!section.showWhen) return;
      const card = document.getElementById(`s-${section.id}`);
      if (card) {
        const visible = section.showWhen.values.includes(projectType);
        card.classList.toggle("section-card--hidden", !visible);
      }
      // Also toggle sidebar nav item
      document.querySelectorAll(`.nav-item[data-section="${section.id}"]`).forEach((item) => {
        item.classList.toggle("nav-item--hidden", !section.showWhen.values.includes(projectType));
      });
    });
  }

  return {
    renderSections,
    renderNav,
    updatePills,
    updateStats,
    updateSelectAllButtons,
    updateConditionalVisibility,
    isSectionVisible,
    esc
  };
})();
