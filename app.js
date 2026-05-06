/* ============================================================
   ANILOVE — interactions
============================================================ */

// ---------- Visit tracking ----------
// Two layers so you can pick what's easiest for you:
//
// 1) FORMSPREE PING — fires a hidden form-submission to your existing
//    Formspree endpoint with type="visit". You'll get an email
//    each time someone lands. (Formspree's free tier is rate-limited;
//    we de-dupe per browser per session so it doesn't spam you.)
//
// 2) LOCAL COUNTER — increments a number in localStorage and shows it
//    as the "on the waitlist" stat (purely visual, lives in the user's
//    browser).
//
// Web3Forms — unlimited free submissions.

const FORM_ENDPOINT = "https://api.web3forms.com/submit";
const WEB3_ACCESS_KEY = "92e0c3a1-b36c-4f55-95e8-398a8e4d54a1";

// Visit tracking disabled to preserve form quota.
// Only waitlist signups are sent to Web3Forms.

// ---------- Sakura petals ----------
(function makePetals() {
  const root = document.getElementById("petals");
  if (!root) return;
  const N = 24;
  for (let i = 0; i < N; i++) {
    const p = document.createElement("div");
    p.className = "petal";
    const left = Math.random() * 100;
    const dur = 9 + Math.random() * 12;
    const delay = -Math.random() * dur;
    const size = 8 + Math.random() * 12;
    const drift = (Math.random() - 0.5) * 240;
    p.style.left = left + "vw";
    p.style.width = size + "px";
    p.style.height = size + "px";
    p.style.animationDuration = dur + "s";
    p.style.animationDelay = delay + "s";
    p.style.setProperty("--drift", drift + "px");
    p.style.opacity = (0.5 + Math.random() * 0.5).toFixed(2);
    p.animate(
      [
        { transform: `translate3d(0,-10vh,0) rotate(0deg)` },
        { transform: `translate3d(${drift}px,110vh,0) rotate(${720 + Math.random() * 360}deg)` },
      ],
      {
        duration: dur * 1000,
        delay: delay * 1000,
        iterations: Infinity,
        easing: "linear",
      }
    );
    root.appendChild(p);
  }
})();

// ---------- Word swap (Waifu / Husbando) ----------
(function wordSwap() {
  const rotator = document.getElementById("rotator");
  if (!rotator) return;
  const words = [
    { text: "Waifu", cls: "" },
    { text: "Husbando", cls: "blue" },
    { text: "Soulmate", cls: "" },
    { text: "Plot Twist", cls: "blue" },
  ];
  let i = 0;
  let busy = false;

  function tick() {
    if (busy) return;
    busy = true;
    i = (i + 1) % words.length;
    const w = words[i];
    const old = rotator.querySelector(".word");
    const next = document.createElement("span");
    next.className = "word " + w.cls;
    next.textContent = w.text;
    next.style.opacity = "0";
    next.style.transform = "translateY(100%)";
    rotator.appendChild(next);
    requestAnimationFrame(() => {
      next.style.opacity = "1";
      next.style.transform = "translateY(0)";
      if (old) {
        old.style.opacity = "0";
        old.style.transform = "translateY(-100%)";
        setTimeout(() => { old.remove(); busy = false; }, 520);
      } else { busy = false; }
    });
  }
  setInterval(tick, 2400);
})();

// ---------- Animated counter ----------
(function animateCount() {
  const el = document.getElementById("count");
  if (!el) return;
  const target = 12847;
  let cur = 12000;
  const step = () => {
    cur += Math.max(1, Math.round((target - cur) / 18));
    el.textContent = cur.toLocaleString();
    if (cur < target) requestAnimationFrame(step);
    else {
      // gentle drift up
      setInterval(() => {
        const next = Number(el.textContent.replace(/,/g, "")) + Math.floor(Math.random() * 3);
        el.textContent = next.toLocaleString();
      }, 6500);
    }
  };
  step();
})();

// ---------- Reveal on scroll ----------
(function reveal() {
  const els = document.querySelectorAll(".reveal");
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          e.target.classList.add("in");
          io.unobserve(e.target);
        }
      });
    },
    { threshold: 0.12 }
  );
  els.forEach((el) => io.observe(el));
})();

// ---------- Heart click burst ----------
(function clickBurst() {
  document.addEventListener("click", (ev) => {
    // only on cta or submit clicks
    const t = ev.target.closest(".btn-primary, .submit, .heart-stamp");
    if (!t) return;
    const r = t.getBoundingClientRect();
    const cx = r.left + r.width / 2;
    const cy = r.top + r.height / 2;
    for (let i = 0; i < 10; i++) {
      const heart = document.createElement("div");
      heart.textContent = "♥";
      heart.style.cssText = `
        position:fixed; left:${cx}px; top:${cy}px;
        font-size:${14 + Math.random() * 18}px;
        color: ${Math.random() > 0.5 ? "#ff3b8b" : "#ffc4d8"};
        pointer-events:none; z-index:9999;
        text-shadow: 0 0 12px rgba(255,59,139,.7);
      `;
      document.body.appendChild(heart);
      const dx = (Math.random() - 0.5) * 220;
      const dy = -120 - Math.random() * 160;
      heart.animate(
        [
          { transform: "translate(-50%,-50%) scale(.4)", opacity: 1 },
          { transform: `translate(calc(-50% + ${dx}px), calc(-50% + ${dy}px)) scale(1.2)`, opacity: 0 },
        ],
        { duration: 900 + Math.random() * 400, easing: "cubic-bezier(.2,.7,.3,1)" }
      ).onfinish = () => heart.remove();
    }
  });
})();

// ---------- Form submission (Formspree) ----------
(function form() {
  const form = document.getElementById("waitlist");
  const success = document.getElementById("success");
  const btn = document.getElementById("submitBtn");
  if (!form) return;

  form.addEventListener("submit", async (ev) => {
    ev.preventDefault();
    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }
    btn.disabled = true;
    const original = btn.textContent;
    btn.textContent = "Sending…";

    const fd = new FormData(form);
    fd.append("type", "waitlist-signup");
    fd.append("subject", "💌 New Anilove waitlist signup");
    fd.append("access_key", WEB3_ACCESS_KEY);

    try {
      const res = await fetch(FORM_ENDPOINT, {
        method: "POST",
        body: fd,
        headers: { Accept: "application/json" },
      });
      if (!res.ok) throw new Error("Form failed");

      // Success — swap UI
      form.style.transition = "opacity .35s ease, transform .35s ease";
      form.style.opacity = "0";
      form.style.transform = "translateY(-12px)";
      setTimeout(() => {
        form.style.display = "none";
        success.classList.add("on");
        // burst
        const r = success.getBoundingClientRect();
        burst(r.left + r.width / 2, r.top + 40);
      }, 360);
    } catch (e) {
      btn.disabled = false;
      btn.textContent = original;
      alert("Hmm, something went wrong. Please try again in a moment.");
    }
  });

  function burst(cx, cy) {
    for (let i = 0; i < 28; i++) {
      const heart = document.createElement("div");
      heart.textContent = "♥";
      heart.style.cssText = `
        position:fixed; left:${cx}px; top:${cy}px;
        font-size:${14 + Math.random() * 22}px;
        color: ${["#ff3b8b", "#ffc4d8", "#7ec3e8", "#ff8fb8"][Math.floor(Math.random() * 4)]};
        pointer-events:none; z-index:9999;
        text-shadow: 0 0 14px rgba(255,59,139,.7);
      `;
      document.body.appendChild(heart);
      const angle = Math.random() * Math.PI * 2;
      const dist = 120 + Math.random() * 260;
      const dx = Math.cos(angle) * dist;
      const dy = Math.sin(angle) * dist - 60;
      heart.animate(
        [
          { transform: "translate(-50%,-50%) scale(.4) rotate(0deg)", opacity: 1 },
          { transform: `translate(calc(-50% + ${dx}px), calc(-50% + ${dy}px)) scale(1.4) rotate(${Math.random() * 360}deg)`, opacity: 0 },
        ],
        { duration: 1300 + Math.random() * 600, easing: "cubic-bezier(.2,.7,.3,1)" }
      ).onfinish = () => heart.remove();
    }
  }
})();

// ---------- Parallax tilt for the polaroid ----------
(function tilt() {
  const el = document.querySelector(".polaroid");
  const wrap = document.querySelector(".hero-art");
  if (!el || !wrap) return;
  wrap.addEventListener("mousemove", (e) => {
    const r = wrap.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - 0.5;
    const y = (e.clientY - r.top) / r.height - 0.5;
    el.style.transform = `rotate(${-3 + x * 6}deg) translate(${x * 14}px, ${y * 14}px)`;
  });
  wrap.addEventListener("mouseleave", () => {
    el.style.transform = "";
  });
})();
