/**
 * Interactions
 *
 * Handles scroll-spy for sidebar active state, staggered card entrance
 * animations, mobile preview sheet toggle, and theme transitions.
 */

const Interactions = (() => {
  let activeNavItem = null;

  /**
   * Set up IntersectionObserver for scroll-spy on section cards.
   * Highlights the corresponding sidebar nav item when a section
   * enters the viewport.
   */
  function initScrollSpy() {
    const navItems = document.querySelectorAll(".nav-item");
    const sections = document.querySelectorAll(".section-card");

    if (!sections.length || !navItems.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const sectionId = entry.target.id.replace("s-", "");
            setActiveNav(sectionId, navItems);
          }
        });
      },
      {
        rootMargin: "-20% 0px -70% 0px",
        threshold: 0
      }
    );

    sections.forEach((section) => observer.observe(section));
  }

  /**
   * Update the active nav item with smooth transition.
   */
  function setActiveNav(sectionId, navItems) {
    if (activeNavItem) {
      activeNavItem.classList.remove("active");
    }

    navItems.forEach((item) => {
      if (item.dataset.section === sectionId) {
        item.classList.add("active");
        activeNavItem = item;

        // Scroll the nav item into view if in horizontal mode
        if (window.innerWidth <= 820) {
          item.scrollIntoView({
            behavior: "smooth",
            block: "nearest",
            inline: "center"
          });
        }
      }
    });
  }

  /**
   * Set up mobile preview sheet toggle.
   */
  function initPreviewSheet() {
    const preview = document.querySelector(".preview");
    const backdrop = document.querySelector(".preview-backdrop");
    const toggleBtns = document.querySelectorAll("[data-toggle-preview]");

    if (!preview || !backdrop) return;

    function openPreview() {
      preview.classList.add("open");
      backdrop.classList.add("visible");
      document.body.style.overflow = "hidden";
    }

    function closePreview() {
      preview.classList.remove("open");
      backdrop.classList.remove("visible");
      document.body.style.overflow = "";
    }

    toggleBtns.forEach((btn) => {
      btn.addEventListener("click", () => {
        if (preview.classList.contains("open")) {
          closePreview();
        } else {
          openPreview();
        }
      });
    });

    backdrop.addEventListener("click", closePreview);

    // Close on Escape key
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && preview.classList.contains("open")) {
        closePreview();
      }
    });

    // Close preview grab bar tap
    const grab = preview.querySelector(".preview-grab");
    if (grab) {
      grab.addEventListener("click", closePreview);
    }
  }

  /**
   * Smooth theme transition -- adds a brief class to enable
   * cross-fade during theme switch.
   */
  function themeTransition(callback) {
    document.documentElement.classList.add("theme-transitioning");
    callback();
    requestAnimationFrame(() => {
      setTimeout(() => {
        document.documentElement.classList.remove("theme-transitioning");
      }, 400);
    });
  }

  /**
   * Initialize all interactions.
   */
  function init() {
    initScrollSpy();
    initPreviewSheet();
  }

  return {
    init,
    themeTransition
  };
})();
