const INTERACT = "199Cook"; //if you're reading this, why must you hack me :( hope you like the work

const form = document.getElementById("pw-form");
const input = document.getElementById("pw-input");
const error = document.getElementById("pw-error");
const gateSection = document.getElementById("pw-gate");
const protectedSection = document.getElementById("protected-content");

// Safety check in case elements are missing
if (gateSection) {
  gateSection.style.opacity = "1";
  gateSection.style.transition = "opacity 0.6s ease";
}

if (protectedSection) {
  // Start fully transparent (it also has .hidden in your HTML)
  protectedSection.style.opacity = "0";
  protectedSection.style.transition = "opacity 0.6s ease";
}

if (form) {
  form.addEventListener("submit", function (event) {
    event.preventDefault();

    if (input.value === INTERACT) {
      error.textContent = ""; // clear any previous error

      // Fade out the password gate
      if (gateSection) {
        gateSection.style.opacity = "0";
      }

      // After fade-out ends...
      setTimeout(() => {
        if (gateSection) {
          gateSection.remove(); // ✨ completely remove from layout
        }

        if (protectedSection) {
          // Make sure it's in the layout before fading in
          protectedSection.classList.remove("hidden");
          protectedSection.style.opacity = "0";

          // Next frame: fade it in
          requestAnimationFrame(() => {
            protectedSection.style.opacity = "1";

            // Smooth scroll to it
            protectedSection.scrollIntoView({
              behavior: "smooth",
              block: "start"
            });
          });
        }
      }, 600); // match 0.6s from transition
    } else {
      error.textContent = "Incorrect password. Please try again.";
    }
  });
}
