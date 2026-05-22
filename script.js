const loader = document.querySelector(".loader");
const header = document.querySelector(".header");
const menuBtn = document.querySelector(".menu-btn");
const navLinksWrap = document.querySelector(".nav-links");
const navLinks = document.querySelectorAll(".nav-link");
const themeToggle = document.querySelector(".theme-toggle");
const backTop = document.querySelector(".back-top");
const revealItems = document.querySelectorAll(".reveal");
const skillItems = document.querySelectorAll(".skill");
const statItems = document.querySelectorAll(".stat strong");
const filterButtons = document.querySelectorAll(".filter");
const projects = document.querySelectorAll(".project");
const slides = document.querySelectorAll(".slide");
const dotsWrap = document.querySelector(".slider-dots");
const nextBtn = document.querySelector(".next");
const prevBtn = document.querySelector(".prev");
const contactForm = document.querySelector(".contact-form");
const typingText = document.querySelector(".typing-text");
const heroGrid = document.querySelector(".hero-grid");
const tiltCards = document.querySelectorAll(".service, .project, .timeline-card, .blog-card, .stat");

const phrases = [
  "AI Automation Engineer.",
  "AI Agent Developer.",
  "Python Backend Engineer.",
  "n8n, Make.com & Zapier Specialist."
];

let phraseIndex = 0;
let charIndex = 0;
let isDeleting = false;
let slideIndex = 0;

window.addEventListener("load", () => {
  setTimeout(() => loader.classList.add("hidden"), 450);
});

const savedTheme = localStorage.getItem("theme");
if (savedTheme === "light") {
  document.body.classList.add("light");
  themeToggle.innerHTML = '<i class="fa-solid fa-sun"></i>';
}

function typeLoop() {
  const phrase = phrases[phraseIndex];
  typingText.textContent = phrase.slice(0, charIndex);

  if (!isDeleting && charIndex < phrase.length) {
    charIndex += 1;
    setTimeout(typeLoop, 62);
    return;
  }

  if (!isDeleting && charIndex === phrase.length) {
    isDeleting = true;
    setTimeout(typeLoop, 1200);
    return;
  }

  if (isDeleting && charIndex > 0) {
    charIndex -= 1;
    setTimeout(typeLoop, 28);
    return;
  }

  isDeleting = false;
  phraseIndex = (phraseIndex + 1) % phrases.length;
  setTimeout(typeLoop, 260);
}

function handleScroll() {
  header.classList.toggle("scrolled", window.scrollY > 28);
  backTop.classList.toggle("show", window.scrollY > 700);

  const sections = [...document.querySelectorAll("main section[id]")];
  const current = sections.filter(section => window.scrollY >= section.offsetTop - 140).pop();
  if (!current) return;

  navLinks.forEach(link => {
    link.classList.toggle("active", link.getAttribute("href") === `#${current.id}`);
  });
}

const revealObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add("visible");
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.16 });

const skillObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const value = entry.target.dataset.progress;
      entry.target.style.setProperty("--value", `${value}%`);
      entry.target.querySelector("span").dataset.value = `${value}%`;
      entry.target.classList.add("animated");
      skillObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.35 });

const counterObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    const target = Number(entry.target.dataset.count);
    let current = 0;
    const step = Math.max(1, Math.ceil(target / 42));
    const timer = setInterval(() => {
      current += step;
      if (current >= target) {
        current = target;
        clearInterval(timer);
      }
      entry.target.textContent = target === 100 ? `${current}%` : `${current}+`;
    }, 28);
    counterObserver.unobserve(entry.target);
  });
}, { threshold: 0.4 });

function showSlide(index) {
  slideIndex = (index + slides.length) % slides.length;
  slides.forEach((slide, i) => slide.classList.toggle("active", i === slideIndex));
  document.querySelectorAll(".slider-dots button").forEach((dot, i) => {
    dot.classList.toggle("active", i === slideIndex);
  });
}

function addHeroTilt() {
  if (!heroGrid) return;

  heroGrid.addEventListener("mousemove", event => {
    const rect = heroGrid.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width - 0.5;
    const y = (event.clientY - rect.top) / rect.height - 0.5;
    heroGrid.classList.add("is-tilting");
    heroGrid.style.transform = `rotateX(${y * -5}deg) rotateY(${x * 6}deg)`;
  });

  heroGrid.addEventListener("mouseleave", () => {
    heroGrid.classList.remove("is-tilting");
    heroGrid.style.transform = "rotateX(0deg) rotateY(0deg)";
  });
}

function addCardTilt() {
  tiltCards.forEach(card => {
    card.addEventListener("mousemove", event => {
      const rect = card.getBoundingClientRect();
      const x = (event.clientX - rect.left) / rect.width - 0.5;
      const y = (event.clientY - rect.top) / rect.height - 0.5;
      card.style.transform = `translateY(-8px) rotateX(${y * -7}deg) rotateY(${x * 9}deg) translateZ(20px)`;
    });

    card.addEventListener("mouseleave", () => {
      card.style.transform = "";
    });
  });
}

slides.forEach((_, index) => {
  const dot = document.createElement("button");
  dot.type = "button";
  dot.setAttribute("aria-label", `Show testimonial ${index + 1}`);
  dot.addEventListener("click", () => showSlide(index));
  dotsWrap.appendChild(dot);
});

menuBtn.addEventListener("click", () => {
  const open = navLinksWrap.classList.toggle("open");
  menuBtn.setAttribute("aria-expanded", String(open));
});

navLinks.forEach(link => {
  link.addEventListener("click", () => {
    navLinksWrap.classList.remove("open");
    menuBtn.setAttribute("aria-expanded", "false");
  });
});

themeToggle.addEventListener("click", () => {
  const light = document.body.classList.toggle("light");
  localStorage.setItem("theme", light ? "light" : "dark");
  themeToggle.innerHTML = light ? '<i class="fa-solid fa-sun"></i>' : '<i class="fa-solid fa-moon"></i>';
});

filterButtons.forEach(button => {
  button.addEventListener("click", () => {
    const filter = button.dataset.filter;
    filterButtons.forEach(btn => btn.classList.remove("active"));
    button.classList.add("active");

    projects.forEach(project => {
      const show = filter === "all" || project.dataset.category.includes(filter);
      project.classList.toggle("hide", !show);
    });
  });
});

nextBtn.addEventListener("click", () => showSlide(slideIndex + 1));
prevBtn.addEventListener("click", () => showSlide(slideIndex - 1));

setInterval(() => showSlide(slideIndex + 1), 5200);

backTop.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));

contactForm.addEventListener("submit", event => {
  event.preventDefault();
  const data = new FormData(contactForm);
  const subject = encodeURIComponent(`Portfolio inquiry from ${data.get("name")}`);
  const body = encodeURIComponent(`Name: ${data.get("name")}\nEmail: ${data.get("email")}\nService: ${data.get("service")}\n\n${data.get("message")}`);
  contactForm.querySelector(".form-status").textContent = "Opening your email app...";
  window.location.href = `mailto:ai8254072@gmail.com?subject=${subject}&body=${body}`;
  contactForm.reset();
});

revealItems.forEach(item => revealObserver.observe(item));
skillItems.forEach(item => skillObserver.observe(item));
statItems.forEach(item => counterObserver.observe(item));

document.querySelector("#year").textContent = new Date().getFullYear();
window.addEventListener("scroll", handleScroll);
handleScroll();
showSlide(0);
addHeroTilt();
addCardTilt();
typeLoop();
