/* Screenshots par langue — swap les <img class="screen-photo"> (téléphone) ET les
   <img class="dev-mac"/"dev-ipad"> (showcase MacBook/iPad) vers
   assets/screens/<lang>/<nom>.png selon la langue courante, repli anglais (racine).
   IMPORTANT : le sélecteur appelle le `apply` INTERNE (via setLang, une closure),
   PAS window.PCI18n.apply — donc hooker apply ne marche pas au changement de langue.
   On DÉTECTE le changement par POLLING de PCI18n.current (fiable, quel que soit le
   déclencheur). CSP-safe (fichier externe). */
(function () {
  var LANGS = { fr:1, de:1, es:1, ja:1, ko:1, ar:1, ru:1, "zh-Hans":1, "en-US":1 }; // langues avec jeu localisé (en-US = captures °F, repli racine)
  var V = 8;   // version de cache des captures téléphone
  var DV = 3;  // version de cache des images device (macbook-device / ipad-device)

  function curLang() {
    if (window.PCI18n && window.PCI18n.current) return window.PCI18n.current;
    try { return localStorage.getItem("pc_lang") || "en"; } catch (e) { return "en"; }
  }

  // swap générique : list = NodeList d'<img>, re = regex capturant le <nom>, ver = version cache
  function swapList(list, re, ver, lang) {
    for (var i = 0; i < list.length; i++) {
      var img = list[i];
      var m = (img.getAttribute("src") || "").match(re);
      if (!m) continue;
      var name = m[1];
      var root = "/assets/screens/" + name + ".png?v=" + ver;
      var useLang = !!LANGS[lang] && img.getAttribute("data-scr-fb") !== "1";
      var want = useLang ? ("/assets/screens/" + lang + "/" + name + ".png?v=" + ver) : root;
      if (useLang) {
        (function (im, rt) {                       // repli anglais une fois si la loc échoue
          im.onerror = function () {
            im.onerror = null; im.setAttribute("data-scr-fb", "1");
            if (im.getAttribute("src") !== rt) im.setAttribute("src", rt);
          };
        })(img, root);
      } else { img.onerror = null; }
      if (img.getAttribute("src") !== want) img.setAttribute("src", want);
    }
  }

  function swap() {
    var lang = curLang();
    swapList(document.querySelectorAll("img.screen-photo"),
             /screens\/(?:[a-zA-Z-]+\/)?([a-z]+)\.png/, V, lang);
    swapList(document.querySelectorAll("img.dev-mac, img.dev-ipad"),
             /screens\/(?:[a-zA-Z-]+\/)?((?:macbook|ipad)-device)\.png/, DV, lang);
  }

  var lastLang = " ";
  function poll() {
    var lang = curLang();
    if (lang !== lastLang) {
      lastLang = lang;
      // reset les repli-flags pour re-tenter la nouvelle langue
      var fb = document.querySelectorAll('img[data-scr-fb]');
      for (var i = 0; i < fb.length; i++) fb[i].removeAttribute("data-scr-fb");
      swap();
    }
  }

  // 1) retries au chargement (les <img> React arrivent après le 1er tick)
  var n = 0, iv = setInterval(function () { swap(); if (++n > 20) clearInterval(iv); }, 250);
  // 2) détection persistante du changement de langue (léger : ne swap que si changement)
  setInterval(poll, 350);
  if (document.readyState !== "loading") swap();
  else document.addEventListener("DOMContentLoaded", swap);
})();
