const sectionLabels = {
  biography: "Biography",
  bibliography: "Bibliography",
  books: "Books",
  writings: "Writings",
  publications: "Publications",
  achievements: "Achievements",
  articles: "Articles",
  gallery: "Gallery",
  contact: "Contact",
};

const dialog = document.querySelector(".content-dialog");
const backdrop = document.querySelector(".dialog-backdrop");
const dialogTitle = document.querySelector("#dialog-title");
const dialogCategory = document.querySelector("#dialog-category");
const dialogNumber = document.querySelector(".dialog-number");
const closeButton = document.querySelector(".dialog-close");
const menuToggle = document.querySelector(".menu-toggle");
const navigation = document.querySelector(".primary-nav");
let returnFocusTo = null;

document.querySelector("#year").textContent = new Date().getFullYear();

function openSection(section, trigger) {
  const title = sectionLabels[section];
  if (!title) return;
  returnFocusTo = trigger;
  dialogTitle.textContent = title;
  dialogCategory.textContent = title;
  dialogNumber.textContent = String(Object.keys(sectionLabels).indexOf(section) + 1).padStart(2, "0");
  document.querySelectorAll(".nav-link").forEach((link) => {
    link.classList.toggle("is-current", link.dataset.section === section);
  });
  navigation.classList.remove("is-open");
  menuToggle.setAttribute("aria-expanded", "false");
  menuToggle.setAttribute("aria-label", "Open navigation");
  backdrop.hidden = false;
  dialog.showModal();
  document.body.classList.add("dialog-open");
  requestAnimationFrame(() => backdrop.classList.add("is-visible"));
  closeButton.focus();
}

function closeSection() {
  if (!dialog.open) return;
  backdrop.classList.remove("is-visible");
  dialog.close();
  document.body.classList.remove("dialog-open");
  window.setTimeout(() => { backdrop.hidden = true; }, 240);
  if (returnFocusTo instanceof HTMLElement) {
    if (window.matchMedia("(max-width: 850px)").matches && navigation.contains(returnFocusTo)) {
      navigation.classList.add("is-open");
      menuToggle.setAttribute("aria-expanded", "true");
      menuToggle.setAttribute("aria-label", "Close navigation");
    }
    returnFocusTo.focus();
  }
}

document.querySelectorAll("[data-section]").forEach((control) => {
  control.addEventListener("click", () => openSection(control.dataset.section, control));
});

document.querySelector("[data-home]").addEventListener("click", (event) => {
  event.preventDefault();
  closeSection();
  document.querySelectorAll(".nav-link").forEach((link) => link.classList.remove("is-current"));
  event.currentTarget.classList.add("is-current");
  navigation.classList.remove("is-open");
  menuToggle.setAttribute("aria-expanded", "false");
  document.querySelector("#home").scrollIntoView({ behavior: "smooth" });
});

closeButton.addEventListener("click", closeSection);
dialog.addEventListener("click", (event) => {
  if (event.target === dialog) closeSection();
});
backdrop.addEventListener("click", closeSection);
dialog.addEventListener("cancel", (event) => {
  event.preventDefault();
  closeSection();
});

menuToggle.addEventListener("click", () => {
  const expanded = menuToggle.getAttribute("aria-expanded") === "true";
  menuToggle.setAttribute("aria-expanded", String(!expanded));
  menuToggle.setAttribute("aria-label", expanded ? "Open navigation" : "Close navigation");
  navigation.classList.toggle("is-open", !expanded);
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && navigation.classList.contains("is-open")) {
    navigation.classList.remove("is-open");
    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.setAttribute("aria-label", "Open navigation");
    menuToggle.focus();
  }
});
