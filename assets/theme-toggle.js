(function () {
  var KEY = "thehippo-theme";
  var HOME_TITLE = "TheHippoCo Status";
  var HOME_DESC = "The pulse of TheHippoCo. Live uptime and response times for TheHippoCo sites.";

  // Public sites only. Control Plane is intentionally omitted: no URL, no description.
  var SITES = {
    "the-hippo": {
      name: "TheHippoCo",
      url: "https://thehippo.co",
      host: "thehippo.co",
      description:
        "TheHippoCo, also presented as Hippo Co, is the brand homepage at thehippo.co — a simple, logo-led landing page."
    },
    "cigar-nexus": {
      name: "Cigar Nexus",
      url: "https://cigarnexus.app",
      host: "cigarnexus.app",
      description:
        "Cigar Nexus is an interactive map of the premium cigar industry, showing ownership, factories, and relationships across Nicaragua, the Dominican Republic, Honduras, and Costa Rica. A directory of brands, factories, people, and companies sits alongside the map."
    },
    "rupture-report": {
      name: "Rupture Report",
      url: "https://rupturereport.com",
      host: "rupturereport.com",
      description:
        "Rupture Report tracks torn ACLs and Achilles tendons in the NFL, with surface, game context, and recovery status for the 2026 season."
    },
    "mr-jw-bentley": {
      name: "Mr JW Bentley",
      url: "https://mrjwbentley.com",
      host: "mrjwbentley.com",
      description:
        "This is the professional site of James W. Bentley, a Director of Support and customer-success leader based in Sylva, North Carolina. It covers his work in SaaS support leadership and a 25+ year background in tech, IT, and digital marketing."
    },
    "bentley-mail": {
      name: "Bentley Mail",
      url: "https://bentleymail.site",
      host: "bentleymail.site",
      description:
        "Bentley Mail is a premium email service, described on its own site as email with elegance and style."
    },
    ameilius: {
      name: "Ameilius",
      url: "https://ameilius.com",
      host: "ameilius.com",
      description:
        "Ameilius is a personal homepage and link hub — “It's been a long time…” — with links to X, SoundCloud, TradingView, and projects including Cigar Nexus."
    },
    baincrest: {
      name: "Baincrest",
      url: "https://baincrest.com",
      host: "baincrest.com",
      description:
        "Baincrest’s homepage uses the line “Success is a decision” and links out to X, Discord, TradingView, and Kraken Pro, including a prompt to track markets on TradingView."
    },
    "explore-sylva": {
      name: "Explore Sylva",
      url: "https://exploresylva.com",
      host: "exploresylva.com",
      description:
        "Explore Sylva is a web design and digital marketing studio in Sylva, North Carolina, serving local businesses in Western North Carolina. Its work is mobile-first websites and marketing meant to capture the spirit of the Blue Ridge Mountains."
    },
    "pawsitive-care": {
      name: "Pawsitive Care",
      url: "https://pawsitivecarepetservs.com",
      host: "pawsitivecarepetservs.com",
      description:
        "Pawsitive Care is a locally owned pet-sitting service in Haywood and Jackson Counties, Western North Carolina. It offers drop-in visits, overnight stays, adventure trail hikes, pet taxi rides, and related in-home care so pets can stay in their own space."
    }
  };

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

  function mountToggle() {
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

  function historySlug() {
    var path = (location.pathname || "").replace(/\/+$/, "") || "/";
    var match = path.match(/\/history\/([^/]+)$/);
    return match ? decodeURIComponent(match[1]) : "";
  }

  function upsertMeta(name, content) {
    var el = document.querySelector('meta[name="' + name + '"]');
    if (!el) {
      el = document.createElement("meta");
      el.setAttribute("name", name);
      document.head.appendChild(el);
    }
    el.setAttribute("content", content);
  }

  function setSeo(title, description) {
    document.title = title;
    upsertMeta("description", description);
    var ogt = document.querySelector('meta[property="og:title"]');
    if (ogt) ogt.setAttribute("content", title);
    var ogd = document.querySelector('meta[property="og:description"]');
    if (ogd) ogd.setAttribute("content", description);
  }

  function removeProfiles() {
    var nodes = document.querySelectorAll(".site-profile");
    for (var i = 0; i < nodes.length; i++) nodes[i].remove();
  }

  function hideSecretUrl(heading) {
    var links = heading.querySelectorAll("a[href]");
    for (var i = 0; i < links.length; i++) {
      var href = links[i].getAttribute("href") || "";
      if (href && href !== "#") {
        links[i].setAttribute("href", "#");
        links[i].removeAttribute("target");
        links[i].removeAttribute("rel");
      }
    }
  }

  function enhanceHistory() {
    var slug = historySlug();
    if (!slug) {
      removeProfiles();
      setSeo(HOME_TITLE, HOME_DESC);
      return;
    }

    var heading = document.querySelector("h1");
    if (!heading) return;

    if (slug === "control-plane" || !SITES[slug]) {
      removeProfiles();
      hideSecretUrl(heading);
      var label =
        slug === "control-plane"
          ? "Control Plane"
          : (heading.textContent || slug).replace(/\s*U[pP]\s*$/, "").trim() || slug;
      setSeo(label + " · TheHippoCo Status", "Uptime and response time history · TheHippoCo Status.");
      return;
    }

    var info = SITES[slug];
    setSeo(info.name + " · TheHippoCo Status", info.description);

    var existing = document.querySelector(".site-profile");
    if (existing && existing.getAttribute("data-slug") === slug) return;
    removeProfiles();

    var box = document.createElement("div");
    box.className = "site-profile";
    box.setAttribute("data-slug", slug);

    var p = document.createElement("p");
    p.className = "site-profile-desc";
    p.textContent = info.description;

    var a = document.createElement("a");
    a.className = "site-profile-link";
    a.href = info.url;
    a.textContent = "Visit " + info.host;

    box.appendChild(p);
    box.appendChild(a);

    var section = heading.parentElement;
    if (section && heading.nextSibling) {
      section.insertBefore(box, heading.nextSibling);
    } else if (section) {
      section.appendChild(box);
    } else {
      heading.insertAdjacentElement("afterend", box);
    }
  }

  function enhanceTiles() {
    var tiles = document.querySelectorAll("article.link");
    for (var i = 0; i < tiles.length; i++) {
      var tile = tiles[i];
      var link = tile.querySelector('h4 a[href*="/history/"]');
      if (!link) continue;
      tile.classList.add("tile-clickable");
      if (!link.getAttribute("data-tile-link")) {
        link.setAttribute("data-tile-link", "true");
        var name = (link.textContent || "site").trim();
        if (!link.getAttribute("aria-label")) {
          link.setAttribute("aria-label", "View uptime history for " + name);
        }
      }
    }
  }

  function enhance() {
    disableBuiltInThemes();
    mountToggle();
    enhanceTiles();
    enhanceHistory();
  }

  var enhanceTimer = 0;
  function queueEnhance() {
    if (enhanceTimer) clearTimeout(enhanceTimer);
    enhanceTimer = setTimeout(function () {
      enhanceTimer = 0;
      enhance();
    }, 30);
  }

  disableBuiltInThemes();
  apply(current());
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", enhance);
  } else {
    enhance();
  }

  var obs = new MutationObserver(queueEnhance);
  obs.observe(document.documentElement, { childList: true, subtree: true });

  window.addEventListener("popstate", queueEnhance);

  var push = history.pushState;
  var replace = history.replaceState;
  history.pushState = function () {
    var result = push.apply(this, arguments);
    queueEnhance();
    return result;
  };
  history.replaceState = function () {
    var result = replace.apply(this, arguments);
    queueEnhance();
    return result;
  };

  // Fallback if the stretched CSS link is ever blocked: click the tile's existing history link.
  document.addEventListener("click", function (event) {
    if (event.defaultPrevented || event.button !== 0) return;
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    var tile = event.target.closest && event.target.closest("article.link");
    if (!tile) return;
    if (event.target.closest("a, button, input, label, .theme-toggle")) return;
    var link = tile.querySelector('h4 a[href*="/history/"]');
    if (!link) return;
    event.preventDefault();
    link.click();
  });
})();
