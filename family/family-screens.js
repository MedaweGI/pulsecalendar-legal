/* Galerie de captures Pulse Family, localisée par sélecteur de drapeaux.
   Externe (CSP : script-src 'self'). Swap les <img data-scr> + le showcase Mac
   vers family/screens/<lang>/<nom>.webp. Défaut = langue du navigateur, repli fr-FR. */
(function () {
  var LANGS = [
    ["fr-FR","🇫🇷","Français"], ["en-US","🇺🇸","English"],
    ["de-DE","🇩🇪","Deutsch"], ["es-ES","🇪🇸","Español"],
    ["it","🇮🇹","Italiano"], ["pt-PT","🇵🇹","Português"],
    ["pt-BR","🇧🇷","Brasil"], ["el","🇬🇷","Ελληνικά"],
    ["ja","🇯🇵","日本語"], ["ko","🇰🇷","한국어"],
    ["zh-Hans","🇨🇳","简体中文"], ["ru","🇷🇺","Русский"],
    ["tr","🇹🇷","Türkçe"], ["vi","🇻🇳","Tiếng Việt"],
    ["ar-SA","🇸🇦","العربية"]
  ];
  var SCREENS = ["today","balance","agenda","budget","coloc","tasks"];
  var ALT = { today:"Accueil du foyer", balance:"L'Équilibre de la charge", agenda:"Agenda partagé",
              budget:"Budget du foyer", coloc:"Mode colocation, dépenses partagées", tasks:"Tâches partagées" };
  var langsEl = document.getElementById("pf-langs");
  var shotsEl = document.getElementById("pf-shots");
  var macEl   = document.getElementById("pf-mac");
  if (!langsEl || !shotsEl) return;

  SCREENS.forEach(function (s) {
    var d = document.createElement("div"); d.className = "pf-shot";
    var im = document.createElement("img");
    im.setAttribute("data-scr", s); im.loading = "lazy"; im.decoding = "async";
    im.alt = ALT[s] || s; im.width = 560; im.height = 1215;
    d.appendChild(im); shotsEl.appendChild(d);
  });

  function setLang(code) {
    shotsEl.querySelectorAll("img[data-scr]").forEach(function (im) {
      im.src = "screens/" + code + "/" + im.getAttribute("data-scr") + ".webp";
    });
    if (macEl) macEl.src = "screens/" + code + "/mac.webp";
    langsEl.querySelectorAll(".pf-flag").forEach(function (b) {
      b.setAttribute("aria-selected", b.getAttribute("data-l") === code ? "true" : "false");
    });
  }

  LANGS.forEach(function (L) {
    var b = document.createElement("button");
    b.className = "pf-flag"; b.type = "button";
    b.setAttribute("data-l", L[0]); b.setAttribute("role", "tab");
    b.setAttribute("aria-label", L[2]);
    b.innerHTML = '<span class="fl" aria-hidden="true">' + L[1] + '</span>' + L[2];
    b.addEventListener("click", function () { setLang(L[0]); });
    langsEl.appendChild(b);
  });

  var nav = (navigator.language || "fr").toLowerCase(), def = "fr-FR";
  for (var i = 0; i < LANGS.length; i++) {
    var c = LANGS[i][0].toLowerCase();
    if (nav === c || nav.split("-")[0] === c.split("-")[0]) { def = LANGS[i][0]; break; }
  }
  setLang(def);
})();
