(function () {
  var KEY = "thehippo-theme";

  function preferred() {
    try {
      if (window.matchMedia && window.matchMedia("(prefers-color-scheme: light)").matches) {
        return "light";
      }
    } catch (e) {}
    return "dark";
  }

  function current() {
    var t = document.documentElement.getAttribute("data-theme");
    if (t === "light" || t === "dark") return t;
    try {
      t = localStorage.getItem(KEY);
    } catch (e) {
      t = null;
    }
    return t === "light" || t === "dark" ? t : preferred();
  }

  function apply(theme) {
    document.documentElement.setAttribute("data-theme", theme);
    document.documentElement.style.colorScheme = theme;
    try {
      localStorage.setItem(KEY, theme);
    } catch (e) {}
    var btn = document.getElementById("theme-toggle");
    if (btn) {
      var next = theme === "dark" ? "light" : "dark";
      btn.setAttribute("aria-label", "Switch to " + next + " theme");
      btn.setAttribute("title", "Switch to " + next + " theme");
      btn.setAttribute("aria-pressed", theme === "dark" ? "true" : "false");
    }
    var meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute("content", theme === "dark" ? "#03040b" : "#f3f0ea");
  }

  function disableBuiltInThemes() {
    var links = document.querySelectorAll('link[rel="stylesheet"][href*="/themes/"]');
    for (var i = 0; i < links.length; i++) {
      links[i].disabled = true;
      links[i].media = "not all";
    }
  }

  function mount() {
    if (document.getElementById("theme-toggle")) {
      apply(current());
      return;
    }
    var nav = document.querySelector("nav .container") || document.querySelector("nav");
    if (!nav) return;
    var btn = document.createElement("button");
    btn.id = "theme-toggle";
    btn.type = "button";
    btn.className = "theme-toggle";
    btn.innerHTML =
      '<svg class="icon-moon" viewBox="0 0 24 24" aria-hidden="true"><path d="M21 14.5A8.5 8.5 0 1 1 9.5 3 7 7 0 0 0 21 14.5z"></path></svg>' +
      '<svg class="icon-sun" viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="4"></circle><path d="M12 3v2M12 19v2M5 12H3M21 12h-2M6.2 6.2 4.8 4.8M19.2 19.2l-1.4-1.4M17.8 6.2l1.4-1.4M6.2 17.8l-1.4 1.4"></path></svg>';
    btn.addEventListener("click", function () {
      apply(current() === "dark" ? "light" : "dark");
    });
    nav.appendChild(btn);
    apply(current());
  }

  disableBuiltInThemes();
  apply(current());
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", function () {
      disableBuiltInThemes();
      mount();
    });
  } else {
    mount();
  }

  var obs = new MutationObserver(function () {
    disableBuiltInThemes();
    if (!document.getElementById("theme-toggle")) mount();
  });
  obs.observe(document.documentElement, { childList: true, subtree: true });
})();
