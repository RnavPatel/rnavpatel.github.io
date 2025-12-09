function initProcessSlideshow(slideshow) {
  const folder = slideshow.dataset.folder;
  const max = parseInt(slideshow.dataset.max, 10);

  const strip = slideshow.querySelector(".process-strip");
  const stripWrapper = slideshow.querySelector(".process-strip-wrapper");
  const progressFill = slideshow.querySelector(".process-progress-fill");

  const extensions = ["jpg", "jpeg", "png", "webp", "mp4"];

  // ------------------------------------------------------------
  // 1. BUILD SLIDES FROM FOLDER (ORDERED, NO EMPTY SLOTS)
  // ------------------------------------------------------------

  // placeholders[i-1] = <div class="process-item" data-index="i">
  const placeholders = new Array(max);
  const filled = new Array(max).fill(false);

  function createItem(index) {
    const item = document.createElement("div");
    item.className = "process-item";
    item.dataset.index = index;  // so we can sort/insert by index later
    return item;
  }

  // Try to load each index once
  for (let i = 1; i <= max; i++) {
    const indexStr = String(i).padStart(2, "0");
    const placeholder = createItem(i);
    placeholders[i - 1] = placeholder;

    extensions.forEach(ext => {
      const url = `${folder}Process_${indexStr}.${ext}`;

      // VIDEO
      if (ext === "mp4") {
        const video = document.createElement("video");
        video.src = url;
        video.muted = true;
        video.loop = true;
        video.playsInline = true;
        video.autoplay = true;

        video.oncanplay = () => {
          if (filled[i - 1]) return;   // already have something for this index
          filled[i - 1] = true;

          placeholder.appendChild(video);
          insertPlaceholderInOrder(placeholder);
        };

      // IMAGE
      } else {
        const img = new Image();
        img.src = url;

        img.onload = () => {
          if (filled[i - 1]) return;
          filled[i - 1] = true;

          placeholder.appendChild(img);
          insertPlaceholderInOrder(placeholder);
        };
      }
    });
  }

  // Insert the placeholder into .process-strip in ascending data-index order
  function insertPlaceholderInOrder(placeholder) {
    const newIndex = parseInt(placeholder.dataset.index, 10);
    const children = strip.children;

    let inserted = false;

    for (let j = 0; j < children.length; j++) {
      const childIndex = parseInt(children[j].dataset.index, 10);
      if (childIndex > newIndex) {
        strip.insertBefore(placeholder, children[j]);
        inserted = true;
        break;
      }
    }

    if (!inserted) {
      strip.appendChild(placeholder);
    }
  }

  // ------------------------------------------------------------
  // 2. SLIDESHOW VARIABLES
  // ------------------------------------------------------------

  let currentIndex = 0;
  let isHovered = false;
  let autoTimer = null;
  let isAutoScrolling = false;   // prevent scroll handler fighting autoplay

  const slideDuration = 3000;
  const transitionDuration = 600;

  // ------------------------------------------------------------
  // 3. PROGRESS BAR
  // ------------------------------------------------------------

  function updateProgressFromIndex(index) {
    const total = strip.children.length;
    if (!total) return;

    const progress = ((index + 1) / total) * 100;
    progressFill.style.width = `${progress}%`;
  }

  // ------------------------------------------------------------
  // 4. SCROLL TO INDEX (CENTERED IN VIEWPORT)
  // ------------------------------------------------------------

  function scrollToIndex(index) {
    const items = strip.children;
    if (!items.length) return;

    const total = items.length;
    const clamped = ((index % total) + total) % total;
    const targetItem = items[clamped];

    const itemRect = targetItem.getBoundingClientRect();
    const wrapperRect = stripWrapper.getBoundingClientRect();

    const itemCenter = itemRect.left + itemRect.width / 2;
    const wrapperCenter = wrapperRect.left + wrapperRect.width / 2;

    const delta = itemCenter - wrapperCenter;
    const targetLeft = stripWrapper.scrollLeft + delta;

    isAutoScrolling = true;

    stripWrapper.scrollTo({
      left: targetLeft,
      behavior: "smooth"
    });

    setTimeout(() => {
      isAutoScrolling = false;
    }, transitionDuration + 50);

    currentIndex = clamped;
    updateProgressFromIndex(clamped);
  }

  // ------------------------------------------------------------
  // 5. FIND SLIDE CLOSEST TO CENTER (manual scroll)
  // ------------------------------------------------------------

  function getCenteredIndex() {
    const items = strip.children;
    if (!items.length) return -1;

    const wrapperCenter = stripWrapper.scrollLeft + stripWrapper.clientWidth / 2;

    let closestIndex = -1;
    let closestDist = Infinity;

    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      const itemCenter = item.offsetLeft + item.clientWidth / 2;
      const dist = Math.abs(itemCenter - wrapperCenter);

      if (dist < closestDist) {
        closestDist = dist;
        closestIndex = i;
      }
    }

    return closestIndex;
  }

  // ------------------------------------------------------------
  // 6. SYNC BAR WHEN USER SCROLLS
  // ------------------------------------------------------------

  let scrollTimeout = null;

  stripWrapper.addEventListener("scroll", () => {
    if (isAutoScrolling) return;  // ignore scroll events caused by autoplay

    if (scrollTimeout) clearTimeout(scrollTimeout);

    scrollTimeout = setTimeout(() => {
      const idx = getCenteredIndex();
      if (idx !== -1) {
        currentIndex = idx;
        updateProgressFromIndex(idx);
      }
    }, 80);
  });

  // ------------------------------------------------------------
  // 7. AUTOPLAY
  // ------------------------------------------------------------

  function startAuto() {
    if (!strip.children.length) return;

    scrollToIndex(0);
    progressFill.style.transition = "width 200ms ease";

    autoTimer = setInterval(() => {
      if (isHovered) return;

      const total = strip.children.length;
      if (!total) return;

      const nextIndex = (currentIndex + 1) % total;
      scrollToIndex(nextIndex);
    }, slideDuration + transitionDuration);
  }

  // ------------------------------------------------------------
  // 8. PAUSE ON HOVER
  // ------------------------------------------------------------

  slideshow.addEventListener("mouseenter", () => (isHovered = true));
  slideshow.addEventListener("mouseleave", () => (isHovered = false));

  // ------------------------------------------------------------
  // 9. WAIT FOR FIRST REAL SLIDE, THEN START AUTOPLAY
  // ------------------------------------------------------------

  const readyCheck = setInterval(() => {
    if (strip.children.length > 0) {
      clearInterval(readyCheck);
      startAuto();
    }
  }, 200);
}

// ------------------------------------------------------------
// BOOTSTRAP ALL SLIDESHOWS
// ------------------------------------------------------------
document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll(".process-slideshow").forEach(initProcessSlideshow);
});
