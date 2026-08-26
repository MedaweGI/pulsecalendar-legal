/* Menu mobile (burger) : ouvre/ferme la liste de liens du nav. Externe (CSP : script-src 'self'). */
(function () {
  var nav = document.querySelector(".nav");
  var burger = document.getElementById("nav-burger");
  var links = document.getElementById("nav-links");
  if (!nav || !burger || !links) return;
  function setOpen(o) {
    nav.classList.toggle("open", o);
    burger.setAttribute("aria-expanded", o ? "true" : "false");
  }
  burger.addEventListener("click", function (e) {
    e.stopPropagation();
    setOpen(!nav.classList.contains("open"));
  });
  links.addEventListener("click", function (e) {
    if (e.target.closest("a")) setOpen(false);
  });
  document.addEventListener("click", function (e) {
    if (nav.classList.contains("open") && !nav.contains(e.target)) setOpen(false);
  });
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") setOpen(false);
  });
})();
