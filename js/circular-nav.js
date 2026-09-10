/**
 * CircularNav -- Infinite Swipeable Mobile Navigation
 *
 * Creates a circular, gesture-driven navigation bar that shows ~5-6 items
 * at a time, loops infinitely, syncs with page scroll, and feels native.
 *
 * Technique: Render 3x copies of items (prev + center + next).
 * Position at the center copy. When scroll drifts past boundaries,
 * silently jump back to the center copy for seamless infinite loop.
 */

const CircularNav = (() => {
  /* ---- State ---- */
  let container = null;
  let track = null;
  let sections = [];
  let totalItems = 0;
  let activeIndex = 0;
  let itemWidth = 0;
  let containerWidth = 0;

  /* Touch */
  let startX = 0;
  let startY = 0;
  let currentX = 0;
  let isDragging = false;
  let isHorizontalSwipe = null;
  let dragOffset = 0;
  let lastTime = 0;
  let velocity = 0;

  /* Scroll spy */
  let scrollSpyObserver = null;
  let suppressScrollSpy = false;

  /* ---- Public Init ---- */
  function init(sectionData) {
    container = document.getElementById("circularNav");
    track = container?.querySelector(".cnav-track");
    if (!container || !track) return;

    sections = sectionData;
    totalItems = sections.length;

    buildTrack();
    bindTouch();
    initScrollSpy();

    // Set initial position
    setActive(0, false);
  }

  /* ---- Build the 3x looping track ---- */
  function buildTrack() {
    track.innerHTML = "";

    // Calculate item width from container
    containerWidth = container.clientWidth;
    const visibleCount = Math.max(4, Math.min(6, Math.floor(containerWidth / 72)));
    itemWidth = containerWidth / visibleCount;

    // Render 3 copies: [copy0] [center] [copy2]
    for (let copy = 0; copy < 3; copy++) {
      for (let i = 0; i < totalItems; i++) {
        const item = document.createElement("div");
        item.className = "cnav-item";
        item.style.width = itemWidth + "px";
        item.dataset.index = i;
        item.dataset.copy = copy;

        const label = sections[i].title;
        // Truncate long labels
        const shortLabel = label.length > 10 ? label.slice(0, 9) + "…" : label;

        item.innerHTML = `
          <span class="cnav-item-index">${i + 1}</span>
          <span class="cnav-item-label">${shortLabel}</span>
        `;

        item.addEventListener("click", () => {
          onItemTap(i);
        });

        track.appendChild(item);
      }
    }
  }

  /* ---- Positioning ---- */
  function getOffset(index) {
    // Position so that `index` in the CENTER copy is centered on screen
    const centerCopyStart = totalItems * itemWidth; // start of center copy
    const itemCenter = centerCopyStart + (index * itemWidth) + (itemWidth / 2);
    return -(itemCenter - containerWidth / 2);
  }

  function setActive(index, animate = true) {
    activeIndex = ((index % totalItems) + totalItems) % totalItems;

    // Update active class on all copies
    track.querySelectorAll(".cnav-item").forEach((el) => {
      const elIndex = parseInt(el.dataset.index);
      el.classList.toggle("active", elIndex === activeIndex);
    });

    // Position track
    const offset = getOffset(activeIndex);
    if (!animate) {
      track.classList.add("no-transition");
    } else {
      track.classList.remove("no-transition");
    }

    track.style.transform = `translateX(${offset}px)`;

    if (!animate) {
      // Force reflow then remove no-transition
      track.offsetHeight;
      track.classList.remove("no-transition");
    }
  }

  /* ---- Touch Handling ---- */
  function bindTouch() {
    container.addEventListener("touchstart", onTouchStart, { passive: true });
    container.addEventListener("touchmove", onTouchMove, { passive: false });
    container.addEventListener("touchend", onTouchEnd, { passive: true });
    container.addEventListener("touchcancel", onTouchEnd, { passive: true });
  }

  function onTouchStart(e) {
    const touch = e.touches[0];
    startX = touch.clientX;
    startY = touch.clientY;
    currentX = startX;
    isDragging = true;
    isHorizontalSwipe = null;
    dragOffset = 0;
    lastTime = Date.now();
    velocity = 0;

    track.classList.add("dragging");
  }

  function onTouchMove(e) {
    if (!isDragging) return;

    const touch = e.touches[0];
    const dx = touch.clientX - startX;
    const dy = touch.clientY - startY;

    // Determine swipe direction on first significant move
    if (isHorizontalSwipe === null) {
      if (Math.abs(dx) > 5 || Math.abs(dy) > 5) {
        isHorizontalSwipe = Math.abs(dx) > Math.abs(dy);
        if (!isHorizontalSwipe) {
          // Vertical scroll - abort horizontal handling entirely
          isDragging = false;
          track.classList.remove("dragging");
          return;
        }
      } else {
        return;
      }
    }

    if (!isHorizontalSwipe) return;

    // Prevent vertical scroll while swiping horizontally
    e.preventDefault();

    // Calculate velocity
    const now = Date.now();
    const dt = now - lastTime;
    if (dt > 0) {
      velocity = (touch.clientX - currentX) / dt;
    }
    currentX = touch.clientX;
    lastTime = now;

    // Apply drag offset
    dragOffset = dx;
    const baseOffset = getOffset(activeIndex);
    track.style.transform = `translateX(${baseOffset + dragOffset}px)`;
  }

  function onTouchEnd() {
    if (!isDragging || !isHorizontalSwipe) {
      isDragging = false;
      track.classList.remove("dragging");
      return;
    }

    isDragging = false;
    track.classList.remove("dragging");

    // Determine how many items to move based on drag distance + velocity
    const totalDrag = dragOffset + velocity * 120;
    const itemsMoved = Math.round(-totalDrag / itemWidth);

    if (itemsMoved !== 0) {
      const newIndex = activeIndex + itemsMoved;
      suppressScrollSpy = true;
      setActive(newIndex, true);

      // Scroll to the section
      const targetSection = document.getElementById(`s-${sections[activeIndex].id}`);
      if (targetSection) {
        targetSection.scrollIntoView({ behavior: "smooth", block: "start" });
      }

      // Re-enable scroll spy after animation
      setTimeout(() => { suppressScrollSpy = false; }, 600);
    } else {
      // Snap back
      setActive(activeIndex, true);
    }
  }

  /* ---- Item Tap ---- */
  function onItemTap(index) {
    if (Math.abs(dragOffset) > 5) return; // Was a drag, not a tap

    suppressScrollSpy = true;
    setActive(index, true);

    const targetSection = document.getElementById(`s-${sections[index].id}`);
    if (targetSection) {
      targetSection.scrollIntoView({ behavior: "smooth", block: "start" });
    }

    setTimeout(() => { suppressScrollSpy = false; }, 600);
  }

  /* ---- Scroll Spy ---- */
  function initScrollSpy() {
    if (scrollSpyObserver) scrollSpyObserver.disconnect();

    const sectionCards = document.querySelectorAll(".section-card[id^='s-']");
    if (!sectionCards.length) return;

    scrollSpyObserver = new IntersectionObserver(
      (entries) => {
        if (suppressScrollSpy) return;

        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const sectionId = entry.target.id.replace("s-", "");
            const idx = sections.findIndex((s) => s.id === sectionId);
            if (idx >= 0 && idx !== activeIndex) {
              setActive(idx, true);
            }
          }
        });
      },
      {
        rootMargin: "-30% 0px -60% 0px",
        threshold: 0
      }
    );

    sectionCards.forEach((card) => scrollSpyObserver.observe(card));
  }

  /* ---- Update from external (e.g. search clearing) ---- */
  function refresh() {
    if (!container || window.innerWidth > 820) return;
    buildTrack();
    setActive(activeIndex, false);
    initScrollSpy();
  }

  return { init, setActive, refresh };
})();
