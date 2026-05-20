const header = document.querySelector(".site-header");
const navToggle = document.querySelector(".nav-toggle");
const navMenu = document.querySelector(".nav-menu");
const navLinks = document.querySelectorAll(".nav-link");
const themeToggle = document.querySelector(".theme-toggle");
const themeIcon = document.querySelector(".theme-icon");
const backToTop = document.querySelector(".back-to-top");
const revealItems = document.querySelectorAll(".reveal");
const progressItems = document.querySelectorAll(".progress");
const filterButtons = document.querySelectorAll(".filter-btn");
const projectCards = document.querySelectorAll(".project-card");
const contactForm = document.querySelector("#contactForm");
const typingTarget = document.querySelector(".typing-text");

const typingPhrases = [
  "self-healing automation workflows.",
  "custom AI agents for real businesses.",
  "Python backends that scale cleanly.",
  "AWS AI/ML pipelines for production."
];

let phraseIndex = 0;
let charIndex = 0;
let deleting = false;

// Persist the preferred color mode between visits.
const savedTheme = localStorage.getItem("portfolio-theme");
if (savedTheme === "light") {
  document.body.classList.add("light-theme");
  themeIcon.textContent = "L";
}

// Lightweight typing animation for the hero value proposition.
function typeHeroText() {
  if (!typingTarget) return;

  const phrase = typingPhrases[phraseIndex];
  typingTarget.textContent = phrase.slice(0, charIndex);

  if (!deleting && charIndex < phrase.length) {
    charIndex += 1;
    setTimeout(typeHeroText, 58);
    return;
  }

  if (!deleting && charIndex === phrase.length) {
    deleting = true;
    setTimeout(typeHeroText, 1300);
    return;
  }

  if (deleting && charIndex > 0) {
    charIndex -= 1;
    setTimeout(typeHeroText, 28);
    return;
  }

  deleting = false;
  phraseIndex = (phraseIndex + 1) % typingPhrases.length;
  setTimeout(typeHeroText, 220);
}

// Header, active section, and floating action state.
function handleScrollState() {
  const scrolled = window.scrollY > 20;
  header.classList.toggle("scrolled", scrolled);
  backToTop.classList.toggle("show", window.scrollY > 700);
}

function setActiveNav() {
  const sections = [...document.querySelectorAll("main section[id]")];
  const current = sections
    .filter(section => window.scrollY >= section.offsetTop - 130)
    .pop();

  if (!current) return;

  navLinks.forEach(link => {
    link.classList.toggle("active", link.getAttribute("href") === `#${current.id}`);
  });
}

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add("visible");
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.16 });

// Animate skill bars only once they are visible.
const progressObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const value = entry.target.dataset.progress || "0";
      const label = entry.target.querySelector("span");
      entry.target.style.setProperty("--progress-value", `${value}%`);
      entry.target.classList.add("animated");
      if (label) label.dataset.value = `${value}%`;
      progressObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.35 });

revealItems.forEach(item => revealObserver.observe(item));
progressItems.forEach(item => progressObserver.observe(item));

navToggle.addEventListener("click", () => {
  const isOpen = navMenu.classList.toggle("open");
  navToggle.setAttribute("aria-expanded", String(isOpen));
});

navLinks.forEach(link => {
  link.addEventListener("click", () => {
    navMenu.classList.remove("open");
    navToggle.setAttribute("aria-expanded", "false");
  });
});

themeToggle.addEventListener("click", () => {
  const light = document.body.classList.toggle("light-theme");
  localStorage.setItem("portfolio-theme", light ? "light" : "dark");
  themeIcon.textContent = light ? "L" : "D";
});

filterButtons.forEach(button => {
  button.addEventListener("click", () => {
    const filter = button.dataset.filter;
    filterButtons.forEach(btn => btn.classList.remove("active"));
    button.classList.add("active");

    projectCards.forEach(card => {
      const categories = card.dataset.category || "";
      const showCard = filter === "all" || categories.includes(filter);
      card.classList.toggle("hide", !showCard);
    });
  });
});

backToTop.addEventListener("click", () => {
  window.scrollTo({ top: 0, behavior: "smooth" });
});

// The form opens a pre-filled email so the static site works without a backend.
contactForm.addEventListener("submit", event => {
  event.preventDefault();
  const status = contactForm.querySelector(".form-status");
  status.textContent = "Thanks. Your message is ready to send by email.";

  const formData = new FormData(contactForm);
  const subject = encodeURIComponent(`Portfolio inquiry from ${formData.get("name")}`);
  const body = encodeURIComponent(
    `Name: ${formData.get("name")}\nEmail: ${formData.get("email")}\nProject: ${formData.get("project")}\n\n${formData.get("message")}`
  );

  window.location.href = `mailto:ai8254072@gmail.com?subject=${subject}&body=${body}`;
  contactForm.reset();
});

document.querySelector("#year").textContent = new Date().getFullYear();

window.addEventListener("scroll", () => {
  handleScrollState();
  setActiveNav();
});

handleScrollState();
setActiveNav();
typeHeroText();
