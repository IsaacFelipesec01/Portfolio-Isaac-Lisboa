const cursor = document.querySelector(".cursor");
const cursorRing = document.querySelector(".cursor-ring");
const interactiveItems = document.querySelectorAll("a, button, .magnet");
const revealItems = document.querySelectorAll(".fade-in, .service-item");
const navLinks = document.querySelectorAll(".nav a");
const backToTop = document.querySelector(".back-to-top");
const sections = document.querySelectorAll("main section[id]");
const marqueeSection = document.querySelector(".marquee-section");
const animatedText = document.querySelector("[data-animated-text]");

let mouseX = window.innerWidth / 2;
let mouseY = window.innerHeight / 2;
let ringX = mouseX;
let ringY = mouseY;

window.addEventListener("mousemove", (event) => {
  mouseX = event.clientX;
  mouseY = event.clientY;

  if (cursor) {
    cursor.style.left = `${mouseX}px`;
    cursor.style.top = `${mouseY}px`;
  }
});

function animateCursor() {
  ringX += (mouseX - ringX) * 0.18;
  ringY += (mouseY - ringY) * 0.18;

  if (cursorRing) {
    cursorRing.style.left = `${ringX}px`;
    cursorRing.style.top = `${ringY}px`;
  }

  requestAnimationFrame(animateCursor);
}

animateCursor();

interactiveItems.forEach((item) => {
  item.addEventListener("mouseenter", () => document.body.classList.add("cursor-active"));
  item.addEventListener("mouseleave", () => {
    document.body.classList.remove("cursor-active");
    item.style.transform = "";
  });

  item.addEventListener("mousemove", (event) => {
    if (window.matchMedia("(max-width: 720px)").matches) return;

    const rect = item.getBoundingClientRect();
    const x = event.clientX - rect.left - rect.width / 2;
    const y = event.clientY - rect.top - rect.height / 2;
    item.style.transform = `translate(${x * 0.08}px, ${y * 0.08}px)`;
  });
});

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
      }
    });
  },
  { threshold: 0.2 }
);

revealItems.forEach((item, index) => {
  item.style.transitionDelay = `${Math.min(index * 90, 360)}ms`;
  revealObserver.observe(item);
});

const sectionObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      const activeLink = document.querySelector(`.nav a[href="#${entry.target.id}"]`);
      navLinks.forEach((link) => link.classList.toggle("active", link === activeLink));
    });
  },
  { threshold: 0.46 }
);

sections.forEach((section) => sectionObserver.observe(section));

if (animatedText) {
  const text = animatedText.textContent.trim().replace(/\s+/g, " ");
  animatedText.textContent = "";

  text.split("").forEach((character) => {
    const span = document.createElement("span");
    span.className = "char";
    span.textContent = character;
    animatedText.appendChild(span);
  });
}

function updateScrollEffects() {
  const scrollY = window.scrollY;
  backToTop.classList.toggle("visible", scrollY > window.innerHeight * 0.55);

  if (marqueeSection) {
    const rect = marqueeSection.getBoundingClientRect();
    const progress = (window.innerHeight - rect.top) / (window.innerHeight + rect.height);
    const clamped = Math.max(0, Math.min(1, progress));
    marqueeSection.style.setProperty("--marquee-offset", `${(clamped - 0.5) * 260}px`);
  }

  if (animatedText) {
    const rect = animatedText.getBoundingClientRect();
    const progress = (window.innerHeight * 0.85 - rect.top) / (window.innerHeight * 0.8);
    const clamped = Math.max(0, Math.min(1, progress));
    const chars = animatedText.querySelectorAll(".char");
    const visibleChars = Math.floor(chars.length * clamped);

    chars.forEach((char, index) => {
      char.style.setProperty("--char-opacity", index <= visibleChars ? "1" : "0.25");
    });
  }
}

window.addEventListener("scroll", updateScrollEffects, { passive: true });
window.addEventListener("resize", updateScrollEffects);
updateScrollEffects();

backToTop.addEventListener("click", () => {
  document.querySelector("#hero").scrollIntoView({ behavior: "smooth" });
});
