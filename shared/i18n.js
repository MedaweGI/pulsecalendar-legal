/* PulseCalendar website i18n engine.
 * Runtime translation of a French-default static site into 16 languages,
 * with a flag language switcher injected into the nav header.
 *
 * Design:
 *  - French stays in the HTML (graceful no-JS fallback + SEO default).
 *  - window.PC_I18N (shared/i18n-data.js) holds { lang: { frSource: translation } }.
 *  - We walk text nodes + a few attributes, keying on the ORIGINAL French text
 *    (stored per-node in a WeakMap) so switching between any two languages works.
 *  - A MutationObserver re-translates content rendered late by React (scrolly,
 *    phone mockups, theme grid).
 *  - Missing keys fall back to French — a missing translation never breaks the page.
 */
(function () {
  "use strict";

  // Le code interne du chinois DOIT être "zh-Hans" — identique à la clé de
  // window.PC_I18N (i18n-data.js) ET aux dossiers assets/screens/zh-Hans. Avec "zh"
  // seul, dictFor("zh")=DATA["zh"]=undefined → le chinois ne se traduit jamais, et
  // l'état "zh" invalide corrompt aussi les changements de langue suivants. (fix zh-Hans)
  // "en-US" = variante régionale : MÊME texte que "en" (alias dans dictFor), mais
  // son propre jeu de captures (°F) via screens-i18n.js.
  var LANGS = ["fr", "en", "en-US", "es", "de", "ja", "ko", "ar", "ru", "zh-Hans"];
  var RTL = { ar: true };
  var FLAG = { fr: "🇫🇷", en: "🇬🇧", "en-US": "🇺🇸", es: "🇪🇸", de: "🇩🇪", ja: "🇯🇵", ko: "🇰🇷", ar: "🇸🇦", ru: "🇷🇺", "zh-Hans": "🇨🇳" };
  var NATIVE = { fr: "Français", en: "English", "en-US": "English (US)", es: "Español", de: "Deutsch", ja: "日本語", ko: "한국어", ar: "العربية", ru: "Русский", "zh-Hans": "中文" };
  var HTML_LANG = {}; // <html lang> = le code tel quel ("zh-Hans" inclus)
  var STORE = "pc_lang";

  var ORIG = new WeakMap();        // textNode -> original French value (with whitespace)
  var ATTR_ORIG = new WeakMap();   // element -> { attr: originalValue }
  var current = "fr";
  var observer = null;

  function norm(s) { return s.replace(/\s+/g, " ").trim(); }

  // Read the translation table lazily so script load-order never matters.
  function dictFor(lang) {
    if (lang === "en-US") lang = "en";           // même texte que l'anglais
    var DATA = (typeof window !== "undefined" && window.PC_I18N) ? window.PC_I18N : {};
    return (lang !== "fr" && DATA[lang]) ? DATA[lang] : null;
  }

  // ---- text nodes ----------------------------------------------------------
  function translateTextNode(node, lang) {
    var fr = ORIG.get(node);
    if (fr === undefined) { fr = node.nodeValue; ORIG.set(node, fr); }
    if (!fr || !fr.trim()) return;
    if (lang === "fr") { if (node.nodeValue !== fr) node.nodeValue = fr; return; }
    var dict = dictFor(lang); if (!dict) return;
    var val = dict[norm(fr)];
    if (val === undefined || val === null) { // pas de traduction → REVENIR au français
      if (node.nodeValue !== fr) node.nodeValue = fr; // (ne PAS laisser la langue précédente = bug « bloqué en chinois »)
      return;
    }
    var lead = (fr.match(/^\s*/) || [""])[0];
    var trail = (fr.match(/\s*$/) || [""])[0];
    var next = lead + val + trail;
    if (node.nodeValue !== next) node.nodeValue = next;
  }

  var SKIP_PARENT = { SCRIPT: 1, STYLE: 1, NOSCRIPT: 1, TEXTAREA: 1 };
  function walkText(root, lang) {
    if (!root) return;
    var tw = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
      acceptNode: function (n) {
        var p = n.parentNode;
        if (!p) return NodeFilter.FILTER_REJECT;
        if (SKIP_PARENT[p.nodeName]) return NodeFilter.FILTER_REJECT;
        if (p.closest && p.closest("[data-pc-i18n-ui],[translate='no']")) return NodeFilter.FILTER_REJECT;
        if (!n.nodeValue || !n.nodeValue.trim()) return NodeFilter.FILTER_REJECT;
        return NodeFilter.FILTER_ACCEPT;
      }
    });
    var nodes = [], x;
    while ((x = tw.nextNode())) nodes.push(x);
    for (var i = 0; i < nodes.length; i++) translateTextNode(nodes[i], lang);
  }

  // ---- attributes ----------------------------------------------------------
  var ATTRS = ["placeholder", "aria-label", "alt", "title"];
  function translateAttrs(root, lang) {
    if (!root || !root.querySelectorAll) return;
    var sel = ATTRS.map(function (a) { return "[" + a + "]"; }).join(",");
    var els = root.querySelectorAll(sel);
    for (var i = 0; i < els.length; i++) {
      var el = els[i];
      if (el.closest && el.closest("[data-pc-i18n-ui]")) continue;
      var store = ATTR_ORIG.get(el) || {};
      for (var j = 0; j < ATTRS.length; j++) {
        var a = ATTRS[j];
        if (!el.hasAttribute(a)) continue;
        if (store[a] === undefined) store[a] = el.getAttribute(a);
        var fr = store[a];
        if (lang === "fr") { el.setAttribute(a, fr); continue; }
        var dict = dictFor(lang); if (!dict) continue;
        var val = dict[norm(fr)];
        el.setAttribute(a, (val !== undefined && val !== null) ? val : fr); // fallback FR (pas la langue précédente)
      }
      ATTR_ORIG.set(el, store);
    }
  }

  // ---- <head> title + meta description -------------------------------------
  function translateHead(lang) {
    var dict = dictFor(lang);
    var titleEl = document.querySelector("title");
    if (titleEl) {
      var ft = ORIG.get(titleEl);
      if (ft === undefined) { ft = titleEl.textContent; ORIG.set(titleEl, ft); }
      titleEl.textContent = (lang === "fr") ? ft : ((dict && dict[norm(ft)]) || ft);
    }
    var md = document.querySelector('meta[name="description"]');
    if (md) {
      var fd = ATTR_ORIG.get(md) || {};
      if (fd.content === undefined) fd.content = md.getAttribute("content") || "";
      md.setAttribute("content", (lang === "fr") ? fd.content : ((dict && dict[norm(fd.content)]) || fd.content));
      ATTR_ORIG.set(md, fd);
    }
  }

  // ---- apply ---------------------------------------------------------------
  function apply(lang) {
    if (LANGS.indexOf(lang) < 0) lang = "fr";
    current = lang;
    try { localStorage.setItem(STORE, lang); } catch (e) {}
    var docEl = document.documentElement;
    docEl.setAttribute("lang", HTML_LANG[lang] || lang);
    docEl.setAttribute("dir", RTL[lang] ? "rtl" : "ltr");
    walkText(document.body, lang);
    translateAttrs(document.body, lang);
    translateHead(lang);
    updateSwitcher(lang);
  }

  // ---- language switcher (injected into .nav-inner) ------------------------
  function buildSwitcher() {
    if (document.getElementById("pc-lang")) return true;
    var navInner = document.querySelector(".nav .nav-inner") || document.querySelector(".nav-inner");
    if (!navInner) return false;

    var wrap = document.createElement("div");
    wrap.id = "pc-lang";
    wrap.setAttribute("data-pc-i18n-ui", "");
    wrap.className = "pc-lang";

    var btn = document.createElement("button");
    btn.type = "button";
    btn.className = "pc-lang-btn";
    btn.setAttribute("aria-haspopup", "listbox");
    btn.setAttribute("aria-expanded", "false");
    btn.setAttribute("aria-label", "Language");
    btn.innerHTML = '<span class="pc-lang-flag"></span><span class="pc-lang-code"></span><span class="pc-lang-caret">▾</span>';

    var menu = document.createElement("ul");
    menu.className = "pc-lang-menu";
    menu.setAttribute("role", "listbox");
    menu.hidden = true;
    LANGS.forEach(function (l) {
      var li = document.createElement("li");
      li.setAttribute("role", "option");
      li.dataset.lang = l;
      li.innerHTML = '<span class="pc-lang-flag">' + FLAG[l] + "</span><span>" + NATIVE[l] + "</span>";
      li.addEventListener("click", function () { setLang(l); closeMenu(); });
      menu.appendChild(li);
    });

    function openMenu() { menu.hidden = false; btn.setAttribute("aria-expanded", "true"); }
    function closeMenu() { menu.hidden = true; btn.setAttribute("aria-expanded", "false"); }
    btn.addEventListener("click", function (e) {
      e.stopPropagation();
      if (menu.hidden) openMenu(); else closeMenu();
    });
    document.addEventListener("click", function (e) { if (!wrap.contains(e.target)) closeMenu(); });
    document.addEventListener("keydown", function (e) { if (e.key === "Escape") closeMenu(); });

    wrap.appendChild(btn);
    wrap.appendChild(menu);
    // place it just before the nav CTA if present, else at the end
    var cta = navInner.querySelector(".nav-cta");
    if (cta) navInner.insertBefore(wrap, cta); else navInner.appendChild(wrap);
    return true;
  }

  function updateSwitcher(lang) {
    var wrap = document.getElementById("pc-lang");
    if (!wrap) return;
    var f = wrap.querySelector(".pc-lang-btn .pc-lang-flag");
    var c = wrap.querySelector(".pc-lang-btn .pc-lang-code");
    if (f) f.textContent = FLAG[lang] || "🌐";
    if (c) c.textContent = (lang === "zh-Hans" ? "ZH" : lang === "en-US" ? "US" : lang.toUpperCase());
    var items = wrap.querySelectorAll(".pc-lang-menu li");
    for (var i = 0; i < items.length; i++) {
      items[i].setAttribute("aria-selected", items[i].dataset.lang === lang ? "true" : "false");
    }
  }

  function injectStyles() {
    if (document.getElementById("pc-lang-style")) return;
    var css = [
      ".pc-lang{position:relative;display:inline-flex;align-items:center;margin-left:14px;font-family:inherit}",
      ".pc-lang-btn{display:inline-flex;align-items:center;gap:6px;cursor:pointer;border:1px solid rgba(255,255,255,.18);background:rgba(255,255,255,.06);color:inherit;border-radius:999px;padding:6px 10px;font-size:13px;font-weight:600;line-height:1;transition:background .2s,border-color .2s}",
      ".pc-lang-btn:hover{background:rgba(255,255,255,.12);border-color:rgba(255,255,255,.30)}",
      ".pc-lang-flag{font-size:15px;line-height:1}",
      ".pc-lang-caret{font-size:10px;opacity:.7}",
      ".pc-lang-menu{position:absolute;top:calc(100% + 8px);right:0;margin:0;padding:6px;list-style:none;min-width:168px;background:#16131f;border:1px solid rgba(255,255,255,.14);border-radius:12px;box-shadow:0 12px 32px rgba(0,0,0,.45);z-index:1000}",
      ".pc-lang-menu li{display:flex;align-items:center;gap:10px;padding:8px 10px;border-radius:8px;cursor:pointer;font-size:14px;color:#e9e6f2;white-space:nowrap}",
      ".pc-lang-menu li:hover{background:rgba(255,255,255,.08)}",
      ".pc-lang-menu li[aria-selected='true']{background:rgba(123,92,240,.22);color:#fff}",
      "[dir='rtl'] .pc-lang-menu{right:auto;left:0}",
      "[dir='rtl'] .pc-lang{margin-left:0;margin-right:14px}",
      "@media (max-width:560px){.pc-lang-code{display:none}}"
    ].join("\n");
    var s = document.createElement("style");
    s.id = "pc-lang-style";
    s.textContent = css;
    document.head.appendChild(s);
  }

  function setLang(lang) { apply(lang); }

  // ---- initial language detection ------------------------------------------
  function detect() {
    try {
      var saved = localStorage.getItem(STORE);
      if (saved === "zh") saved = "zh-Hans"; // migration de l'ancien code chinois
      if (saved && LANGS.indexOf(saved) >= 0) return saved;
    } catch (e) {}
    try {
      var q = new URLSearchParams(location.search).get("lang");
      if (q && LANGS.indexOf(q) >= 0) return q;
    } catch (e) {}
    var navs = navigator.languages || [navigator.language || "fr"];
    for (var i = 0; i < navs.length; i++) {
      var full = String(navs[i] || "").toLowerCase();
      if (full === "en-us" && LANGS.indexOf("en-US") >= 0) return "en-US"; // US → °F
      var base = full.split("-")[0];
      if (base === "zh") return "zh-Hans";
      if (LANGS.indexOf(base) >= 0) return base;
    }
    return "fr";
  }

  // ---- observe React-rendered content --------------------------------------
  function startObserver() {
    if (observer || !window.MutationObserver) return;
    // Translate nodes rendered late (React: scrolly, phone mockups, theme grid)
    // synchronously. Our own changes are characterData/attribute mutations, which
    // we don't observe (childList only), so there is no feedback loop.
    observer = new MutationObserver(function (muts) {
      var lang = current;
      if (lang === "fr") return;
      for (var i = 0; i < muts.length; i++) {
        var nodes = muts[i].addedNodes;
        for (var j = 0; j < nodes.length; j++) {
          var n = nodes[j];
          if (n.nodeType === 1) { walkText(n, lang); translateAttrs(n, lang); }
          else if (n.nodeType === 3) { translateTextNode(n, lang); }
        }
      }
    });
    observer.observe(document.body, { childList: true, subtree: true });
  }

  var inited = false;
  function init() {
    if (inited) return; // guard against double-include / mixed defer ordering
    inited = true;
    try {
      injectStyles();
      var tries = 0;
      (function ensureSwitcher() {
        if (buildSwitcher() || tries++ > 40) {
          apply(detect());
        } else {
          setTimeout(ensureSwitcher, 100); // nav injected late (sub-pages via nav-footer.js)
        }
      })();
      startObserver();
    } catch (e) { /* never break the page */ }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }

  window.PCI18n = { apply: apply, setLang: setLang, get current() { return current; } };
})();
