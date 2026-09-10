/**
 * State Management
 *
 * Manages the set of selected feature IDs with localStorage persistence.
 * Dispatches a custom "selectionchange" event on the document whenever
 * the selection changes, so other modules can react.
 */

const State = (() => {
  const STORAGE_KEY = "pa-selected";
  const selected = new Set(
    JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]")
  );

  function save() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify([...selected]));
    document.dispatchEvent(new CustomEvent("selectionchange"));
  }

  return {
    /** Check if an item is selected */
    has(id) {
      return selected.has(id);
    },

    /** Toggle an item on or off. Returns new checked state. */
    toggle(id) {
      if (selected.has(id)) {
        selected.delete(id);
      } else {
        selected.add(id);
      }
      save();
      return selected.has(id);
    },

    /** Select an item */
    select(id) {
      selected.add(id);
    },

    /** Deselect an item */
    deselect(id) {
      selected.delete(id);
    },

    /** For radio groups: select one, deselect others in the group */
    selectRadio(id, groupIds) {
      groupIds.forEach((gid) => selected.delete(gid));
      selected.add(id);
      save();
    },

    /** Clear all selections */
    clear() {
      selected.clear();
      save();
    },

    /** Number of selected items */
    get count() {
      return selected.size;
    },

    /** Get all selected IDs as an array */
    get all() {
      return [...selected];
    },

    /** Count selected items within a specific section */
    countInSection(section) {
      return section.items.filter(([id]) => selected.has(id)).length;
    },

    /** Manually trigger save + event (for batch operations) */
    save() {
      save();
    }
  };
})();
