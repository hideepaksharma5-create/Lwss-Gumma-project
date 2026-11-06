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

  // ==========================================================================
  // SCADA TELEMETRY & DIGITAL TWIN CONTROLLER
  // ==========================================================================
  const scadaSection = document.getElementById("scada-dashboard");
  if (scadaSection) {
    const scadaState = {
      autoFluctuate: true,
      speedMultiplier: 1,
      scenario: "nominal",
      isTripped: false,
      flowHistory: Array.from({ length: 25 }, () => 21.35 + (Math.random() - 0.5) * 0.2),
      pumps: {
        1: { running: true, throttle: 100, baseRpm: 1485, baseKw: 1560, temp: 62.4, ratedMld: 10.7 },
        2: { running: true, throttle: 100, baseRpm: 1480, baseKw: 1560, temp: 64.1, ratedMld: 10.7 },
        3: { running: false, throttle: 100, baseRpm: 1485, baseKw: 1560, temp: 24.2, ratedMld: 10.7 },
      },
      reservoirs: {
        gumma: 78.5,
        drabla: 66.2,
        craignano: 81.0,
      },
      quality: {
        turbidity: 1.6,
        chlorine: 1.25,
        ph: 7.35,
        temp: 13.8,
        conductivity: 218,
        do: 8.9,
      },
    };

    // Elements
    const scadaClock = document.getElementById("scadaClock");
    const scadaStatusPill = document.getElementById("scadaStatusPill");
    const scadaStatusText = document.getElementById("scadaStatusText");
    const selectScenario = document.getElementById("selectScenario");
    const btnToggleSimMode = document.getElementById("btnToggleSimMode");
    const speedButtons = document.querySelectorAll(".btn-speed");
    const btnEmergencyTrip = document.getElementById("btnEmergencyTrip");
    const btnResetTelemetry = document.getElementById("btnResetTelemetry");

    // KPI Display Elements
    const telemetryFlowMld = document.getElementById("telemetryFlowMld");
    const telemetryFlowM3h = document.getElementById("telemetryFlowM3h");
    const telemetryFlowCapacityPct = document.getElementById("telemetryFlowCapacityPct");
    const flowStatusBadge = document.getElementById("flowStatusBadge");
    const sparklinePath = document.getElementById("sparklinePath");
    const sparklineArea = document.getElementById("sparklineArea");
    const sparklineDot = document.getElementById("sparklineDot");

    const telemetryDeliveryPressure = document.getElementById("telemetryDeliveryPressure");
    const telemetryTotalHead = document.getElementById("telemetryTotalHead");
    const telemetrySuctionPressure = document.getElementById("telemetrySuctionPressure");
    const pressureSafetyBadge = document.getElementById("pressureSafetyBadge");
    const pressureMeterFill = document.getElementById("pressureMeterFill");
    const telemetryVelocity = document.getElementById("telemetryVelocity");

    const telemetryPowerKw = document.getElementById("telemetryPowerKw");
    const telemetrySecIndex = document.getElementById("telemetrySecIndex");
    const telemetryFrequency = document.getElementById("telemetryFrequency");
    const telemetryPowerFactor = document.getElementById("telemetryPowerFactor");
    const powerStatusBadge = document.getElementById("powerStatusBadge");
    const powerMeterFill = document.getElementById("powerMeterFill");

    const telemetryTurbidity = document.getElementById("telemetryTurbidity");
    const telemetryChlorine = document.getElementById("telemetryChlorine");
    const telemetryPh = document.getElementById("telemetryPh");
    const telemetryTemp = document.getElementById("telemetryTemp");
    const telemetryConductivity = document.getElementById("telemetryConductivity");
    const telemetryDo = document.getElementById("telemetryDo");
    const qualityStatusBadge = document.getElementById("qualityStatusBadge");

    const activePumpsCount = document.getElementById("activePumpsCount");
    const totalActiveHp = document.getElementById("totalActiveHp");

    // Live Clock (IST)
    const updateClock = () => {
      if (!scadaClock) return;
      const now = new Date();
      const timeStr = now.toLocaleTimeString("en-IN", {
        timeZone: "Asia/Kolkata",
        hour12: false,
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      });
      scadaClock.textContent = `${timeStr} IST`;
    };
    setInterval(updateClock, 1000);
    updateClock();

    // Draw Live SVG Sparkline Chart
    const drawSparkline = () => {
      if (!sparklinePath || !sparklineArea || !scadaState.flowHistory.length) return;
      const data = scadaState.flowHistory;
      const width = 320;
      const height = 60;
      const padding = 6;
      const minVal = 0;
      const maxVal = 26; // MLD range

      const points = data.map((val, idx) => {
        const x = (idx / (data.length - 1)) * (width - padding * 2) + padding;
        const clampedVal = Math.max(minVal, Math.min(maxVal, val));
        const y = height - padding - ((clampedVal - minVal) / (maxVal - minVal)) * (height - padding * 2);
        return { x, y };
      });

      let pathD = `M ${points[0].x.toFixed(1)} ${points[0].y.toFixed(1)}`;
      for (let i = 1; i < points.length; i++) {
        pathD += ` L ${points[i].x.toFixed(1)} ${points[i].y.toFixed(1)}`;
      }
      sparklinePath.setAttribute("d", pathD);

      const areaD = `${pathD} L ${points[points.length - 1].x.toFixed(1)} ${height} L ${points[0].x.toFixed(1)} ${height} Z`;
      sparklineArea.setAttribute("d", areaD);

      if (sparklineDot && points.length) {
        const lastPt = points[points.length - 1];
        sparklineDot.setAttribute("cx", lastPt.x.toFixed(1));
        sparklineDot.setAttribute("cy", lastPt.y.toFixed(1));
      }
    };

    // Update Reservoir Levels & Balance
    const updateReservoirs = (flowM3h) => {
      const storageDeltaRate = document.getElementById("storageDeltaRate");
      const gummaWaterFill = document.getElementById("gummaWaterFill");
      const gummaLevelPct = document.getElementById("gummaLevelPct");
      const gummaLevelKl = document.getElementById("gummaLevelKl");
      const gummaOutflowM3 = document.getElementById("gummaOutflowM3");

      const drablaWaterFill = document.getElementById("drablaWaterFill");
      const drablaLevelPct = document.getElementById("drablaLevelPct");
      const drablaLevelKl = document.getElementById("drablaLevelKl");
      const drablaInflowM3 = document.getElementById("drablaInflowM3");
      const drablaOutflowM3 = document.getElementById("drablaOutflowM3");

      const craignanoWaterFill = document.getElementById("craignanoWaterFill");
      const craignanoLevelPct = document.getElementById("craignanoLevelPct");
      const craignanoLevelKl = document.getElementById("craignanoLevelKl");
      const craignanoInflowM3 = document.getElementById("craignanoInflowM3");

      const inflowFromGummaStage1 = flowM3h > 0 ? flowM3h + (Math.random() - 0.45) * 8 : 0;
      const delta = inflowFromGummaStage1 - flowM3h;

      if (storageDeltaRate) {
        const sign = delta >= 0 ? "+" : "";
        storageDeltaRate.textContent = `${sign}${delta.toFixed(1)} m³/hr (${delta >= 0 ? "Buffer Stable" : "Net Deficit"})`;
      }

      if (gummaOutflowM3) gummaOutflowM3.textContent = `${flowM3h.toFixed(0)} m³/hr`;
      if (drablaInflowM3) drablaInflowM3.textContent = `${inflowFromGummaStage1.toFixed(0)} m³/hr`;
      if (drablaOutflowM3) drablaOutflowM3.textContent = `${flowM3h.toFixed(0)} m³/hr`;
      if (craignanoInflowM3) craignanoInflowM3.textContent = `${flowM3h.toFixed(0)} m³/hr`;

      // Subtly fluctuate levels
      if (scadaState.autoFluctuate && !scadaState.isTripped) {
        scadaState.reservoirs.drabla = Math.max(30, Math.min(92, scadaState.reservoirs.drabla + delta * 0.002));
        scadaState.reservoirs.gumma = Math.max(40, Math.min(95, scadaState.reservoirs.gumma + (Math.random() - 0.5) * 0.08));
        scadaState.reservoirs.craignano = Math.max(45, Math.min(96, scadaState.reservoirs.craignano + (flowM3h > 500 ? 0.03 : -0.05)));
      }

      if (gummaWaterFill && gummaLevelPct && gummaLevelKl) {
        const pct = scadaState.reservoirs.gumma.toFixed(1);
        gummaWaterFill.style.height = `${pct}%`;
        gummaLevelPct.textContent = `${pct}%`;
        gummaLevelKl.textContent = `${Math.round(5000 * (scadaState.reservoirs.gumma / 100)).toLocaleString()} kL / 5,000 kL`;
      }

      if (drablaWaterFill && drablaLevelPct && drablaLevelKl) {
        const pct = scadaState.reservoirs.drabla.toFixed(1);
        drablaWaterFill.style.height = `${pct}%`;
        drablaLevelPct.textContent = `${pct}%`;
        drablaLevelKl.textContent = `${Math.round(2500 * (scadaState.reservoirs.drabla / 100)).toLocaleString()} kL / 2,500 kL`;
      }

      if (craignanoWaterFill && craignanoLevelPct && craignanoLevelKl) {
        const pct = scadaState.reservoirs.craignano.toFixed(1);
        craignanoWaterFill.style.height = `${pct}%`;
        craignanoLevelPct.textContent = `${pct}%`;
        craignanoLevelKl.textContent = `${Math.round(10000 * (scadaState.reservoirs.craignano / 100)).toLocaleString()} kL / 10,000 kL`;
      }
    };

    // Main Telemetry Computation & Render Tick
    const renderTelemetry = () => {
      let activeCount = 0;
      let totalMld = 0;
      let totalKw = 0;
      const jitter = scadaState.autoFluctuate && !scadaState.isTripped ? (Math.random() - 0.5) * 0.15 : 0;

      // Update Individual Pumps
      [1, 2, 3].forEach((id) => {
        const p = scadaState.pumps[id];
        const card = document.getElementById(`pumpCard${id}`);
        const badge = document.getElementById(`pump${id}StatusBadge`);
        const impeller = document.getElementById(`impeller${id}`);
        const rpmEl = document.getElementById(`rpm${id}`);
        const kwEl = document.getElementById(`kw${id}`);
        const mldEl = document.getElementById(`mld${id}`);
        const tempEl = document.getElementById(`temp${id}`);
        const valveEl = document.getElementById(`valve${id}`);
        const btnToggle = document.getElementById(`btnTogglePump${id}`);
        const slider = document.getElementById(`sliderPump${id}`);
        const throttleVal = document.getElementById(`throttleVal${id}`);

        if (throttleVal && slider) {
          throttleVal.textContent = slider.value;
        }

        if (scadaState.isTripped) {
          p.running = false;
        }

        if (p.running) {
          activeCount++;
          const throttleRatio = p.throttle / 100;
          const currentRpm = Math.round(p.baseRpm * throttleRatio + (scadaState.autoFluctuate ? (Math.random() - 0.5) * 4 : 0));
          const currentKw = Math.round(p.baseKw * Math.pow(throttleRatio, 2.5) + (scadaState.autoFluctuate ? (Math.random() - 0.5) * 15 : 0));
          const currentMld = Number((p.ratedMld * throttleRatio + (jitter / 2)).toFixed(2));
          const currentTemp = (p.temp + (throttleRatio - 1) * 8 + (scadaState.autoFluctuate ? (Math.random() - 0.5) * 0.3 : 0)).toFixed(1);

          totalMld += currentMld;
          totalKw += currentKw;

          if (rpmEl) rpmEl.textContent = currentRpm.toLocaleString();
          if (kwEl) kwEl.textContent = `${currentKw.toLocaleString()} kW`;
          if (mldEl) mldEl.textContent = `${currentMld} MLD`;
          if (tempEl) tempEl.textContent = `${currentTemp} °C`;
          if (valveEl) valveEl.textContent = "100% OPEN";

          if (card) {
            card.className = "pump-unit-card running";
          }
          if (badge) {
            badge.className = "pump-status-badge running";
            badge.textContent = "RUNNING";
          }
          if (impeller) {
            impeller.className = "impeller-disc spinning";
          }
          if (btnToggle) {
            btnToggle.className = "btn btn-pump-toggle btn-stop";
            btnToggle.textContent = `Stop Unit ${id}`;
          }
          if (slider) slider.disabled = false;
        } else {
          if (rpmEl) rpmEl.textContent = "0";
          if (kwEl) kwEl.textContent = "0 kW";
          if (mldEl) mldEl.textContent = "0.0 MLD";
          if (tempEl) tempEl.textContent = `${p.temp.toFixed(1)} °C (Amb)`;
          if (valveEl) valveEl.textContent = "0% CLOSED";

          if (card) {
            card.className = "pump-unit-card standby";
          }
          if (badge) {
            badge.className = "pump-status-badge standby";
            badge.textContent = scadaState.isTripped ? "TRIPPED" : "STANDBY";
          }
          if (impeller) {
            impeller.className = "impeller-disc idle";
          }
          if (btnToggle) {
            btnToggle.className = "btn btn-pump-toggle btn-start";
            btnToggle.textContent = `Start Unit ${id}`;
          }
          if (slider) slider.disabled = true;
        }
      });

      // Active count badge
      if (activePumpsCount) {
        activePumpsCount.textContent = `${activeCount} of 3`;
      }
      if (totalActiveHp) {
        totalActiveHp.textContent = `${Math.round(totalKw * 1.341).toLocaleString()} HP`;
      }

      // Flow Rate Metrics
      const finalFlowMld = Math.max(0, Number((totalMld).toFixed(2)));
      const finalFlowM3h = finalFlowMld * 41.6667;
      const capacityPct = Math.min(100, (finalFlowMld / 24.06) * 100);

      if (telemetryFlowMld) telemetryFlowMld.textContent = finalFlowMld.toFixed(2);
      if (telemetryFlowM3h) telemetryFlowM3h.textContent = finalFlowM3h.toFixed(1);
      if (telemetryFlowCapacityPct) telemetryFlowCapacityPct.textContent = `${capacityPct.toFixed(1)}%`;

      if (flowStatusBadge) {
        if (scadaState.isTripped || finalFlowMld === 0) {
          flowStatusBadge.className = "kpi-badge badge-alarm";
          flowStatusBadge.textContent = "NO FLOW";
        } else if (finalFlowMld > 23.5) {
          flowStatusBadge.className = "kpi-badge badge-warning";
          flowStatusBadge.textContent = "HIGH OUTPUT";
        } else {
          flowStatusBadge.className = "kpi-badge badge-normal";
          flowStatusBadge.textContent = "NORMAL";
        }
      }

      // Update Sparkline Data Queue
      scadaState.flowHistory.push(finalFlowMld);
      if (scadaState.flowHistory.length > 25) {
        scadaState.flowHistory.shift();
      }
      drawSparkline();

      // Hydraulic Pressure
      let deliveryBar = 0;
      let totalHeadMeters = 0;
      if (activeCount === 0) {
        deliveryBar = 78.5; // Static gravity column
        totalHeadMeters = 800;
      } else if (activeCount === 1) {
        deliveryBar = 89.4 + (scadaState.autoFluctuate ? (Math.random() - 0.5) * 0.4 : 0);
        totalHeadMeters = 912;
      } else if (activeCount === 2) {
        deliveryBar = 98.6 + (scadaState.autoFluctuate ? (Math.random() - 0.5) * 0.5 : 0);
        totalHeadMeters = 1006;
      } else {
        deliveryBar = 105.4 + (scadaState.autoFluctuate ? (Math.random() - 0.5) * 0.6 : 0);
        totalHeadMeters = 1075;
      }

      if (scadaState.scenario === "surge") {
        deliveryBar = 104.2;
        totalHeadMeters = 1062;
      }

      const suctionBar = activeCount > 0 ? 2.42 + (scadaState.autoFluctuate ? (Math.random() - 0.5) * 0.05 : 0) : 1.10;
      const velocity = finalFlowM3h > 0 ? (finalFlowM3h / 572.5).toFixed(2) : "0.00";

      if (telemetryDeliveryPressure) telemetryDeliveryPressure.textContent = deliveryBar.toFixed(1);
      if (telemetryTotalHead) telemetryTotalHead.textContent = Math.round(totalHeadMeters).toLocaleString();
      if (telemetrySuctionPressure) telemetrySuctionPressure.textContent = suctionBar.toFixed(2);
      if (telemetryVelocity) telemetryVelocity.textContent = `${velocity} m/s`;
      if (pressureMeterFill) {
        const pct = Math.min(100, Math.max(0, (deliveryBar / 120) * 100));
        pressureMeterFill.style.width = `${pct}%`;
      }
      if (pressureSafetyBadge) {
        if (deliveryBar > 103) {
          pressureSafetyBadge.className = "kpi-badge badge-warning";
          pressureSafetyBadge.textContent = "HIGH HEAD";
        } else if (activeCount === 0) {
          pressureSafetyBadge.className = "kpi-badge badge-warning";
          pressureSafetyBadge.textContent = "STATIC ONLY";
        } else {
          pressureSafetyBadge.className = "kpi-badge badge-normal";
          pressureSafetyBadge.textContent = "NOMINAL";
        }
      }

      // Electric Power Demand
      const auxPower = activeCount > 0 ? 100 : 25;
      const finalKw = totalKw + auxPower;
      const sec = finalFlowM3h > 0 ? (finalKw / finalFlowM3h).toFixed(2) : "0.00";
      const freq = activeCount > 0 ? (50.0 + (scadaState.autoFluctuate ? (Math.random() - 0.5) * 0.04 : 0)).toFixed(2) : "50.00";

      if (telemetryPowerKw) telemetryPowerKw.textContent = finalKw.toLocaleString();
      if (telemetrySecIndex) telemetrySecIndex.textContent = sec;
      if (telemetryFrequency) telemetryFrequency.textContent = freq;
      if (telemetryPowerFactor) telemetryPowerFactor.textContent = activeCount > 0 ? "0.94 Lagging" : "0.85 Standby";
      if (powerMeterFill) {
        const pct = Math.min(100, (finalKw / 4800) * 100);
        powerMeterFill.style.width = `${pct}%`;
      }
      if (powerStatusBadge) {
        if (scadaState.isTripped) {
          powerStatusBadge.className = "kpi-badge badge-alarm";
          powerStatusBadge.textContent = "OFFLINE";
        } else if (finalKw > 4000) {
          powerStatusBadge.className = "kpi-badge badge-warning";
          powerStatusBadge.textContent = "HIGH LOAD";
        } else {
          powerStatusBadge.className = "kpi-badge badge-normal";
          powerStatusBadge.textContent = "OPTIMAL";
        }
      }

      // Water Quality
      let turb = scadaState.quality.turbidity;
      let chlorine = scadaState.quality.chlorine;
      let ph = scadaState.quality.ph;

      if (scadaState.scenario === "turbidity") {
        turb = 6.80;
        chlorine = 1.65;
        ph = 7.10;
        if (qualityStatusBadge) {
          qualityStatusBadge.className = "kpi-badge badge-alarm";
          qualityStatusBadge.textContent = "HIGH TURBIDITY";
        }
      } else {
        if (scadaState.autoFluctuate) {
          turb = Number((turb + (Math.random() - 0.5) * 0.04).toFixed(2));
          chlorine = Number((chlorine + (Math.random() - 0.5) * 0.02).toFixed(2));
          ph = Number((ph + (Math.random() - 0.5) * 0.02).toFixed(2));
        }
        if (qualityStatusBadge) {
          qualityStatusBadge.className = "kpi-badge badge-normal";
          qualityStatusBadge.textContent = "POTABLE SAFE";
        }
      }

      if (telemetryTurbidity) telemetryTurbidity.textContent = turb.toFixed(2);
      if (telemetryChlorine) telemetryChlorine.textContent = chlorine.toFixed(2);
      if (telemetryPh) telemetryPh.textContent = ph.toFixed(2);
      if (telemetryTemp) telemetryTemp.textContent = `${scadaState.quality.temp.toFixed(1)} °C`;
      if (telemetryConductivity) telemetryConductivity.textContent = `${scadaState.quality.conductivity} µS/cm`;
      if (telemetryDo) telemetryDo.textContent = `${scadaState.quality.do} mg/L`;

      // Update Reservoirs
      updateReservoirs(finalFlowM3h);
    };

    // Pump Toggle Listeners
    [1, 2, 3].forEach((id) => {
      const btn = document.getElementById(`btnTogglePump${id}`);
      const slider = document.getElementById(`sliderPump${id}`);

      if (btn) {
        btn.addEventListener("click", () => {
          if (scadaState.isTripped) {
            scadaState.isTripped = false;
            if (scadaStatusPill) {
              scadaStatusPill.className = "status-indicator-pill online";
              if (scadaStatusText) scadaStatusText.textContent = "ONLINE • LIVE SIMULATION";
            }
          }
          scadaState.pumps[id].running = !scadaState.pumps[id].running;
          renderTelemetry();
        });
      }

      if (slider) {
        slider.addEventListener("input", (e) => {
          scadaState.pumps[id].throttle = Number(e.target.value);
          renderTelemetry();
        });
      }
    });

    // Console Control Event Handlers
    if (btnToggleSimMode) {
      btnToggleSimMode.addEventListener("click", () => {
        scadaState.autoFluctuate = !scadaState.autoFluctuate;
        btnToggleSimMode.classList.toggle("active", scadaState.autoFluctuate);
        btnToggleSimMode.textContent = scadaState.autoFluctuate ? "Auto-Fluctuate: ON" : "Auto-Fluctuate: OFF";
        btnToggleSimMode.setAttribute("aria-pressed", String(scadaState.autoFluctuate));
      });
    }

    speedButtons.forEach((btn) => {
      btn.addEventListener("click", () => {
        speedButtons.forEach((b) => b.classList.remove("active"));
        btn.classList.add("active");
        scadaState.speedMultiplier = Number(btn.getAttribute("data-speed") || 1);
        restartTimer();
      });
    });

    if (selectScenario) {
      selectScenario.addEventListener("change", (e) => {
        scadaState.scenario = e.target.value;
        scadaState.isTripped = false;
        if (scadaStatusPill) {
          scadaStatusPill.className = "status-indicator-pill online";
          if (scadaStatusText) scadaStatusText.textContent = "ONLINE • SCENARIO LOADED";
        }

        if (scadaState.scenario === "nominal") {
          scadaState.pumps[1].running = true;
          scadaState.pumps[2].running = true;
          scadaState.pumps[3].running = false;
        } else if (scadaState.scenario === "peak") {
          scadaState.pumps[1].running = true;
          scadaState.pumps[2].running = true;
          scadaState.pumps[3].running = true;
        } else if (scadaState.scenario === "single") {
          scadaState.pumps[1].running = true;
          scadaState.pumps[2].running = false;
          scadaState.pumps[3].running = false;
        } else if (scadaState.scenario === "surge") {
          scadaState.pumps[1].running = true;
          scadaState.pumps[2].running = true;
          scadaState.pumps[3].running = false;
        }
        renderTelemetry();
      });
    }

    if (btnEmergencyTrip) {
      btnEmergencyTrip.addEventListener("click", () => {
        scadaState.isTripped = true;
        scadaState.pumps[1].running = false;
        scadaState.pumps[2].running = false;
        scadaState.pumps[3].running = false;

        if (scadaStatusPill) {
          scadaStatusPill.className = "status-indicator-pill trip";
          if (scadaStatusText) scadaStatusText.textContent = "TRIPPED • EMERGENCY SHUTDOWN";
        }
        renderTelemetry();
      });
    }

    if (btnResetTelemetry) {
      btnResetTelemetry.addEventListener("click", () => {
        scadaState.isTripped = false;
        scadaState.scenario = "nominal";
        if (selectScenario) selectScenario.value = "nominal";
        scadaState.pumps[1].running = true;
        scadaState.pumps[1].throttle = 100;
        scadaState.pumps[2].running = true;
        scadaState.pumps[2].throttle = 100;
        scadaState.pumps[3].running = false;
        scadaState.pumps[3].throttle = 100;

        [1, 2, 3].forEach((id) => {
          const s = document.getElementById(`sliderPump${id}`);
          if (s) s.value = "100";
        });

        if (scadaStatusPill) {
          scadaStatusPill.className = "status-indicator-pill online";
          if (scadaStatusText) scadaStatusText.textContent = "ONLINE • BASELINE RESTORED";
        }
        renderTelemetry();
      });
    }

    // Interval Timer Loop
    let tickTimer = null;
    const startTimer = () => {
      const intervalMs = Math.round(1800 / scadaState.speedMultiplier);
      tickTimer = setInterval(renderTelemetry, intervalMs);
    };

    const restartTimer = () => {
      if (tickTimer) clearInterval(tickTimer);
      startTimer();
    };

    renderTelemetry();
    startTimer();

    // ==========================================================================
    // INTERACTIVE GIS ELEVATION WAYPOINT DRAWER
    // ==========================================================================
    const waypointsData = {
      nodeGumma: {
        tag: "STAGE I • RAW INTAKE & WTP",
        title: "New Gumma Water Treatment Plant",
        elevation: "Elevation: 650 meters MSL (Coordinates: 31.189°N, 77.218°E)",
        desc: "Raw water intake from Nauti Khad stream. Features clarification tanks, rapid sand filtration complex, disinfection dosing, and Stage-I clear water sump lifting treated supply through Stage-I rising main directly to Drabla.",
        specs: [
          { lbl: "Elevation Head:", val: "650 m MSL" },
          { lbl: "Process Stage:", val: "Rapid Gravity Clarification & Disinfection" },
          { lbl: "Stage-I Lift:", val: "+800m Dynamic Head Lift to Drabla" },
          { lbl: "Commissioning:", val: "1981–82 (Original Old Gumma: 1921–22)" },
        ],
      },
      nodeDrabla: {
        tag: "STAGE II • INTERMEDIATE PUMPING STATION",
        title: "Drabla Pumping Station",
        elevation: "Elevation: 1,450 meters MSL (Coordinates: 31.185°N, 77.228°E)",
        desc: "Receives treated bulk water from New Gumma (650m) via Stage-I rising main. Accommodates 4 dedicated high-head multistage centrifugal pump sets (Pumps 1, 2, 3 on bed and Pump 4 maintenance bay) powered by 33kV dedicated feeders, lifting water an additional 800m static head toward Craignano ridge.",
        specs: [
          { lbl: "Rising Main:", val: "450mm dia Mild Steel" },
          { lbl: "Design Lift:", val: "+800 Meters (+1,006m Dynamic)" },
          { lbl: "Installed Capacity:", val: "24.06 MLD Bulk Supply" },
          { lbl: "Commissioning:", val: "1981–82 Augmentation" },
        ],
      },
      nodeCraignano: {
        tag: "SUMMIT TERMINAL • BALANCING RESERVOIR",
        title: "Craignano Ridge Summit Reservoir",
        elevation: "Elevation: 2,250 meters MSL (Coordinates: 31.171°N, 77.195°E)",
        desc: "High-altitude ridge summit storage reservoir receiving discharge from Drabla Stage-II pumping main. Serves as master hydraulic head for downstream transmission into the Sanjauli zonal distribution reservoirs.",
        specs: [
          { lbl: "Total Hydraulic Lift:", val: "+1,600 Meters Total Static Head" },
          { lbl: "Storage Capacity:", val: "10,000 kL Balancing Reserve" },
          { lbl: "Downstream Line:", val: "Gravity Main to Sanjauli / Shimla" },
          { lbl: "Historic Milestone:", val: "British-era Hill Lift Summit (1922)" },
        ],
      },
      nodeSanjauli: {
        tag: "DISTRIBUTION CORE • SHIMLA NETWORK",
        title: "Sanjauli Zonal Balancing Reservoir",
        elevation: "Elevation: 2,150 meters MSL (Coordinates: 31.103°N, 77.198°E)",
        desc: "Primary master balancing and distribution reservoir complex receiving bulk water from Craignano and Nauti Khad systems. Supplies central Shimla municipal distribution zones, Mall Road, and surrounding suburbs.",
        specs: [
          { lbl: "Feed Type:", val: "Gravity Inflow from Craignano" },
          { lbl: "Distribution Type:", val: "Pressurized Municipal Zonal Supply" },
          { lbl: "Elevation:", val: "2,150 m MSL" },
          { lbl: "Service Area:", val: "Greater Shimla Municipal Corporation" },
        ],
      },
    };

    const nodeDrawer = document.getElementById("nodeDetailBox");
    const drawerTag = document.getElementById("drawerTag");
    const drawerTitle = document.getElementById("drawerTitle");
    const drawerElevation = document.getElementById("drawerElevation");
    const drawerDesc = document.getElementById("drawerDesc");
    const drawerSpecs = document.getElementById("drawerSpecs");

    Object.keys(waypointsData).forEach((nodeId) => {
      const nodeEl = document.getElementById(nodeId);
      if (!nodeEl) return;

      const selectNode = () => {
        Object.keys(waypointsData).forEach((id) => {
          const el = document.getElementById(id);
          if (el) el.classList.remove("active");
        });
        nodeEl.classList.add("active");

        const data = waypointsData[nodeId];
        if (drawerTag) drawerTag.textContent = data.tag;
        if (drawerTitle) drawerTitle.textContent = data.title;
        if (drawerElevation) drawerElevation.innerHTML = data.elevation;
        if (drawerDesc) drawerDesc.textContent = data.desc;
        if (drawerSpecs) {
          drawerSpecs.innerHTML = data.specs
            .map((s) => `<div><span class="spec-lbl">${s.lbl}</span><span class="spec-val">${s.val}</span></div>`)
            .join("");
        }
      };

      nodeEl.addEventListener("click", selectNode);
      nodeEl.addEventListener("keydown", (e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          selectNode();
        }
      });
    });

    // ==========================================================================
    // HYDRAULIC & ENERGY COST CALCULATOR
    // ==========================================================================
    const calcHours = document.getElementById("calcHours");
    const calcHoursVal = document.getElementById("calcHoursVal");
    const calcFlowRate = document.getElementById("calcFlowRate");
    const calcFlowVal = document.getElementById("calcFlowVal");
    const calcTariff = document.getElementById("calcTariff");
    const calcActivePumps = document.getElementById("calcActivePumps");

    const resDailyVolumeMld = document.getElementById("resDailyVolumeMld");
    const resDailyGallons = document.getElementById("resDailyGallons");
    const resDailyEnergyKwh = document.getElementById("resDailyEnergyKwh");
    const resDailyMwh = document.getElementById("resDailyMwh");
    const resDailyCostInr = document.getElementById("resDailyCostInr");
    const resMonthlyCostLakhs = document.getElementById("resMonthlyCostLakhs");
    const resCarbonKg = document.getElementById("resCarbonKg");

    const runCalculator = () => {
      if (!calcHours || !calcFlowRate || !calcTariff || !calcActivePumps) return;

      const hours = parseFloat(calcHours.value) || 20;
      const flowRate = parseFloat(calcFlowRate.value) || 21.4;
      const tariff = parseFloat(calcTariff.value) || 5.8;
      const pumpUnits = parseInt(calcActivePumps.value, 10) || 2;

      if (calcHoursVal) calcHoursVal.textContent = hours.toFixed(1);
      if (calcFlowVal) calcFlowVal.textContent = flowRate.toFixed(1);

      // Volume = Rate * (Hours / 24)
      const dailyMld = (flowRate * (hours / 24));
      const dailyKl = dailyMld * 1000;
      const dailyGallons = dailyMld * 219969.25;

      // Power = Units * 1560 kW
      const totalKw = pumpUnits * 1560;
      const dailyKwh = totalKw * hours;
      const dailyMwh = dailyKwh / 1000;
      const specificEnergy = dailyKl > 0 ? (dailyKwh / dailyKl).toFixed(2) : "3.50";

      // Cost
      const dailyCost = dailyKwh * tariff;
      const monthlyCost = dailyCost * 30;
      const monthlyLakhs = (monthlyCost / 100000).toFixed(1);

      // Carbon (0.82 kg CO2 / kWh average Indian grid emission factor)
      const carbonKg = Math.round(dailyKwh * 0.82);

      if (resDailyVolumeMld) resDailyVolumeMld.textContent = dailyMld.toFixed(2);
      if (resDailyGallons) {
        resDailyGallons.textContent = `≈ ${(dailyGallons / 1000000).toFixed(2)} Million Imperial Gallons (${Math.round(dailyKl).toLocaleString()} kL)`;
      }

      if (resDailyEnergyKwh) resDailyEnergyKwh.textContent = Math.round(dailyKwh).toLocaleString();
      if (resDailyMwh) {
        resDailyMwh.textContent = `≈ ${dailyMwh.toFixed(2)} MWh @ ${specificEnergy} kWh/kL Specific Energy`;
      }

      if (resDailyCostInr) {
        resDailyCostInr.textContent = `₹${Math.round(dailyCost).toLocaleString("en-IN")}`;
      }
      if (resMonthlyCostLakhs) {
        const crores = (monthlyCost / 10000000).toFixed(2);
        resMonthlyCostLakhs.innerHTML = `Monthly: <strong>₹${crores} Crore</strong> (₹${monthlyLakhs} Lakhs / mo)`;
      }

      if (resCarbonKg) {
        resCarbonKg.textContent = carbonKg.toLocaleString("en-IN");
      }
    };

    [calcHours, calcFlowRate, calcTariff, calcActivePumps].forEach((elem) => {
      if (elem) {
        elem.addEventListener("input", runCalculator);
        elem.addEventListener("change", runCalculator);
      }
    });

    runCalculator();
  }
});

