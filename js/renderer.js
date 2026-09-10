/**
 * Renderer
 *
 * Builds all dynamic DOM elements: section cards, sidebar navigation,
 * and updates stats/pills. Uses the FEATURES data and State module.
 */

const Renderer = (() => {
  /**
   * Escape HTML special characters.
   */
  function esc(str) {
    const map = { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;" };
    return str.replace(/[&<>"']/g, (c) => map[c]);
  }

  /**
   * Render all section cards into the builder area.
   */
  function renderSections(container) {
    container.innerHTML = "";

    FEATURES.forEach((section, index) => {
      const card = document.createElement("article");
      card.className = "section-card";
      card.id = `s-${section.id}`;
      card.style.animationDelay = `${index * 0.05}s`;

      const inputType = section.radio ? "radio" : "checkbox";
      const allCount = section.items.length;
      const selectedCount = State.countInSection(section);
      const allSelected = selectedCount === allCount;

      card.innerHTML = `
        <div class="card-header">
          <div class="card-header-left">
            <span class="section-num">${index + 1}</span>
            <h2 class="card-title">${esc(section.title)}</h2>
          </div>
          <div class="card-header-right">
            <span class="pill ${selectedCount > 0 ? 'pill--accent' : 'pill--muted'}" id="pill-${section.id}">${selectedCount}/${allCount}</span>
            ${!section.radio ? `<button class="select-all-btn" data-section="${section.id}">${allSelected ? 'Deselect all' : 'Select all'}</button>` : ''}
          </div>
        </div>
        <p class="card-desc">${esc(section.desc)}</p>
        <div class="options-grid">
          ${section.items
            .map(
              ([id, title, desc]) => `
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
          `
            )
            .join("")}
        </div>
      `;

      container.appendChild(card);
    });

    // Bind change events on all option inputs
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
        updateSelectAllButtons();
      });
    });

    // Bind select all buttons
    container.querySelectorAll(".select-all-btn").forEach((btn) => {
      btn.addEventListener("click", () => {
        const sectionId = btn.dataset.section;
        const section = FEATURES.find((s) => s.id === sectionId);
        if (!section) return;

        const allCount = section.items.length;
        const selectedCount = State.countInSection(section);
        const shouldSelectAll = selectedCount < allCount;

        section.items.forEach(([id]) => {
          if (shouldSelectAll) {
            State.select(id);
          } else {
            State.deselect(id);
          }
        });

        // Update checkbox visual state
        section.items.forEach(([id]) => {
          const checkbox = document.getElementById(`f-${id}`);
          if (checkbox) checkbox.checked = shouldSelectAll;
        });

        State.save();
        updateSelectAllButtons();
      });
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

      const allSelected = State.countInSection(section) === section.items.length;
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

  return {
    renderSections,
    renderNav,
    updatePills,
    updateStats,
    updateSelectAllButtons,
    esc
  };
})();
