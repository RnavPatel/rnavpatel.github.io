function initProcessSlideshow(slideshow) {
  const folder = slideshow.dataset.folder;
  const max = parseInt(slideshow.dataset.max, 10);

  const strip = slideshow.querySelector(".process-strip");
  const stripWrapper = slideshow.querySelector(".process-strip-wrapper");
  const progressFill = slideshow.querySelector(".process-progress-fill");

  const extensions = ["jpg", "jpeg", "png", "webp", "mp4"];

  //
  // ------------------------------------------------------------
  // 1. BUILD SLIDES (ORDER LOCKED)
  // ------------------------------------------------------------
  //
  for (let i = 1; i <= max; i++) {
    const indexStr = String(i).padStart(2, "0");

    // 🔒 Create slide container FIRST (locks order)
    const item = createItem();
    strip.appendChild(item);

    let filled = false;

    extensions.forEach(ext => {
      if (filled) return;

      const url = `${folder}Process_${indexStr}.${ext}`;

      if (ext === "mp4") {
        const video = document.createElement("video");
        video.src = url;
        video.muted = true;
        video.loop = true;
        video.playsInline = true;
        video.autoplay = true;

        // Use loadedmetadata for consistency
        video.onloadedmetadata = () => {
          if (!filled) {
            item.appendChild(video);
            filled = true;
          }
        };
      } else {
        const img = new Image();
        img.src = url;
        img.onload = () => {
          if (!filled) {
            item.appendChild(img);
            filled = true;
          }
        };
      }
    });
  }

  function createItem() {
    const item = document.createElement("div");
    item.className = "process-item";
    return item;
  }

  //
  // ------------------------------------------------------------
  // 2. SLIDESHOW VARIABLES
  // ------------------------------------------------------------
  //
  let currentIndex = 0;
  let isHovered = false;
  let autoTimer = null;
  let isAutoScrolling = false;

  const slideDuration = 3000;
  const transitionDuration = 600;

  //
  // ------------------------------------------------------------
  // 3. UPDATE PROGRESS BAR
  // ------------------------------------------------------------
  //
  function updateProgressFromIndex(index) {
    const total = strip.children.length;
    if (!total) return;

    const progress = ((index + 1) / total) * 100;
    progressFill.style.width = `${progress}%`;
  }

  //
  // ------------------------------------------------------------
  // 4. SCROLL TO A SPECIFIC SLIDE (CENTERED)
  // ------------------------------------------------------------
  //
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

  //
  // ------------------------------------------------------------
  // 5. GET INDEX CLOSEST TO CENTER (MANUAL SCROLL)
  // ------------------------------------------------------------
  //
  function getCenteredIndex() {
    const items = strip.children;
    if (!items.length) return -1;

    const wrapperCenter =
      stripWrapper.scrollLeft + stripWrapper.clientWidth / 2;

    let closestIndex = -1;
    let smallestDelta = Infinity;

    for (let i = 0; i < items.length; i++) {
      const center =
        items[i].offsetLeft + items[i].clientWidth / 2;

      const dist = Math.abs(center - wrapperCenter);
      if (dist < smallestDelta) {
        smallestDelta = dist;
        closestIndex = i;
      }
    }

    return closestIndex;
  }

  //
  // ------------------------------------------------------------
  // 6. SYNC PROGRESS BAR ON MANUAL SCROLL
  // ------------------------------------------------------------
  //
  let scrollTimeout = null;

  stripWrapper.addEventListener("scroll", () => {
    if (isAutoScrolling) return;

    if (scrollTimeout) clearTimeout(scrollTimeout);

    scrollTimeout = setTimeout(() => {
      const idx = getCenteredIndex();
      if (idx !== -1) {
        currentIndex = idx;
        updateProgressFromIndex(idx);
      }
    }, 80);
  });

  //
  // ------------------------------------------------------------
  // 7. AUTOPLAY
  // ------------------------------------------------------------
  //
  function startAuto() {
    if (!strip.children.length) return;

    scrollToIndex(0);
    progressFill.style.transition = "width 200ms ease";

    autoTimer = setInterval(() => {
      if (isHovered) return;

      const total = strip.children.length;
      scrollToIndex((currentIndex + 1) % total);
    }, slideDuration + transitionDuration);
  }

  //
  // ------------------------------------------------------------
  // 8. PAUSE ON HOVER
  // ------------------------------------------------------------
  //
  slideshow.addEventListener("mouseenter", () => (isHovered = true));
  slideshow.addEventListener("mouseleave", () => (isHovered = false));

  //
  // ------------------------------------------------------------
  // 9. START ONCE FIRST SLIDE EXISTS
  // ------------------------------------------------------------
  //
  const readyCheck = setInterval(() => {
    if (strip.children.length > 0) {
      clearInterval(readyCheck);
      startAuto();
    }
  }, 200);
}

//
// ------------------------------------------------------------
// BOOTSTRAP ALL SLIDESHOWS
// ------------------------------------------------------------
//
document.addEventListener("DOMContentLoaded", () => {
  document
    .querySelectorAll(".process-slideshow")
    .forEach(initProcessSlideshow);
});
