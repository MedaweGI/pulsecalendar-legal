/* Aperçu Pulse Family : mockups iPhone + MacBook + Apple Watch, localisés par sélecteur de drapeaux.
   Externe (CSP : script-src 'self'). Swap les 3 <img> vers family/screens/<lang>/<device>.webp.
   Défaut = langue du navigateur, repli fr-FR. */
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
  var DEVICES = { "dev-mac":"macbook-device", "dev-phone":"iphone-device", "dev-watch":"watch-device" };
  var langsEl = document.getElementById("pf-langs");
  if (!langsEl || !document.getElementById("dev-mac")) return;

  function setLang(code) {
    for (var id in DEVICES) {
      var im = document.getElementById(id);
      if (im) im.src = "screens/" + code + "/" + DEVICES[id] + ".webp";
    }
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
