(function () {
  const header = document.querySelector("[data-header]");
  const menu = document.querySelector("[data-mobile-menu]");
  const openButton = document.querySelector("[data-menu-open]");
  const closeButton = document.querySelector("[data-menu-close]");
  const menuLinks = document.querySelectorAll("[data-mobile-menu] a");
  const forms = document.querySelectorAll("[data-validate-form]");
  const heroSlider = document.querySelector("[data-hero-slider]");
  const faqBlocks = document.querySelectorAll("[data-faq]");
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function updateHeader() {
    if (!header) return;
    header.classList.toggle("is-scrolled", window.scrollY > 8);
  }

  function openMenu() {
    if (!menu || !openButton) return;
    menu.classList.add("is-open");
    document.body.classList.add("menu-open");
    openButton.setAttribute("aria-expanded", "true");
    menu.setAttribute("aria-hidden", "false");
    closeButton && closeButton.focus();
  }

  function closeMenu() {
    if (!menu || !openButton) return;
    menu.classList.remove("is-open");
    document.body.classList.remove("menu-open");
    openButton.setAttribute("aria-expanded", "false");
    menu.setAttribute("aria-hidden", "true");
  }

  function initServicesDropdown() {
    const nav = document.querySelector(".nav");
    const servicesLink = nav ? nav.querySelector('a[href="services.html"]') : null;
    if (!nav || !servicesLink || servicesLink.closest(".nav-dropdown")) return;

    const isCurrent = servicesLink.getAttribute("aria-current");
    const dropdown = document.createElement("div");
    dropdown.className = "nav-dropdown";

    servicesLink.classList.add("nav-dropdown__trigger");
    servicesLink.setAttribute("aria-haspopup", "true");
    servicesLink.setAttribute("aria-expanded", "false");
    if (isCurrent) servicesLink.setAttribute("aria-current", isCurrent);

    dropdown.innerHTML = `
      <div class="nav-dropdown__panel" role="group" aria-label="Amanpero Agency services">
        <div class="nav-dropdown__grid">
          <section class="nav-dropdown__column">
            <p class="nav-dropdown__title">Strategy & Campaigns</p>
            <p class="nav-dropdown__subtitle">Plan the offer and traffic path</p>
            <a class="nav-dropdown__link nav-dropdown__link--strategy" href="service-marketing-strategy.html">Marketing Strategy</a>
            <a class="nav-dropdown__link nav-dropdown__link--campaign" href="service-performance-campaigns.html">Performance Campaigns</a>
          </section>
          <section class="nav-dropdown__column">
            <p class="nav-dropdown__title">Websites & Pages</p>
            <p class="nav-dropdown__subtitle">Design and build conversion assets</p>
            <a class="nav-dropdown__link nav-dropdown__link--design" href="service-web-design.html">Web Design & UX Structure</a>
            <a class="nav-dropdown__link nav-dropdown__link--dev" href="service-website-development.html">Website Development</a>
          </section>
          <section class="nav-dropdown__column">
            <p class="nav-dropdown__title">Optimization & Support</p>
            <p class="nav-dropdown__subtitle">Improve, measure, and maintain</p>
            <a class="nav-dropdown__link nav-dropdown__link--landing" href="service-landing-pages-cro.html">Landing Pages & CRO</a>
            <a class="nav-dropdown__link nav-dropdown__link--support" href="service-analytics-support.html">Analytics & Website Support</a>
          </section>
        </div>
      </div>
    `;

    servicesLink.replaceWith(dropdown);
    dropdown.prepend(servicesLink);

    const setExpanded = (expanded) => servicesLink.setAttribute("aria-expanded", expanded ? "true" : "false");
    dropdown.addEventListener("pointerenter", () => setExpanded(true));
    dropdown.addEventListener("pointerleave", () => setExpanded(false));
    dropdown.addEventListener("focusin", () => setExpanded(true));
    dropdown.addEventListener("focusout", (event) => {
      if (!dropdown.contains(event.relatedTarget)) setExpanded(false);
    });
  }

  function setError(field, message) {
    const wrapper = field.closest(".field");
    const error = wrapper ? wrapper.querySelector(".field__error") : null;
    if (wrapper) wrapper.classList.toggle("is-invalid", Boolean(message));
    if (error) error.textContent = message || "";
  }

  function validateField(field) {
    const value = field.type === "checkbox" ? field.checked : field.value.trim();
    let message = "";

    if (field.hasAttribute("required") && !value) {
      message = field.type === "checkbox" ? "Please confirm your consent." : "This field is required.";
    } else if (field.type === "email" && field.value.trim()) {
      const validEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(field.value.trim());
      if (!validEmail) message = "Please enter a valid email address.";
    }

    setError(field, message);
    return !message;
  }

  function splitHeroHeadings() {
    document.querySelectorAll(".home-hero__copy h1, .home-hero__copy .h1").forEach((heading) => {
      if (heading.dataset.splitDone === "true") return;
      const fragment = document.createDocumentFragment();
      const parts = heading.textContent.split(/(\s+)/);

      parts.forEach((part) => {
        if (/^\s+$/.test(part)) {
          fragment.appendChild(document.createTextNode(part));
          return;
        }

        const word = document.createElement("span");
        const inner = document.createElement("span");
        word.className = "word";
        inner.textContent = part;
        word.appendChild(inner);
        fragment.appendChild(word);
      });

      heading.textContent = "";
      heading.appendChild(fragment);
      heading.dataset.splitDone = "true";
    });
  }

  window.addEventListener("scroll", updateHeader, { passive: true });
  updateHeader();
  initServicesDropdown();

  openButton && openButton.addEventListener("click", openMenu);
  closeButton && closeButton.addEventListener("click", closeMenu);
  menuLinks.forEach((link) => link.addEventListener("click", closeMenu));

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") closeMenu();
  });

  forms.forEach((form) => {
    const requiredFields = form.querySelectorAll("[required]");
    const status = form.querySelector("[data-form-status]");

    requiredFields.forEach((field) => {
      field.addEventListener("blur", () => validateField(field));
      field.addEventListener("input", () => setError(field, ""));
    });

    form.addEventListener("submit", (event) => {
      const honeypot = form.querySelector('[name="website"]');
      const validResults = Array.from(requiredFields).map(validateField);
      const valid = validResults.every(Boolean);

      if (honeypot && honeypot.value.trim() !== "") {
        event.preventDefault();
        if (status) status.textContent = "Submission could not be processed.";
        return;
      }

      if (!valid) {
        event.preventDefault();
        if (status) status.textContent = "Please complete the required fields before submitting.";
      } else if (status) {
        status.textContent = "Sending your inquiry...";
      }
    });
  });

  if (heroSlider) {
    splitHeroHeadings();

    const slides = Array.from(heroSlider.querySelectorAll("[data-hero-slide]"));
    const dots = Array.from(heroSlider.querySelectorAll("[data-hero-dot]"));
    const progress = heroSlider.querySelector("[data-hero-progress]");
    const slideDelay = 11000;
    let activeIndex = 0;
    let timer = null;
    let progressStartedAt = 0;
    let remainingDelay = slideDelay;

    function animateHeroSlide(slide) {
      if (prefersReducedMotion || !window.gsap || !slide) return;
      const words = slide.querySelectorAll(".word span");
      const copyElements = slide.querySelectorAll(".hero-kicker, .home-hero__copy p, .home-hero__copy .cluster");
      const media = slide.querySelector(".home-hero__image, .home-hero__social-bg");
      const badges = slide.querySelectorAll(".social-orbit__badge");

      window.gsap.fromTo(words, { yPercent: 112 }, { yPercent: 0, duration: 0.82, ease: "power4.out", stagger: 0.035 });
      window.gsap.fromTo(copyElements, { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.72, ease: "power3.out", stagger: 0.07, delay: 0.16 });
      if (media) window.gsap.fromTo(media, { scale: 0.94, opacity: 0.66 }, { scale: 1, opacity: 1, duration: 1.1, ease: "power3.out" });
      if (badges.length) window.gsap.fromTo(badges, { scale: 0.5, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.72, ease: "back.out(1.7)", stagger: 0.06, delay: 0.12 });
    }

    function resetProgress(duration) {
      if (!progress || prefersReducedMotion) return;
      progress.style.transition = "none";
      progress.style.width = "0%";
      window.requestAnimationFrame(() => {
        progressStartedAt = Date.now();
        progress.style.transition = `width ${duration}ms linear`;
        progress.style.width = "100%";
      });
    }

    function pauseSlider() {
      if (timer) window.clearTimeout(timer);
      timer = null;
      if (!progress || prefersReducedMotion) return;
      const elapsed = Date.now() - progressStartedAt;
      remainingDelay = Math.max(900, remainingDelay - elapsed);
      const currentWidth = getComputedStyle(progress).width;
      progress.style.transition = "none";
      progress.style.width = currentWidth;
    }

    function scheduleNext(duration) {
      if (prefersReducedMotion || slides.length < 2) return;
      if (timer) window.clearTimeout(timer);
      remainingDelay = duration || slideDelay;
      resetProgress(remainingDelay);
      timer = window.setTimeout(() => showSlide(activeIndex + 1), remainingDelay);
    }

    function showSlide(index, shouldSchedule) {
      activeIndex = (index + slides.length) % slides.length;
      slides.forEach((slide, slideIndex) => {
        slide.classList.toggle("is-active", slideIndex === activeIndex);
      });
      dots.forEach((dot, dotIndex) => {
        const isActive = dotIndex === activeIndex;
        dot.classList.toggle("is-active", isActive);
        dot.setAttribute("aria-current", isActive ? "true" : "false");
      });
      animateHeroSlide(slides[activeIndex]);
      if (shouldSchedule !== false) scheduleNext(slideDelay);
    }

    function startSlider() {
      scheduleNext(remainingDelay);
    }

    function restartSlider() {
      scheduleNext(slideDelay);
    }

    dots.forEach((dot, index) => {
      dot.addEventListener("click", () => {
        showSlide(index);
        restartSlider();
      });
    });

    heroSlider.addEventListener("mouseenter", pauseSlider);
    heroSlider.addEventListener("mouseleave", startSlider);
    heroSlider.addEventListener("focusin", pauseSlider);
    heroSlider.addEventListener("focusout", startSlider);

    if (!prefersReducedMotion) {
      heroSlider.addEventListener("pointermove", (event) => {
        const rect = heroSlider.getBoundingClientRect();
        const x = (event.clientX - rect.left) / rect.width - 0.5;
        const y = (event.clientY - rect.top) / rect.height - 0.5;
        const activeSlide = slides[activeIndex];
        const media = activeSlide ? activeSlide.querySelector(".home-hero__image, .home-hero__social-bg") : null;
        const badges = activeSlide ? activeSlide.querySelectorAll(".social-orbit__badge") : [];

        if (media) media.style.transform = `translate3d(${x * 18}px, ${8 + y * 12}px, 0)`;
        badges.forEach((badge, badgeIndex) => {
          const depth = badgeIndex % 2 === 0 ? 18 : -14;
          badge.style.transform = `translate3d(${x * depth}px, ${y * depth}px, 0)`;
        });
      });

      heroSlider.addEventListener("pointerleave", () => {
        heroSlider.querySelectorAll(".home-hero__image, .home-hero__social-bg, .social-orbit__badge").forEach((element) => {
          element.style.transform = "";
        });
      });
    }

    showSlide(0, false);
    startSlider();
  }

  faqBlocks.forEach((faq) => {
    const buttons = Array.from(faq.querySelectorAll(".faq-accordion__button"));

    buttons.forEach((button) => {
      const panelId = button.getAttribute("aria-controls");
      const panel = panelId ? document.getElementById(panelId) : null;
      const isOpen = button.getAttribute("aria-expanded") === "true";

      if (!panel) return;
      panel.hidden = false;
      panel.classList.toggle("is-open", isOpen);
      panel.style.maxHeight = isOpen ? `${panel.scrollHeight + 28}px` : "0px";
      if (!isOpen) panel.hidden = true;
    });

    buttons.forEach((button) => {
      button.addEventListener("click", () => {
        const panelId = button.getAttribute("aria-controls");
        const panel = panelId ? document.getElementById(panelId) : null;
        const isOpen = button.getAttribute("aria-expanded") === "true";

        if (!panel) return;

        button.setAttribute("aria-expanded", String(!isOpen));
        if (isOpen) {
          panel.style.maxHeight = `${panel.scrollHeight}px`;
          window.requestAnimationFrame(() => {
            panel.classList.remove("is-open");
            panel.style.maxHeight = "0px";
          });
          panel.addEventListener(
            "transitionend",
            () => {
              if (button.getAttribute("aria-expanded") === "false") panel.hidden = true;
            },
            { once: true }
          );
        } else {
          panel.hidden = false;
          window.requestAnimationFrame(() => {
            panel.classList.add("is-open");
            panel.style.maxHeight = `${panel.scrollHeight + 28}px`;
          });
        }
      });
    });
  });

  function initScrollMotion() {
    if (prefersReducedMotion) return;

    const gsap = window.gsap;
    const ScrollTrigger = window.ScrollTrigger;
    if (!gsap || !ScrollTrigger) return;

    gsap.registerPlugin(ScrollTrigger);

    const revealGroups = [
      ".capability-item",
      ".delivery-feature__visual",
      ".delivery-feature__content > *",
      ".service-showcase__header",
      ".service-tile",
      ".service-mini",
      ".why-section__story > *",
      ".why-card",
      ".testimonials-section__header",
      ".testimonial-card",
      ".faq-section__intro",
      ".faq-accordion__item",
      ".cta-band",
    ];

    revealGroups.forEach((selector) => {
      const elements = document.querySelectorAll(selector);
      if (!elements.length) return;

      gsap.from(elements, {
        y: 34,
        opacity: 0,
        duration: 0.8,
        ease: "power3.out",
        stagger: 0.08,
        scrollTrigger: {
          trigger: elements[0],
          start: "top 84%",
          once: true,
        },
      });
    });

    gsap.from(".why-flow strong", {
      scale: 0.3,
      opacity: 0,
      duration: 0.55,
      ease: "back.out(1.8)",
      stagger: 0.08,
      scrollTrigger: {
        trigger: ".why-flow",
        start: "top 82%",
        once: true,
      },
    });

    gsap.to(".service-tile:nth-child(odd)", {
      y: -18,
      ease: "none",
      scrollTrigger: {
        trigger: ".service-tiles",
        start: "top bottom",
        end: "bottom top",
        scrub: true,
      },
    });

    gsap.to(".service-tile:nth-child(even)", {
      y: 18,
      ease: "none",
      scrollTrigger: {
        trigger: ".service-tiles",
        start: "top bottom",
        end: "bottom top",
        scrub: true,
      },
    });
  }

  function attachTilt(selector) {
    if (prefersReducedMotion || !window.matchMedia("(pointer: fine)").matches) return;

    document.querySelectorAll(selector).forEach((card) => {
      card.addEventListener("pointermove", (event) => {
        const rect = card.getBoundingClientRect();
        const x = (event.clientX - rect.left) / rect.width - 0.5;
        const y = (event.clientY - rect.top) / rect.height - 0.5;
        card.style.transform = `perspective(900px) rotateX(${y * -5}deg) rotateY(${x * 6}deg) translateY(-5px)`;
      });

      card.addEventListener("pointerleave", () => {
        card.style.transform = "";
      });
    });
  }

  function attachMagneticButtons() {
    if (prefersReducedMotion || !window.matchMedia("(pointer: fine)").matches) return;

    document.querySelectorAll(".button").forEach((button) => {
      button.addEventListener("pointermove", (event) => {
        const rect = button.getBoundingClientRect();
        const x = (event.clientX - rect.left) / rect.width - 0.5;
        const y = (event.clientY - rect.top) / rect.height - 0.5;
        button.style.transform = `translate3d(${x * 8}px, ${y * 6}px, 0)`;
      });

      button.addEventListener("pointerleave", () => {
        button.style.transform = "";
      });
    });
  }

  function initPageProgress() {
    const bar = document.createElement("span");
    bar.className = "page-progress";
    bar.setAttribute("aria-hidden", "true");
    document.body.appendChild(bar);

    function updateProgress() {
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      const progress = maxScroll > 0 ? window.scrollY / maxScroll : 0;
      bar.style.transform = `scaleX(${Math.min(1, Math.max(0, progress))})`;
    }

    updateProgress();
    window.addEventListener("scroll", updateProgress, { passive: true });
    window.addEventListener("resize", updateProgress);
  }

  function initCursorHalo() {
    if (prefersReducedMotion || !window.matchMedia("(pointer: fine)").matches) return;

    const halo = document.createElement("span");
    const dot = document.createElement("span");
    halo.className = "motion-cursor";
    dot.className = "motion-cursor-dot";
    halo.setAttribute("aria-hidden", "true");
    dot.setAttribute("aria-hidden", "true");
    document.body.classList.add("custom-cursor");
    document.body.appendChild(halo);
    document.body.appendChild(dot);

    let targetX = -80;
    let targetY = -80;
    let haloX = -80;
    let haloY = -80;
    let cursorFrame = null;

    function renderCursor() {
      haloX += (targetX - haloX) * 0.18;
      haloY += (targetY - haloY) * 0.18;
      halo.style.transform = `translate3d(${haloX}px, ${haloY}px, 0) translate(-50%, -50%)`;
      cursorFrame = window.requestAnimationFrame(renderCursor);
    }

    cursorFrame = window.requestAnimationFrame(renderCursor);

    window.addEventListener(
      "pointermove",
      (event) => {
        targetX = event.clientX;
        targetY = event.clientY;
        dot.style.transform = `translate3d(${event.clientX}px, ${event.clientY}px, 0) translate(-50%, -50%)`;
      },
      { passive: true }
    );

    window.addEventListener("pagehide", () => {
      if (cursorFrame) window.cancelAnimationFrame(cursorFrame);
    });

    document.querySelectorAll("a, button, input, select, textarea, label, .service-tile, .testimonial-card, .why-card, .capability-item, .faq-accordion__item, .faq-item, .info-block li").forEach((element) => {
      element.addEventListener("pointerenter", () => {
        halo.classList.add("is-active");
        dot.classList.add("is-active");
      });
      element.addEventListener("pointerleave", () => {
        halo.classList.remove("is-active");
        dot.classList.remove("is-active");
      });
    });

    document.addEventListener("pointerdown", () => {
      halo.classList.add("is-pressed");
      dot.classList.add("is-pressed");
    });

    document.addEventListener("pointerup", () => {
      halo.classList.remove("is-pressed");
      dot.classList.remove("is-pressed");
    });
  }

  function initSpotlightSections() {
    if (prefersReducedMotion || !window.matchMedia("(pointer: fine)").matches) return;

    document.querySelectorAll(".delivery-feature, .faq-section").forEach((section) => {
      section.addEventListener(
        "pointermove",
        (event) => {
          const rect = section.getBoundingClientRect();
          const x = ((event.clientX - rect.left) / rect.width) * 100;
          const y = ((event.clientY - rect.top) / rect.height) * 100;
          section.style.setProperty("--spot-x", `${x}%`);
          section.style.setProperty("--spot-y", `${y}%`);
        },
        { passive: true }
      );
    });
  }

  function initFlowPulse() {
    const steps = Array.from(document.querySelectorAll(".why-flow span"));
    if (!steps.length || prefersReducedMotion) return;
    let index = 0;

    window.setInterval(() => {
      steps.forEach((step, stepIndex) => step.classList.toggle("is-active", stepIndex === index));
      index = (index + 1) % steps.length;
    }, 1400);
  }

  initScrollMotion();
  attachTilt(".service-tile, .testimonial-card, .why-card, .capability-item");
  attachMagneticButtons();
  initPageProgress();
  initCursorHalo();
  initSpotlightSections();
  initFlowPulse();
})();
