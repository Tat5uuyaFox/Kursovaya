const projects = [
  {
    type: "flat",
    title: "Квартира в центре",
    description: "Современная классика",
    area: "82 м²",
    price: "1,8 млн ₽",
    duration: "4 месяца",
    image: "flat-center.jpg",
    featured: true,
  },
  {
    type: "house",
    title: "Дом у озера",
    description: "Строительство под ключ",
    area: "146 м²",
    price: "8,4 млн ₽",
    duration: "9 месяцев",
    image: "lake-house.jpg",
  },
  {
    type: "flat",
    title: "Тёплый минимализм",
    description: "Ремонт квартиры",
    area: "64 м²",
    price: "1,25 млн ₽",
    duration: "3 месяца",
    image: "warm-minimal.jpg",
  },
  {
    type: "office",
    title: "Офис команды IT",
    description: "Дизайн и отделка",
    area: "210 м²",
    price: "3,6 млн ₽",
    duration: "5 месяцев",
    image: "office-team.jpg",
  },
  {
    type: "house",
    title: "Семейный коттедж",
    description: "Строительство дома",
    area: "190 м²",
    price: "10,2 млн ₽",
    duration: "11 месяцев",
    image: "family-house.jpg",
  },
  {
    type: "flat",
    title: "Светлая студия",
    description: "Ремонт квартиры",
    area: "39 м²",
    price: "780 тыс. ₽",
    duration: "2 месяца",
    image: "bright-studio.jpg",
  },
  {
    type: "office",
    title: "Пространство для идей",
    description: "Офис под ключ",
    area: "165 м²",
    price: "2,9 млн ₽",
    duration: "4 месяца",
    image: "creative-office.jpg",
  },
  {
    type: "flat",
    title: "Тихая гавань",
    description: "Капитальный ремонт",
    area: "91 м²",
    price: "2,1 млн ₽",
    duration: "5 месяцев",
    image: "lake-house.jpg",
  },
  {
    type: "house",
    title: "Загородный ритм",
    description: "Отделка загородного дома",
    area: "128 м²",
    price: "3,7 млн ₽",
    duration: "6 месяцев",
    image: "warm-minimal.jpg",
  },
];

const projectTypes = { flat: "Квартира", house: "Дом", office: "Офис" };
const imageHost = "assets/projects/";
const projectsContainer = document.querySelector("#projects");

function createProjectCard(project, index) {
  const cardClass = project.featured
    ? "project-card project-card--featured"
    : "project-card";
  return `
    <article class="${cardClass} reveal" style="--card-order: ${index}">
      <div class="project-image">
        <img src="${imageHost}${project.image}" alt="Интерьер проекта «${project.title}»" loading="lazy">
        <span class="project-type">${projectTypes[project.type]}</span>
        <span class="project-arrow" aria-hidden="true">↗</span><span class="project-hover-label">СМОТРЕТЬ <b>↗</b></span>
      </div>
      <div class="project-details">
        <div><p class="project-description">${project.description}</p><h3>${project.title}</h3></div>
        <span class="project-price">${project.price}</span>
        <div class="project-facts"><span>${project.area}</span><span>·</span><span>${project.duration}</span><span class="project-index">${String(index + 1).padStart(2, "0")}</span></div>
      </div>
    </article>`;
}

function renderProjects(filter = "all") {
  const visibleProjects = projects.filter(
    (project) => filter === "all" || project.type === filter,
  );
  projectsContainer.innerHTML = visibleProjects.map(createProjectCard).join("");
  projectsContainer
    .querySelectorAll(".reveal")
    .forEach((card) => revealObserver.observe(card));
}

const revealObserver = new IntersectionObserver(
  (entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        observer.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.12 },
);

document
  .querySelectorAll(".reveal")
  .forEach((element) => revealObserver.observe(element));

document.querySelectorAll(".filter").forEach((button) => {
  button.addEventListener("click", () => {
    document.querySelector(".filter.active")?.classList.remove("active");
    button.classList.add("active");
    renderProjects(button.dataset.filter);
  });
});
renderProjects();

let countersStarted = false;
const statsObserver = new IntersectionObserver(([entry]) => {
  if (!entry.isIntersecting || countersStarted) return;
  countersStarted = true;
  document.querySelectorAll("[data-count]").forEach((counter) => {
    const target = Number(counter.dataset.count);
    const startTime = performance.now();
    const duration = 1200;
    function updateCounter(currentTime) {
      const progress = Math.min((currentTime - startTime) / duration, 1);
      const value =
        target === 4.9
          ? (target * progress).toFixed(1)
          : Math.round(target * progress);
      counter.textContent = `${value}${target === 100 ? "+" : ""}`;
      if (progress < 1) requestAnimationFrame(updateCounter);
    }
    requestAnimationFrame(updateCounter);
  });
});
statsObserver.observe(document.querySelector(".stats"));

document.querySelector("#files").addEventListener("change", (event) => {
  const count = event.target.files.length;
  document.querySelector(".file").childNodes[0].textContent = count
    ? `✓ Выбрано файлов: ${count} `
    : "＋ Прикрепить фото ";
});

document.querySelector("#lead").addEventListener("submit", (event) => {
  event.preventDefault();
  const toast = document.querySelector("#toast");
  toast.classList.add("show");
  setTimeout(() => toast.classList.remove("show"), 3500);
  event.target.reset();
});

// Keep the page position visible and gently move the hero image with the scroll.
const scrollProgress = document.querySelector(".scroll-progress");
let scrollFrameRequested = false;
window.addEventListener(
  "scroll",
  () => {
    if (scrollFrameRequested) return;
    scrollFrameRequested = true;
    requestAnimationFrame(() => {
      const scrollableHeight =
        document.documentElement.scrollHeight - window.innerHeight;
      const progress =
        scrollableHeight > 0 ? window.scrollY / scrollableHeight : 0;
      scrollProgress.style.transform = `scaleX(${progress})`;
      document.querySelector(".hero").style.backgroundPositionY =
        `${54 + progress * 4}%`;
      scrollFrameRequested = false;
    });
  },
  { passive: true },
);

// Give in-page links a consistent, eased scroll across browsers.
document.querySelectorAll('a[href^="#"]').forEach((link) => {
  link.addEventListener("click", (event) => {
    const target = document.querySelector(link.getAttribute("href"));
    if (!target) return;

    event.preventDefault();
    target.scrollIntoView({
      behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches
        ? "instant"
        : "smooth",
      block: "start",
    });
  });
});

// Smooth mouse-wheel scrolling while keeping native behavior in controls.
const prefersReducedMotion = window.matchMedia(
  "(prefers-reduced-motion: reduce)",
);
let wheelTarget = window.scrollY;
let wheelAnimationFrame = null;

window.addEventListener(
  "wheel",
  (event) => {
    if (
      prefersReducedMotion.matches ||
      event.ctrlKey ||
      !event.cancelable ||
      event.target.closest(
        "input, textarea, select, button, [contenteditable='true']",
      )
    ) {
      return;
    }

    event.preventDefault();
    const delta = event.deltaMode === 1 ? event.deltaY * 32 : event.deltaY;
    const maxScroll =
      document.documentElement.scrollHeight - window.innerHeight;
    wheelTarget = Math.max(0, Math.min(maxScroll, wheelTarget + delta * 1.15));

    if (wheelAnimationFrame !== null) return;

    const animateWheel = () => {
      const distance = wheelTarget - window.scrollY;
      if (Math.abs(distance) < 0.75) {
        window.scrollTo(0, wheelTarget);
        wheelAnimationFrame = null;
        return;
      }

      window.scrollTo(0, window.scrollY + distance * 0.16);
      wheelAnimationFrame = requestAnimationFrame(animateWheel);
    };

    wheelAnimationFrame = requestAnimationFrame(animateWheel);
  },
  { passive: false },
);

// If the user scrolls by another method, keep the wheel target in sync.
window.addEventListener(
  "scroll",
  () => {
    if (wheelAnimationFrame === null) wheelTarget = window.scrollY;
  },
  { passive: true },
);

/* Interactive project viewer. Click any portfolio card to inspect it. */
const projectViewer = document.querySelector("#project-viewer");
let activeProjectIndex = 0;

function showProject(index) {
  activeProjectIndex = (index + projects.length) % projects.length;
  const project = projects[activeProjectIndex];
  projectViewer.querySelector(".viewer-image").src =
    `${imageHost}${project.image}`;
  projectViewer.querySelector(".viewer-image").alt =
    `Интерьер проекта «${project.title}»`;
  projectViewer.querySelector(".viewer-type").textContent =
    projectTypes[project.type];
  projectViewer.querySelector(".viewer-title").textContent = project.title;
  projectViewer.querySelector(".viewer-description").textContent =
    project.description;
  projectViewer.querySelector(".viewer-facts").innerHTML =
    `<span>${project.area}</span><span>${project.duration}</span><strong>${project.price}</strong>`;
}

projectsContainer.addEventListener("click", (event) => {
  const card = event.target.closest(".project-card");
  if (!card) return;
  const title = card.querySelector("h3").textContent;
  const index = projects.findIndex((project) => project.title === title);
  if (index < 0) return;
  showProject(index);
  projectViewer.showModal();
});

projectViewer
  .querySelector(".viewer-close")
  .addEventListener("click", () => projectViewer.close());
projectViewer
  .querySelector(".viewer-prev")
  .addEventListener("click", () => showProject(activeProjectIndex - 1));
projectViewer
  .querySelector(".viewer-next")
  .addEventListener("click", () => showProject(activeProjectIndex + 1));
projectViewer.addEventListener("click", (event) => {
  if (event.target === projectViewer) projectViewer.close();
});
document.addEventListener("keydown", (event) => {
  if (!projectViewer.open) return;
  if (event.key === "ArrowRight") showProject(activeProjectIndex + 1);
  if (event.key === "ArrowLeft") showProject(activeProjectIndex - 1);
});

// Let the photo catch a little light as the pointer moves across the card.
projectsContainer.addEventListener("pointermove", (event) => {
  const image = event.target.closest(".project-image");
  if (!image) return;
  const bounds = image.getBoundingClientRect();
  image.style.setProperty("--pointer-x", `${event.clientX - bounds.left}px`);
  image.style.setProperty("--pointer-y", `${event.clientY - bounds.top}px`);
  image.style.setProperty(
    "--tilt-x",
    `${((event.clientY - bounds.top - bounds.height / 2) / bounds.height) * -2}deg`,
  );
  image.style.setProperty(
    "--tilt-y",
    `${((event.clientX - bounds.left - bounds.width / 2) / bounds.width) * 2}deg`,
  );
});

// Explain the architectural choices when visitors inspect the plan markers.
const planNotes = [
  "Гостиную объединили с кухней: больше дневного света и места для друзей.",
  "Кухню спроектировали по рабочему треугольнику — меньше лишних шагов.",
  "В спальне добавили встроенное хранение, чтобы оставить воздух и пространство.",
];
document.querySelectorAll(".plan-hotspot").forEach((hotspot, index) => {
  const showNote = () => {
    document.querySelector(".plan-tooltip").textContent = planNotes[index];
  };
  hotspot.addEventListener("mouseenter", showNote);
  hotspot.addEventListener("focus", showNote);
  hotspot.addEventListener("click", showNote);
});
