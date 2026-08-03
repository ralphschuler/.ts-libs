(() => {
  const root = document.documentElement;
  const storageKey = "ts-libs-docs-theme";

  const getStoredTheme = () => {
    try {
      return localStorage.getItem(storageKey);
    } catch {
      return null;
    }
  };

  const setTheme = (theme) => {
    root.dataset.theme = theme;
    document.querySelectorAll("[data-theme-label]").forEach((label) => {
      label.textContent = theme === "light" ? "Dark" : "Light";
    });
    try {
      localStorage.setItem(storageKey, theme);
    } catch {
      // Theme persistence is optional; the page remains fully usable.
    }
  };

  setTheme(getStoredTheme() || "dark");
  document.querySelectorAll("[data-theme-toggle]").forEach((button) => {
    button.addEventListener("click", () => {
      setTheme(root.dataset.theme === "light" ? "dark" : "light");
    });
  });

  const shell = document.querySelector("[data-shell]");
  const navToggle = document.querySelector("[data-nav-toggle]");
  const navClose = document.querySelector("[data-nav-close]");
  const overlay = document.querySelector("[data-overlay]");
  const closeNav = () => {
    shell?.classList.remove("nav-open");
    navToggle?.setAttribute("aria-expanded", "false");
  };
  const openNav = () => {
    shell?.classList.add("nav-open");
    navToggle?.setAttribute("aria-expanded", "true");
    document.querySelector(".sidebar a")?.focus();
  };
  navToggle?.addEventListener("click", openNav);
  navClose?.addEventListener("click", closeNav);
  overlay?.addEventListener("click", closeNav);
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") closeNav();
  });

  const searchItems = Array.isArray(window.__TS_LIBS_SEARCH__)
    ? window.__TS_LIBS_SEARCH__
    : [];
  const normalize = (value) =>
    value.toLocaleLowerCase("de").normalize("NFKD").replace(/[\u0300-\u036f]/g, "");

  document.querySelectorAll("[data-search-wrap]").forEach((wrap) => {
    const input = wrap.querySelector("[data-search]");
    const results = wrap.querySelector("[data-search-results]");
    if (!(input instanceof HTMLInputElement) || !(results instanceof HTMLElement)) return;

    const hide = () => {
      results.hidden = true;
      results.replaceChildren();
    };

    input.addEventListener("input", () => {
      const query = normalize(input.value.trim());
      if (query.length < 2) {
        hide();
        return;
      }

      const matches = searchItems
        .filter((item) => item.searchable.includes(query))
        .slice(0, 8);
      results.replaceChildren();

      if (matches.length === 0) {
        const empty = document.createElement("p");
        empty.className = "search-empty";
        empty.textContent = "Kein Modul gefunden.";
        results.append(empty);
      } else {
        matches.forEach((item) => {
          const link = document.createElement("a");
          link.href = `${wrap.dataset.root || "./"}modules/${item.slug}/`;
          const strong = document.createElement("strong");
          strong.textContent = item.title;
          const span = document.createElement("span");
          span.textContent = item.summary;
          link.append(strong, span);
          results.append(link);
        });
      }
      results.hidden = false;
    });

    input.addEventListener("keydown", (event) => {
      if (event.key === "Escape") {
        hide();
        input.blur();
      }
      if (event.key === "ArrowDown") {
        const first = results.querySelector("a");
        if (first instanceof HTMLAnchorElement) {
          event.preventDefault();
          first.focus();
        }
      }
    });
    document.addEventListener("click", (event) => {
      if (!wrap.contains(event.target)) hide();
    });
  });

  const moduleSearch = document.querySelector("[data-module-filter]");
  const cards = [...document.querySelectorAll("[data-module-card]")];
  const filterButtons = [...document.querySelectorAll("[data-category-filter]")];
  let activeCategory = "all";

  const filterCards = () => {
    const query = normalize(moduleSearch?.value.trim() || "");
    let visible = 0;
    cards.forEach((card) => {
      const matchesCategory =
        activeCategory === "all" || card.dataset.category === activeCategory;
      const matchesQuery = !query || normalize(card.dataset.search || "").includes(query);
      const show = matchesCategory && matchesQuery;
      card.hidden = !show;
      if (show) visible += 1;
    });
    const count = document.querySelector("[data-result-count]");
    if (count) count.textContent = `${visible} Module`;
  };

  moduleSearch?.addEventListener("input", filterCards);
  filterButtons.forEach((button) => {
    button.addEventListener("click", () => {
      activeCategory = button.dataset.categoryFilter || "all";
      filterButtons.forEach((candidate) => {
        const selected = candidate === button;
        candidate.classList.toggle("active", selected);
        candidate.setAttribute("aria-pressed", String(selected));
      });
      filterCards();
    });
  });

  document.querySelectorAll("[data-copy]").forEach((button) => {
    button.addEventListener("click", async () => {
      const code = button.closest(".code-block")?.querySelector("code")?.textContent;
      if (!code) return;
      try {
        await navigator.clipboard.writeText(code);
        const original = button.textContent;
        button.textContent = "Kopiert";
        window.setTimeout(() => {
          button.textContent = original;
        }, 1400);
      } catch {
        button.textContent = "Nicht verfügbar";
      }
    });
  });

  const progress = document.querySelector("[data-reading-progress]");
  if (progress) {
    const updateProgress = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const value = max > 0 ? Math.min(100, (window.scrollY / max) * 100) : 0;
      progress.style.width = `${value}%`;
    };
    updateProgress();
    window.addEventListener("scroll", updateProgress, { passive: true });
  }
})();
