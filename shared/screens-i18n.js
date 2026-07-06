/* Screenshots par langue : swap les <img class="screen-photo"> vers
   assets/screens/<lang>/<vue>.png selon la langue courante (window.PCI18n.current),
   avec repli sur l'anglais (racine assets/screens/<vue>.png) pour les langues
   sans jeu localisé. Sans toucher PhoneFrame ni recompiler (CSP-safe : fichier externe).
   Hooke window.PCI18n.apply pour réagir au changement de langue + retries au chargement
   (les images React arrivent tard). */
(function () {
  var LANGS = { fr:1, de:1, es:1, ja:1, ko:1, ar:1, ru:1, "zh-Hans":1 }; // langues avec jeu localisé
  var V = 8; // version de cache (aligne avec PhoneFrame ?v=)

  function curLang() {
    if (window.PCI18n && window.PCI18n.current) return window.PCI18n.current;
    try { return localStorage.getItem("pc_lang") || "en"; } catch (e) { return "en"; }
  }
  function swap() {
    var lang = curLang();
    var imgs = document.querySelectorAll("img.screen-photo");
    for (var i = 0; i < imgs.length; i++) {
      var img = imgs[i];
      var m = (img.getAttribute("src") || "").match(/screens\/(?:[a-zA-Z-]+\/)?([a-z]+)\.png/);
      if (!m) continue;
      var view = m[1];
      var root = "assets/screens/" + view + ".png?v=" + V;
      var want;
      if (LANGS[lang]) {
        // si l'image localisée manque/échoue -> repli anglais (racine), une seule fois
        (function (im, rt) {
          im.onerror = function () { im.onerror = null; if (im.getAttribute("src") !== rt) im.setAttribute("src", rt); };
        })(img, root);
        want = "assets/screens/" + lang + "/" + view + ".png?v=" + V;
      } else {
        img.onerror = null;
        want = root;
      }
      if (img.getAttribute("src") !== want) img.setAttribute("src", want);
    }
  }
  function hook() {
    if (window.PCI18n && window.PCI18n.apply && !window.PCI18n.__screensHooked) {
      var orig = window.PCI18n.apply;
      window.PCI18n.apply = function () {
        var r = orig.apply(this, arguments);
        try { swap(); } catch (e) {}
        return r;
      };
      window.PCI18n.__screensHooked = true;
    }
  }
  function tick() { hook(); swap(); }
  var n = 0, iv = setInterval(function () { tick(); if (++n > 25) clearInterval(iv); }, 250);
  if (document.readyState !== "loading") tick();
  else document.addEventListener("DOMContentLoaded", tick);
})();
