// Initialize theme immediately to prevent Theme Flash
(function initTheme() {
  const savedTheme = localStorage.getItem("theme");
  if (savedTheme) {
    document.documentElement.setAttribute("data-theme", savedTheme);
  } else if (window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches) {
    document.documentElement.setAttribute("data-theme", "dark");
  } else {
    document.documentElement.setAttribute("data-theme", "light");
  }
})();

document.documentElement.classList.add("js");

document.addEventListener("DOMContentLoaded", () => {
  "use strict";

  console.log("LWSS Gumma - Drabla Pumping Station script loaded successfully.");

  // Theme Toggle Elements
  const themeToggleBtn = document.getElementById("themeToggleBtn");

  const updateThemeUI = (theme) => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
    if (themeToggleBtn) {
      themeToggleBtn.setAttribute("aria-label", theme === "dark" ? "Switch to light mode" : "Switch to dark mode");
    }
  };

  if (themeToggleBtn) {
    const currentTheme = document.documentElement.getAttribute("data-theme") || "light";
    updateThemeUI(currentTheme);

    themeToggleBtn.addEventListener("click", () => {
      const isDark = document.documentElement.getAttribute("data-theme") === "dark";
      const newTheme = isDark ? "light" : "dark";
      updateThemeUI(newTheme);
    });
  }

  const hamburgerBtn = document.getElementById("hamburgerBtn");
  const navMenu = document.getElementById("navMenu");
  const navLinks = document.querySelectorAll(".nav-link");
  const backToTopBtn = document.getElementById("backToTopBtn");
  const currentYear = document.getElementById("currentYear");
  const lightboxModal = document.getElementById("lightboxModal");
  const lightboxImg = document.getElementById("lightboxImg");
  const lightboxCaption = document.getElementById("lightboxCaption");
  const lightboxCounter = document.getElementById("lightboxCounter");
  const lightboxCloseBtn = document.getElementById("lightboxCloseBtn");
  const lightboxPrevBtn = document.getElementById("lightboxPrevBtn");
  const lightboxNextBtn = document.getElementById("lightboxNextBtn");
  const filterBtns = document.querySelectorAll(".filter-btn");
  const galleryCards = Array.from(document.querySelectorAll(".gallery-card"));
  const revealItems = document.querySelectorAll(".reveal-on-scroll");
  const sections = Array.from(document.querySelectorAll("main section[id]"));

  let currentVisibleCards = [...galleryCards];
  let currentActiveIndex = 0;

  const closeMobileMenu = () => {
    if (!hamburgerBtn || !navMenu) return;
    hamburgerBtn.classList.remove("is-active");
    hamburgerBtn.setAttribute("aria-expanded", "false");
    navMenu.classList.remove("is-open");
    document.body.classList.remove("menu-open");
  };

  if (hamburgerBtn && navMenu) {
    hamburgerBtn.addEventListener("click", () => {
      const isOpen = navMenu.classList.toggle("is-open");
      hamburgerBtn.classList.toggle("is-active", isOpen);
      hamburgerBtn.setAttribute("aria-expanded", String(isOpen));
      document.body.classList.toggle("menu-open", isOpen);
    });
  }

  navLinks.forEach((link) => {
    link.addEventListener("click", closeMobileMenu);
  });

  // Gallery Filter Logic
  filterBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      filterBtns.forEach((b) => {
        b.classList.remove("active");
        b.setAttribute("aria-selected", "false");
      });
      btn.classList.add("active");
      btn.setAttribute("aria-selected", "true");

      const filter = btn.getAttribute("data-filter");

      currentVisibleCards = [];
      galleryCards.forEach((card) => {
        const category = card.getAttribute("data-category");
        if (filter === "all" || category === filter) {
          card.style.display = "";
          currentVisibleCards.push(card);
        } else {
          card.style.display = "none";
        }
      });
    });
  });

  // Lightbox Navigation Logic
  const updateLightboxImage = (index) => {
    if (!currentVisibleCards.length || index < 0 || index >= currentVisibleCards.length) return;

    currentActiveIndex = index;
    const card = currentVisibleCards[currentActiveIndex];
    const src = card.getAttribute("data-lightbox");
    const caption = card.getAttribute("data-caption") || "";

    if (lightboxImg) {
      lightboxImg.src = src;
      lightboxImg.alt = caption || "Facility photograph";
    }

    if (lightboxCaption) {
      lightboxCaption.textContent = caption;
    }

    if (lightboxCounter) {
      lightboxCounter.textContent = `${currentActiveIndex + 1} / ${currentVisibleCards.length}`;
    }
  };

  const openLightboxAtIndex = (index) => {
    if (!lightboxModal) return;
    updateLightboxImage(index);
    lightboxModal.classList.add("is-open");
    lightboxModal.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";

    if (lightboxCloseBtn) {
      lightboxCloseBtn.focus();
    }
  };

  const closeLightbox = () => {
    if (!lightboxModal || !lightboxImg) return;

    lightboxModal.classList.remove("is-open");
    lightboxModal.setAttribute("aria-hidden", "true");
    lightboxImg.removeAttribute("src");
    document.body.style.overflow = "";
  };

  const showNextImage = () => {
    if (!currentVisibleCards.length) return;
    const nextIndex = (currentActiveIndex + 1) % currentVisibleCards.length;
    updateLightboxImage(nextIndex);
  };

  const showPrevImage = () => {
    if (!currentVisibleCards.length) return;
    const prevIndex = (currentActiveIndex - 1 + currentVisibleCards.length) % currentVisibleCards.length;
    updateLightboxImage(prevIndex);
  };

  galleryCards.forEach((card) => {
    const handleCardClick = () => {
      const cardIndex = currentVisibleCards.indexOf(card);
      if (cardIndex !== -1) {
        openLightboxAtIndex(cardIndex);
      }
    };

    card.addEventListener("click", handleCardClick);
    card.addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        handleCardClick();
      }
    });
  });

  if (lightboxCloseBtn) {
    lightboxCloseBtn.addEventListener("click", closeLightbox);
  }

  if (lightboxNextBtn) {
    lightboxNextBtn.addEventListener("click", showNextImage);
  }

  if (lightboxPrevBtn) {
    lightboxPrevBtn.addEventListener("click", showPrevImage);
  }

  if (lightboxModal) {
    lightboxModal.addEventListener("click", (event) => {
      if (event.target === lightboxModal || event.target.classList.contains("lightbox-img-container")) {
        closeLightbox();
      }
    });
  }

  document.addEventListener("keydown", (event) => {
    if (lightboxModal?.classList.contains("is-open")) {
      if (event.key === "Escape") {
        closeLightbox();
      } else if (event.key === "ArrowRight") {
        showNextImage();
      } else if (event.key === "ArrowLeft") {
        showPrevImage();
      }
    } else if (event.key === "Escape") {
      closeMobileMenu();
    }
  });

  if (backToTopBtn) {
    const toggleBackToTop = () => {
      backToTopBtn.classList.toggle("visible", window.scrollY > 420);
    };

    toggleBackToTop();
    window.addEventListener("scroll", toggleBackToTop, { passive: true });
    backToTopBtn.addEventListener("click", () => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  if (currentYear) {
    currentYear.textContent = String(new Date().getFullYear());
  }

  const setActiveNav = () => {
    if (!sections.length || !navLinks.length) return;

    const currentPosition = window.scrollY + 140;
    let activeId = "home";

    sections.forEach((section) => {
      if (currentPosition >= section.offsetTop) {
        activeId = section.id;
      }
    });

    navLinks.forEach((link) => {
      const linkId = link.getAttribute("href")?.replace("#", "");
      link.classList.toggle("active", linkId === activeId);
    });
  };

  setActiveNav();
  window.addEventListener("scroll", setActiveNav, { passive: true });

  if ("IntersectionObserver" in window && revealItems.length) {
    const revealObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.12,
        rootMargin: "0px 0px -50px 0px",
      }
    );

    revealItems.forEach((item) => revealObserver.observe(item));
  } else {
    revealItems.forEach((item) => item.classList.add("is-visible"));
  }
});
