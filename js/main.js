// Все проекты живут здесь — добавил карточку в массив, и галерея сама её нарисует.
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

// Из обычного объекта собираем карточку. Шаблон большой, зато вся разметка проекта в одном месте.
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

// Фильтр оставляет подходящие проекты и заново показывает карточки без перезагрузки страницы.
function renderProjects(filter = "all") {
  const visibleProjects = projects.filter(
    (project) => filter === "all" || project.type === filter,
  );
  projectsContainer.innerHTML = visibleProjects.map(createProjectCard).join("");
  projectsContainer
    .querySelectorAll(".reveal")
    .forEach((card) => revealObserver.observe(card));
}

// Следим за появлением блоков: пока они далеко, не тратим анимацию впустую.
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

// Счётчики запускаются один раз — цифры не должны устраивать марафон при каждом скролле.
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

// Калькулятор закрыт, пока его не позвали. Esc и клик по фону разруливает сам <dialog>.
const calculatorDialog = document.querySelector("#calculator-dialog");
document
  .querySelector("#calculator-open")
  .addEventListener("click", () => calculatorDialog.showModal());
document
  .querySelector(".calculator-close")
  .addEventListener("click", () => calculatorDialog.close());
calculatorDialog.addEventListener("click", (event) => {
  if (event.target === calculatorDialog) calculatorDialog.close();
});

// Считаем ориентир на лету. Цифры демонстрационные — это калькулятор, не гадалка по штукатурке.
const calculator = document.querySelector("#calculator");
const areaSlider = document.querySelector("#calc-area");
const areaValue = document.querySelector("#calc-area-value");
const estimateMin = document.querySelector("#estimate-min");
const estimateMax = document.querySelector("#estimate-max");
const estimatePrice = document.querySelector(".estimate-price");
const rubles = new Intl.NumberFormat("ru-RU", {
  style: "currency",
  currency: "RUB",
  maximumFractionDigits: 0,
});
const workRates = {
  cosmetic: [7000, 12000],
  capital: [16000, 26000],
  designer: [28000, 45000],
};
const objectFactors = { flat: 1, house: 1.2, office: 1.15 };
const materialFactors = { economy: 0.85, standard: 1, premium: 1.3 };

function calculateEstimate() {
  const area = Number(areaSlider.value);
  const [rateMin, rateMax] =
    workRates[document.querySelector("#calc-work").value];
  const objectFactor =
    objectFactors[document.querySelector("#calc-object").value];
  const materialFactor =
    materialFactors[document.querySelector("#calc-material").value];
  const demolitionCost = document.querySelector("#calc-demolition").checked
    ? 2500 * area
    : 0;
  const min =
    Math.round(
      (area * rateMin * objectFactor * materialFactor + demolitionCost) / 10000,
    ) * 10000;
  const max =
    Math.round(
      (area * rateMax * objectFactor * materialFactor + demolitionCost) / 10000,
    ) * 10000;

  areaValue.textContent = area;
  estimateMin.textContent = rubles.format(min);
  estimateMax.textContent = rubles.format(max);
  estimatePrice.classList.remove("updated");
  requestAnimationFrame(() => estimatePrice.classList.add("updated"));
  return { min, max };
}

calculator.querySelectorAll("select, input").forEach((control) => {
  control.addEventListener("input", calculateEstimate);
  control.addEventListener("change", calculateEstimate);
});
calculateEstimate();

// Переносим итог в заявку, чтобы не заставлять человека вводить одно и то же дважды.
document.querySelector("#calc-to-form").addEventListener("click", () => {
  const { min, max } = calculateEstimate();
  const objectType = document.querySelector("#calc-object").value;
  const projectType = document.querySelector("#lead-type");
  const projectLabels = {
    flat: "Ремонт квартиры",
    house: "Ремонт дома",
    office: "Ремонт офиса",
  };
  projectType.value = projectLabels[objectType];
  document.querySelector("#lead-budget").value =
    `${rubles.format(min)} — ${rubles.format(max)}`;
  document.querySelector("#lead-description").value =
    `Расчёт с сайта: ${areaSlider.value} м², ${document.querySelector("#calc-work").selectedOptions[0].text.toLowerCase()}.`;
  calculatorDialog.close();
  setTimeout(() => {
    document
      .querySelector("#contact")
      .scrollIntoView({ behavior: "smooth", block: "start" });
  }, 80);
});

// Готовим форму: телефон форматируем, бюджет очищаем, фото проверяем до выбора.
const leadForm = document.querySelector("#lead");
const phoneInput = document.querySelector("#lead-phone");
const budgetInput = document.querySelector("#lead-budget");
const photoInput = document.querySelector("#files");
const formHint = document.querySelector("#form-hint");
const photoLabel = document.querySelector(".file");

function formatRussianPhone(value) {
  let digits = value.replace(/\D/g, "");
  if (digits.startsWith("7") || digits.startsWith("8"))
    digits = digits.slice(1);
  digits = digits.slice(0, 10);
  if (!digits) return "";

  let formatted = "+7";
  if (digits.length) formatted += ` (${digits.slice(0, 3)}`;
  if (digits.length >= 3) formatted += ")";
  if (digits.length > 3) formatted += ` ${digits.slice(3, 6)}`;
  if (digits.length > 6) formatted += `-${digits.slice(6, 8)}`;
  if (digits.length > 8) formatted += `-${digits.slice(8, 10)}`;
  return formatted;
}

phoneInput.addEventListener("input", () => {
  const formatted = formatRussianPhone(phoneInput.value);
  phoneInput.value = formatted;
  phoneInput.setCustomValidity(
    formatted.replace(/\D/g, "").length === 11
      ? ""
      : "Введите номер из 10 цифр после +7.",
  );
});

budgetInput.addEventListener("input", () => {
  const digits = budgetInput.value.replace(/\D/g, "").slice(0, 9);
  budgetInput.value = digits.replace(/\B(?=(\d{3})+(?!\d))/g, " ");
});

// Браузер сам рисует список выбранных файлов, а мы выставляем понятные рамки.
photoInput.addEventListener("change", () => {
  const photos = [...photoInput.files];
  const tooMany = photos.length > 5;
  const tooLarge = photos.some((photo) => photo.size > 10 * 1024 * 1024);
  const wrongType = photos.some(
    (photo) => !["image/jpeg", "image/png", "image/webp"].includes(photo.type),
  );

  let error = "";
  if (tooMany) error = "Можно прикрепить не больше пяти фотографий.";
  else if (tooLarge) error = "Каждое фото должно весить не больше 10 МБ.";
  else if (wrongType) error = "Подойдут изображения JPG, PNG или WebP.";

  photoInput.setCustomValidity(error);
  photoLabel.classList.toggle("has-error", Boolean(error));
  photoLabel.childNodes[0].textContent = error
    ? `⚠ ${error} `
    : photos.length
      ? `✓ Выбрано фото: ${photos.length} `
      : "＋ Прикрепить фото ";
});

// Ошибки подсвечиваем сразу у поля, чтобы не играть с пользователем в квест «найди косяк».
leadForm.querySelectorAll("input, select, textarea").forEach((field) => {
  field.addEventListener("input", () => {
    field.classList.toggle("is-invalid", !field.checkValidity());
    if (field.checkValidity()) formHint.textContent = "";
  });
});

leadForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const nameInput = document.querySelector("#lead-name");
  nameInput.value = nameInput.value.trim();
  phoneInput.setCustomValidity(
    phoneInput.value.replace(/\D/g, "").length === 11
      ? ""
      : "Введите номер из 10 цифр после +7.",
  );

  if (!leadForm.reportValidity()) {
    const firstInvalid = leadForm.querySelector(":invalid");
    firstInvalid?.classList.add("is-invalid");
    formHint.textContent =
      "Проверь поля, отмеченные браузером, и попробуй ещё раз.";
    firstInvalid?.focus();
    return;
  }

  const toast = document.querySelector("#toast");
  toast.textContent =
    "Всё заполнено! Это демо — для отправки заявки нужен сервер.";
  toast.classList.add("show");
  setTimeout(() => toast.classList.remove("show"), 4000);
  leadForm.reset();
  phoneInput.setCustomValidity("");
  photoInput.setCustomValidity("");
  photoLabel.classList.remove("has-error");
  photoLabel.childNodes[0].textContent = "＋ Прикрепить фото ";
  leadForm
    .querySelectorAll(".is-invalid")
    .forEach((field) => field.classList.remove("is-invalid"));
  formHint.textContent = "";
});

// Полоса прокрутки показывает путь по странице, а обложка чуть-чуть едет вслед.
// Прогресс прокрутки и лёгкий параллакс обложки обновляем в одном кадре браузера.
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

// Ссылки на разделы скроллятся мягко, без телепортации в соседний район.
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

// Колёсико сглаживаем, но поля ввода не трогаем — там пусть крутится как привыкло.
// Уважение к системной настройке: если человек просит меньше движения, не спорим.
const prefersReducedMotion = window.matchMedia(
  "(prefers-reduced-motion: reduce)",
);
let wheelTarget = window.scrollY;
let wheelAnimationFrame = null;
const wheelSpeed = 2; // На школьной мышке маленький шаг больше не будет ползти как черепаха.
const wheelEasing = 0.3; // Быстрее догоняем цель, но движение остаётся мягким.
const slowdownSectionIds = ["portfolio", "blueprint", "process"];
const slowdownRadius = 240; // Скорость меняется постепенно на подходе к разделам и после них.

window.addEventListener(
  "wheel",
  (event) => {
    if (
      prefersReducedMotion.matches ||
      event.ctrlKey ||
      !event.cancelable ||
      event.target.closest(
        "dialog[open], input, textarea, select, button, [contenteditable='true']",
      )
    ) {
      return;
    }

    event.preventDefault();
    const delta = event.deltaMode === 1 ? event.deltaY * 32 : event.deltaY;
    const maxScroll =
      document.documentElement.scrollHeight - window.innerHeight;
    wheelTarget = Math.max(
      0,
      Math.min(maxScroll, wheelTarget + delta * wheelSpeed),
    );

    if (wheelAnimationFrame !== null) return;

    const animateWheel = () => {
      const distance = wheelTarget - window.scrollY;
      if (Math.abs(distance) < 0.75) {
        window.scrollTo(0, wheelTarget);
        wheelAnimationFrame = null;
        return;
      }

      const currentY = window.scrollY;
      const landmarks = slowdownSectionIds
        .map((sectionId) => document.getElementById(sectionId))
        .filter(Boolean)
        .map((section) => section.getBoundingClientRect().top + currentY);
      const nearestDistance = landmarks.length
        ? Math.min(
            ...landmarks.map((position) => Math.abs(position - currentY)),
          )
        : Infinity;

      // Плавная S-кривая: возле точки медленнее, а разгон обратно без резкого пинка.
      const proximity = Math.max(0, 1 - nearestDistance / slowdownRadius);
      const smoothProximity = proximity * proximity * (3 - 2 * proximity);
      const localEasing = wheelEasing * (1 - 0.58 * smoothProximity);
      const scrollStep = distance * localEasing;
      window.scrollTo(0, currentY + scrollStep);
      wheelAnimationFrame = requestAnimationFrame(animateWheel);
    };

    wheelAnimationFrame = requestAnimationFrame(animateWheel);
  },
  { passive: false },
);

// Если страницу сдвинули другим способом, синхронизируем цель колёсика.
window.addEventListener(
  "scroll",
  () => {
    if (wheelAnimationFrame === null) wheelTarget = window.scrollY;
  },
  { passive: true },
);

// Окно просмотра: нажми карточку, чтобы спокойно рассмотреть проект крупно.
// Большое окно проекта: карточка превращается в мини-кейс, стрелки листают работы.
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

// Подсветка и лёгкий наклон фотографии следуют за курсором.
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
// Подсказки к точкам на плане. Тексты лучше держать здесь, а не зашивать в HTML.
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

// GSAP is our little motion assistant. CSS and the regular JS still do the job if it is absent.
if (window.gsap && !prefersReducedMotion.matches) {
  // Hero comes in piece by piece, like opening the door to the finished room.
  window.gsap.from(".hero-content > *", {
    autoAlpha: 0,
    y: 24,
    duration: 0.75,
    stagger: 0.12,
    ease: "power3.out",
    delay: 0.15,
  });

  // The plan takes a breath when it appears; no need to make the whole page dance.
  const blueprintBoard = document.querySelector(".blueprint-board");
  if (blueprintBoard) {
    window.gsap.fromTo(
      blueprintBoard,
      { rotate: 1, scale: 0.97 },
      {
        rotate: 0,
        scale: 1,
        duration: 1.1,
        ease: "power3.out",
        delay: 0.3,
      },
    );
  }
}

// Каждая точка либо ведёт к разделу, либо открывает калькулятор — без квестов и сюрпризов.
document.querySelectorAll("[data-open-calculator]").forEach((button) => {
  button.addEventListener("click", () => calculatorDialog.showModal());
});

const magneticLinks = [...document.querySelectorAll(".magnetic-link")];
if (window.matchMedia("(hover: hover) and (pointer: fine)").matches) {
  magneticLinks.forEach((link) => {
    link.addEventListener("pointermove", (event) => {
      const bounds = link.getBoundingClientRect();
      const pullX = (event.clientX - (bounds.left + bounds.width / 2)) * 0.22;
      const pullY = (event.clientY - (bounds.top + bounds.height / 2)) * 0.22;
      link.style.transform = `translate(${pullX}px, ${pullY}px) scale(1.08)`;
    });
    link.addEventListener("pointerleave", () => {
      link.style.transform = "translate(0, 0) scale(1)";
    });
  });
}

// Подсвечиваем точку рядом с тем разделом, который сейчас читают.
const sectionObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      magneticLinks.forEach((link) => {
        link.classList.toggle(
          "active",
          link.dataset.section === entry.target.id,
        );
      });
    });
  },
  { rootMargin: "-35% 0px -45% 0px" },
);
["portfolio", "blueprint", "process"].forEach((sectionId) => {
  const section = document.getElementById(sectionId);
  if (section) sectionObserver.observe(section);
});
