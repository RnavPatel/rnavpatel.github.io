(function autoWrapMedia() {
  const media = document.querySelectorAll("img, video");

  media.forEach(el => {
    // Skip if already wrapped
    if (el.closest(".media-load")) return;

    // Skip slideshows / special systems if needed
    if (el.closest(".process-slideshow")) return;

    const wrapper = document.createElement("div");
    wrapper.className = "media-load";

    el.parentNode.insertBefore(wrapper, el);
    wrapper.appendChild(el);
  });
})();


(function () {
  const DEBUG_DELAY = false;
  const DEBUG_DELAY_MS = 800;

  function initMediaLoaders(root) {
    if (!(root instanceof Element) && root !== document) {
      root = document;
    }

    const blocks = root.querySelectorAll(".media-load");

    blocks.forEach(block => {
      const media = block.querySelector("img, video");
      if (!media) return;

      block.classList.add("is-loading");

      const done = () => {
        if (DEBUG_DELAY) {
          setTimeout(() => block.classList.remove("is-loading"), DEBUG_DELAY_MS);
        } else {
          block.classList.remove("is-loading");
        }
      };

      if (media.tagName === "IMG") {
        if (media.complete && media.naturalWidth > 0) done();
        else media.addEventListener("load", done, { once: true });
      }

      if (media.tagName === "VIDEO") {
        if (media.readyState >= 2) done();
        else media.addEventListener("loadeddata", done, { once: true });
      }
    });
  }

  document.addEventListener("DOMContentLoaded", () => {
    initMediaLoaders();
  });

  // expose for dynamically injected content later if needed
  window.initMediaLoaders = initMediaLoaders;
})();
