/**
 * State Management
 *
 * Manages checkbox selections, dropdown values, text inputs,
 * presets, history, undo/redo, and URL hash encoding.
 * Dispatches a custom "selectionchange" event on the document whenever
 * the state changes, so other modules can react.
 */

const State = (() => {
  const STORAGE_KEY = "pa-selected";
  const STORAGE_KEY_DD = "pa-dropdowns";
  const STORAGE_KEY_TXT = "pa-texts";
  const PRESETS_KEY = "pa-presets";
  const HISTORY_KEY = "pa-history";
  const UNDO_KEY = "pa-undo";
  const REDO_KEY = "pa-redo";
  const MAX_HISTORY = 20;
  const MAX_UNDO = 50;

  /* ---- Core state ---- */
  const selected = new Set(
    JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]")
  );
  const dropdowns = JSON.parse(
    localStorage.getItem(STORAGE_KEY_DD) || "{}"
  );
  const texts = JSON.parse(
    localStorage.getItem(STORAGE_KEY_TXT) || "{}"
  );

  /* ---- Custom sections (user-added) ---- */
  let customSections = JSON.parse(
    localStorage.getItem("pa-custom-sections") || "[]"
  );

  /* ---- Emit change event ---- */
  function emit() {
    document.dispatchEvent(new CustomEvent("selectionchange"));
  }

  /* ---- Persist to localStorage ---- */
  function save() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify([...selected]));
      localStorage.setItem(STORAGE_KEY_DD, JSON.stringify(dropdowns));
      localStorage.setItem(STORAGE_KEY_TXT, JSON.stringify(texts));
      localStorage.setItem("pa-custom-sections", JSON.stringify(customSections));
    } catch (e) {
      /* quota exceeded -- silently continue */
    }
    emit();
  }

  /* ---- Snapshot for undo/presets ---- */
  function snapshot() {
    return {
      checkboxes: [...selected],
      dropdowns: { ...dropdowns },
      texts: { ...texts }
    };
  }

  function restore(snap) {
    selected.clear();
    if (snap.checkboxes) snap.checkboxes.forEach((id) => selected.add(id));
    Object.keys(dropdowns).forEach((k) => delete dropdowns[k]);
    Object.assign(dropdowns, snap.dropdowns || {});
    Object.keys(texts).forEach((k) => delete texts[k]);
    Object.assign(texts, snap.texts || {});
  }

  /* ---- Undo / Redo ---- */
  let undoStack = JSON.parse(localStorage.getItem(UNDO_KEY) || "[]");
  let redoStack = JSON.parse(localStorage.getItem(REDO_KEY) || "[]");

  function pushUndo() {
    undoStack.push(snapshot());
    if (undoStack.length > MAX_UNDO) undoStack.shift();
    redoStack = [];
    try {
      localStorage.setItem(UNDO_KEY, JSON.stringify(undoStack));
      localStorage.setItem(REDO_KEY, JSON.stringify(redoStack));
    } catch (e) { /* ignore */ }
  }

  /* ---- Public API ---- */
  return {

    /* ---- Checkbox operations ---- */
    has(id) {
      return selected.has(id);
    },

    toggle(id) {
      pushUndo();
      if (selected.has(id)) {
        selected.delete(id);
      } else {
        selected.add(id);
      }
      save();
      return selected.has(id);
    },

    select(id) {
      selected.add(id);
    },

    deselect(id) {
      selected.delete(id);
    },

    selectRadio(id, groupIds) {
      pushUndo();
      groupIds.forEach((gid) => selected.delete(gid));
      selected.add(id);
      save();
    },

    /* ---- Dropdown operations ---- */
    getDropdown(id) {
      return dropdowns[id] || "";
    },

    setDropdown(id, value) {
      pushUndo();
      if (value) {
        dropdowns[id] = value;
      } else {
        delete dropdowns[id];
      }
      save();
    },

    /* ---- Text input operations ---- */
    getText(id) {
      return texts[id] || "";
    },

    setText(id, value) {
      pushUndo();
      if (value && value.trim()) {
        texts[id] = value.trim();
      } else {
        delete texts[id];
      }
      save();
    },

    /* ---- Custom sections ---- */
    getCustomSections() {
      return customSections;
    },

    addCustomSection(section) {
      pushUndo();
      customSections.push(section);
      save();
    },

    removeCustomSection(index) {
      pushUndo();
      customSections.splice(index, 1);
      save();
    },

    /* ---- Aggregate counts ---- */
    hasAny() {
      return selected.size > 0;
    },

    clear() {
      pushUndo();
      selected.clear();
      Object.keys(dropdowns).forEach((k) => delete dropdowns[k]);
      Object.keys(texts).forEach((k) => delete texts[k]);
      save();
    },

    get count() {
      return selected.size + Object.keys(dropdowns).length +
        Object.values(texts).filter((v) => v.trim()).length;
    },

    get all() {
      return [...selected];
    },

    countInSection(section) {
      let count = 0;
      section.items.forEach((item) => {
        if (Array.isArray(item)) {
          /* checkbox */
          if (selected.has(item[0])) count++;
        } else if (item.type === "dropdown") {
          if (dropdowns[item.id]) count++;
        } else if (item.type === "text") {
          if (texts[item.id] && texts[item.id].trim()) count++;
        }
      });
      return count;
    },

    countAllInSection(section) {
      return section.items.length;
    },

    save() {
      save();
    },

    /* ---- Undo / Redo ---- */
    undo() {
      if (!undoStack.length) return false;
      redoStack.push(snapshot());
      restore(undoStack.pop());
      try {
        localStorage.setItem(UNDO_KEY, JSON.stringify(undoStack));
        localStorage.setItem(REDO_KEY, JSON.stringify(redoStack));
      } catch (e) { /* ignore */ }
      save();
      return true;
    },

    redo() {
      if (!redoStack.length) return false;
      undoStack.push(snapshot());
      restore(redoStack.pop());
      try {
        localStorage.setItem(UNDO_KEY, JSON.stringify(undoStack));
        localStorage.setItem(REDO_KEY, JSON.stringify(redoStack));
      } catch (e) { /* ignore */ }
      save();
      return true;
    },

    /* ---- Presets ---- */
    getPresets() {
      return JSON.parse(localStorage.getItem(PRESETS_KEY) || "[]");
    },

    savePreset(name) {
      const presets = this.getPresets();
      presets.push({
        name,
        created: Date.now(),
        ...snapshot()
      });
      try {
        localStorage.setItem(PRESETS_KEY, JSON.stringify(presets));
      } catch (e) { /* ignore */ }
      return presets;
    },

    loadPreset(index) {
      const presets = this.getPresets();
      const preset = presets[index];
      if (!preset) return false;
      pushUndo();
      restore({ checkboxes: preset.checkboxes, dropdowns: preset.dropdowns, texts: preset.texts });
      save();
      return true;
    },

    deletePreset(index) {
      const presets = this.getPresets();
      presets.splice(index, 1);
      try {
        localStorage.setItem(PRESETS_KEY, JSON.stringify(presets));
      } catch (e) { /* ignore */ }
      return presets;
    },

    /* ---- History ---- */
    getHistory() {
      return JSON.parse(localStorage.getItem(HISTORY_KEY) || "[]");
    },

    addToHistory(prompt, project) {
      const history = this.getHistory();
      history.unshift({
        timestamp: Date.now(),
        prompt,
        project: { ...project },
        ...snapshot()
      });
      if (history.length > MAX_HISTORY) history.pop();
      try {
        localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
      } catch (e) { /* ignore */ }
    },

    loadHistory(index) {
      const history = this.getHistory();
      const entry = history[index];
      if (!entry) return null;
      pushUndo();
      restore({ checkboxes: entry.checkboxes, dropdowns: entry.dropdowns, texts: entry.texts });
      save();
      return entry;
    },

    clearHistory() {
      try {
        localStorage.removeItem(HISTORY_KEY);
      } catch (e) { /* ignore */ }
    },

    /* ---- URL Hash ---- */
    toHash(project) {
      const params = new URLSearchParams();
      if (project.name) params.set("n", project.name);
      if (project.type) params.set("t", project.type);
      if (project.description) params.set("d", project.description);
      if (selected.size) params.set("s", [...selected].join(","));
      const ddEntries = Object.entries(dropdowns);
      if (ddEntries.length) {
        params.set("dd", ddEntries.map(([k, v]) => `${k}=${v}`).join(";"));
      }
      const txtEntries = Object.entries(texts);
      if (txtEntries.length) {
        params.set("tx", txtEntries.map(([k, v]) => `${k}=${encodeURIComponent(v)}`).join(";"));
      }
      return params.toString();
    },

    fromHash() {
      const hash = window.location.hash.slice(1);
      if (!hash) return null;
      try {
        const params = new URLSearchParams(hash);
        pushUndo();
        if (params.has("s")) {
          selected.clear();
          params.get("s").split(",").filter(Boolean).forEach((id) => selected.add(id));
        }
        Object.keys(dropdowns).forEach((k) => delete dropdowns[k]);
        if (params.has("dd")) {
          params.get("dd").split(";").filter(Boolean).forEach((pair) => {
            const [k, v] = pair.split("=");
            if (k) dropdowns[k] = v || "";
          });
        }
        Object.keys(texts).forEach((k) => delete texts[k]);
        if (params.has("tx")) {
          params.get("tx").split(";").filter(Boolean).forEach((pair) => {
            const eqIdx = pair.indexOf("=");
            if (eqIdx > 0) {
              const k = pair.slice(0, eqIdx);
              texts[k] = decodeURIComponent(pair.slice(eqIdx + 1));
            }
          });
        }
        save();
        return {
          name: params.get("n") || "",
          type: params.get("t") || "",
          description: params.get("d") || ""
        };
      } catch (e) {
        return null;
      }
    }
  };
})();
