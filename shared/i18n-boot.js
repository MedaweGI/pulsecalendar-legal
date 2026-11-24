/* Lance AU PLUS TÔT le téléchargement du dictionnaire de la langue du visiteur
   (shared/i18n/<langue>.js), en parallèle de la page. Le français est dans le HTML :
   rien à télécharger. (24/11/2026 : avant, les 34 langues, 1,2 Mo, pour tout le monde.)
   Même détection que detect() dans i18n.js ; DICT_V = même version que là-bas. */
(function () {
  var DICT_V = "1";
  var LANGS = ["fr","en","en-US","es","de","ja","ko","ar","ru","zh-Hans","it","pt-BR","pt-PT","tr","el","vi","nl","pl","sv","da","nb","fi","cs","sk","hu","ro","hr","uk","ca","he","hi","th","id","ms","zh-Hant"];
  function has(l) { return LANGS.indexOf(l) >= 0; }
  function detect() {
    try {
      var s = localStorage.getItem("pc_lang");
      if (s === "zh") s = "zh-Hans";
      if (s && has(s)) return s;
    } catch (e) {}
    try {
      var q = new URLSearchParams(location.search).get("lang");
      if (q && has(q)) return q;
    } catch (e) {}
    var navs = navigator.languages || [navigator.language || "fr"];
    for (var i = 0; i < navs.length; i++) {
      var full = String(navs[i] || "").toLowerCase(), base = full.split("-")[0];
      if (full === "en-us") return "en-US";
      if (base === "zh") return (/^zh-(hant|tw|hk|mo)/.test(full)) ? "zh-Hant" : "zh-Hans";
      if (base === "pt") return (full === "pt-pt") ? "pt-PT" : "pt-BR";
      if (base === "no" || base === "nn") return "nb";
      if (has(base)) return base;
    }
    return "fr";
  }
  var lang = detect();
  window.PC_I18N_WANTED = lang;
  var base = "shared/i18n/";
  try { var cs = document.currentScript && document.currentScript.src; if (cs) base = cs.replace(/i18n-boot\.js(\?.*)?$/, "i18n/"); } catch (e) {}
  var need = lang === "fr" ? [] : (lang === "en-US" ? ["en", "en-US"] : [lang]);
  for (var j = 0; j < need.length; j++) {
    var el = document.createElement("script");
    el.id = "pc-i18n-" + need[j];
    el.src = base + need[j] + ".js?v=" + DICT_V;
    el.async = true;
    document.head.appendChild(el);
  }
  // Police des drapeaux : seulement sous Windows (Apple et Android ont leurs drapeaux).
  try {
    var p = (navigator.userAgentData && navigator.userAgentData.platform) || navigator.platform || "";
    if (/win/i.test(p)) document.documentElement.classList.add("pc-win");
  } catch (e) {}
})();
