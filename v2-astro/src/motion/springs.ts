/**
 * springs.ts  —  src/motion/springs.ts
 * ============================================================
 * Tiny spring-physics engine behind the space-bar card jump.
 *
 * CHEAT SHEET — CMD+F these labels:
 *   "Presets"   → the named feels (jelly, snappy…) — tune these, not per-component numbers
 *   "Loop"      → the single shared requestAnimationFrame loop
 *   "Spring"    → the Spring class: .to(target) and .kick(velocity)
 * ============================================================
 *
 * A spring never animates anything itself — it hands its value to an
 * onUpdate callback, which usually writes a CSS custom property. CSS
 * decides what that number means (scale, rotate, shadow…).
 *
 * Tuning intuition:
 *   stiffness ↑ → faster, tighter wobble
 *   damping   ↓ → more wobbles before settling (jellier)
 *   mass      ↑ → heavier, slower, more momentum
 */

export interface SpringConfig {
  stiffness: number;
  damping: number;
  mass: number;
}

/* =============================================
   Presets
============================================= */
export const springs = {
  jelly:  { stiffness: 300, damping: 8,  mass: 1 },   // several visible wobbles, ~1s settle
  snappy: { stiffness: 500, damping: 30, mass: 1 },   // quick, barely overshoots
  lazy:   { stiffness: 120, damping: 14, mass: 1.5 }, // slow, floaty
} satisfies Record<string, SpringConfig>;

const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

/* =============================================
   Loop
   One rAF loop for every spring on the page. It only runs while
   at least one spring is moving, then goes to sleep.
============================================= */
const STEP = 1 / 240;   // fixed physics substep — keeps stiff springs stable at any frame rate
const REST = 0.0005;    // below this speed + distance a spring counts as settled

const active = new Set<Spring>();
let frame = 0;
let last = 0;

function tick(now: number) {
  const dt = Math.min((now - last) / 1000, 1 / 30); // clamp so a background tab doesn't explode on return
  last = now;
  for (const spring of active) spring.step(dt);
  frame = active.size ? requestAnimationFrame(tick) : 0;
}

function wake(spring: Spring) {
  active.add(spring);
  if (!frame) {
    last = performance.now();
    frame = requestAnimationFrame(tick);
  }
}

/* =============================================
   Spring
============================================= */
export class Spring {
  value: number;
  target: number;
  velocity = 0;

  constructor(
    value: number,
    public config: SpringConfig,
    private onUpdate: (value: number) => void,
    private onRest?: () => void,
  ) {
    this.value = value;
    this.target = value;
  }

  /** Glide to a new resting value (overshooting on the way, per config). */
  to(target: number) {
    this.target = target;
    if (reducedMotion.matches) {
      this.value = target;
      this.velocity = 0;
      this.onUpdate(target);
      return;
    }
    wake(this);
  }

  /** Punch the spring with a velocity and let it wobble back to its target.
   *  Replaces (doesn't add to) current velocity, so rapid re-triggers re-pop
   *  instead of stacking energy. */
  kick(velocity: number) {
    if (reducedMotion.matches) return;
    this.velocity = velocity;
    wake(this);
  }

  step(dt: number) {
    const { stiffness: k, damping: c, mass: m } = this.config;

    // Semi-implicit Euler: F = -k·x - c·v
    for (let t = 0; t < dt; t += STEP) {
      const h = Math.min(STEP, dt - t);
      const accel = (-k * (this.value - this.target) - c * this.velocity) / m;
      this.velocity += accel * h;
      this.value += this.velocity * h;
    }

    const settled =
      Math.abs(this.velocity) < REST && Math.abs(this.value - this.target) < REST;
    if (settled) {
      this.value = this.target;
      this.velocity = 0;
      active.delete(this);
    }

    this.onUpdate(this.value);
    if (settled) this.onRest?.();
  }
}
