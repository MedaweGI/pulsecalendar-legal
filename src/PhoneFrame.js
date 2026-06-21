function PhoneFrame({ children }) {
  return /* @__PURE__ */ React.createElement("div", { className: "iphone" }, /* @__PURE__ */ React.createElement("div", { className: "iphone-buttons-left" }), /* @__PURE__ */ React.createElement("div", { className: "iphone-volume2" }), /* @__PURE__ */ React.createElement("div", { className: "iphone-buttons-right" }), /* @__PURE__ */ React.createElement("div", { className: "iphone-screen" }, /* @__PURE__ */ React.createElement("div", { className: "iphone-notch" }), children));
}
function HeroPhone() {
  return /* @__PURE__ */ React.createElement(PhoneFrame, null, /* @__PURE__ */ React.createElement("img", { className: "screen-photo", src: "assets/screens/month.png?v=3", alt: "PulseCalendar \u2014 vue Mois en Liquid Glass" }));
}
const SCROLLY_STEPS = [
  {
    num: "01",
    eyebrow: "Calendrier \xB7 iOS 26",
    title: "Tous tes calendriers, repens\xE9s en Liquid Glass.",
    desc: "Connecte iCloud, Google, Outlook, Exchange et CalDAV. PulseCalendar fusionne tout dans 6 vues fluides \u2014 Jour, 3 jours, Semaine, Mois, Ann\xE9e, Liste \u2014 habill\xE9es du nouveau design Liquid Glass d'iOS 26.",
    bullets: [
      "Cr\xE9ation en langage naturel (\xAB d\xE9jeuner avec Marc demain 13h \xBB)",
      "D\xE9tection auto des conflits",
      "Jours f\xE9ri\xE9s + cong\xE9s scolaires \xB7 8 pays",
      "Ne d\xE9place jamais tes matchs en direct ni ce que tu regardes \xE0 la t\xE9l\xE9"
    ],
    img: "assets/screens/month.png?v=3"
  },
  {
    num: "02",
    eyebrow: "Ask Pulse \xB7 100 % sur ton iPhone",
    title: "Parle \xE0 ton agenda. Il te r\xE9pond.",
    desc: "Pose une question \xE0 ton planning en langage naturel \u2014 \xAB trouve-moi 2 h cette semaine \xBB, \xAB quand suis-je libre avec L\xE9a ? \xBB. Tout est calcul\xE9 sur ton iPhone, rien n'est envoy\xE9 en ligne.",
    bullets: [
      "Questions en langage naturel",
      "R\xE9ponses instantan\xE9es, cr\xE9neaux concrets",
      "100 % local, aucune donn\xE9e envoy\xE9e",
      "Nouveau dans la 2.0"
    ],
    img: "assets/screens/askpulse.png?v=3"
  },
  {
    num: "03",
    eyebrow: "Ton Rythme \xB7 Sant\xE9",
    title: "Vois l'intensit\xE9 de tes journ\xE9es.",
    desc: "\xC0 partir de tes donn\xE9es Sant\xE9 (HealthKit), Pulse met ton rythme en regard de ton agenda : journ\xE9es intenses, variations d'\xE9nergie, r\xE9cup\xE9ration. Une lecture, jamais un diagnostic.",
    bullets: [
      "Intensit\xE9 de chaque journ\xE9e",
      "Rythme mis en regard de l'agenda",
      "Observationnel \u2014 jamais m\xE9dical",
      "Donn\xE9es Sant\xE9, sur l'appareil"
    ],
    img: "assets/screens/rhythm.png?v=3"
  },
  {
    num: "04",
    eyebrow: "Pulse Score",
    title: "Un score quotidien qui te tire vers le haut.",
    desc: "Au c\u0153ur de Pulse : un score quotidien pour battre la procrastination. Suivi des habitudes, d\xE9fis hebdomadaires, streaks et 12 semaines d'\xE9volution. Day Battery sur l'\xE9cran de verrouillage.",
    bullets: [
      "D\xE9tection auto des habitudes",
      "D\xE9fis hebdomadaires avec XP",
      "Streaks + 12 semaines d'\xE9volution",
      "Widget Day Battery sur lock screen"
    ],
    img: "assets/screens/suivi.png?v=3"
  }
];
const GALLERY_FEATURES = [
  {
    eyebrow: "Bridge Planner",
    title: "Optimise tes cong\xE9s.",
    desc: "Rep\xE8re les meilleurs ponts par pays et te dit combien poser : \xAB 1 jour pos\xE9 = 4 jours off \xBB. Les vacances scolaires sont d\xE9j\xE0 charg\xE9es.",
    img: "assets/screens/bridge.png?v=3"
  },
  {
    eyebrow: "Pulse Brain \xB7 on-device",
    title: "Optimise ta journ\xE9e en 1 tap.",
    desc: "R\xE9sout les conflits, \xE9quilibre focus et r\xE9cup, d\xE9tecte les jours surcharg\xE9s. Briefing matinal personnalis\xE9. 100 % local.",
    img: "assets/screens/brain.png?v=3"
  },
  {
    eyebrow: "Trajet auto",
    title: "Calcule ton trajet.",
    desc: "Voiture, transports, marche compar\xE9s. Notif \xAB Pars maintenant \xBB au bon moment, avec le trafic en temps r\xE9el.",
    img: "assets/screens/trajet.png?v=3"
  },
  {
    eyebrow: "Resto int\xE9gr\xE9",
    title: "R\xE9serve sans quitter l'app.",
    desc: "Recherche resto + appel direct en 1 tap depuis la fiche \xE9v\xE9nement. L'adresse alimente automatiquement le trajet.",
    img: "assets/screens/resto.png?v=3"
  },
  {
    eyebrow: "Doodle int\xE9gr\xE9",
    title: "Trouve un cr\xE9neau. \xC0 plusieurs.",
    desc: "Appui long sur le \xAB + \xBB : sondage de dispos par lien. La confirmation cr\xE9e l'\xE9v\xE9nement pour tout le monde.",
    img: "assets/screens/doodle.png?v=3"
  },
  {
    eyebrow: "Analyses",
    title: "Comprends ton temps.",
    desc: "Donut par cat\xE9gorie, heatmap de ta semaine type, top des personnes. \xAB Tes vendredis sont surcharg\xE9s \xBB.",
    img: "assets/screens/analyse.png?v=3"
  },
  {
    eyebrow: "Actions rapides",
    title: "Ajoute, demande, planifie.",
    desc: "Appui long sur le \xAB + \xBB : ajout express, Ask Pulse, Doodle, partage de dispos. Tout part du m\xEAme bouton.",
    img: "assets/screens/quickactions.png?v=3"
  }
];
function Scrollytelling() {
  const [activeIdx, setActiveIdx] = React.useState(0);
  const stepRefs = React.useRef([]);
  React.useEffect(() => {
    const obs = new IntersectionObserver((entries) => {
      let best = null;
      entries.forEach((e) => {
        if (e.isIntersecting && (!best || e.intersectionRatio > best.intersectionRatio)) best = e;
      });
      if (best) setActiveIdx(parseInt(best.target.dataset.idx, 10));
    }, { threshold: [0.3, 0.5, 0.7], rootMargin: "-30% 0px -30% 0px" });
    stepRefs.current.forEach((el) => el && obs.observe(el));
    return () => obs.disconnect();
  }, []);
  return /* @__PURE__ */ React.createElement("div", { className: "scrolly-wrap" }, /* @__PURE__ */ React.createElement("div", { className: "scrolly-grid" }, /* @__PURE__ */ React.createElement("div", { className: "scrolly-text-col" }, SCROLLY_STEPS.map((step, i) => /* @__PURE__ */ React.createElement(
    "div",
    {
      key: i,
      ref: (el) => stepRefs.current[i] = el,
      "data-idx": i,
      className: "scrolly-step",
      style: { opacity: activeIdx === i ? 1 : 0.35, transition: "opacity 0.6s" }
    },
    /* @__PURE__ */ React.createElement("div", { className: "step-num" }, step.num, " \xB7 ", step.eyebrow),
    /* @__PURE__ */ React.createElement("h3", null, step.title),
    /* @__PURE__ */ React.createElement("p", null, step.desc),
    /* @__PURE__ */ React.createElement("ul", null, step.bullets.map((b, j) => /* @__PURE__ */ React.createElement("li", { key: j }, b)))
  ))), /* @__PURE__ */ React.createElement("div", { className: "scrolly-phone-col" }, /* @__PURE__ */ React.createElement("div", { className: "scrolly-phone-stage" }, /* @__PURE__ */ React.createElement("div", { style: {
    position: "absolute",
    inset: "-15%",
    background: "radial-gradient(50% 50% at 50% 50%, rgba(123,92,240,0.35), transparent 70%)",
    filter: "blur(40px)",
    pointerEvents: "none"
  } }), /* @__PURE__ */ React.createElement("div", { style: { position: "relative", zIndex: 1 } }, /* @__PURE__ */ React.createElement(PhoneFrame, null, SCROLLY_STEPS.map((step, i) => /* @__PURE__ */ React.createElement(
    "div",
    {
      key: i,
      style: {
        position: "absolute",
        inset: 0,
        opacity: i === activeIdx ? 1 : 0,
        transition: "opacity 0.5s ease",
        pointerEvents: i === activeIdx ? "auto" : "none"
      }
    },
    /* @__PURE__ */ React.createElement("img", { className: "screen-photo", src: step.img, alt: step.eyebrow, loading: "lazy" })
  ))))))));
}
function FeatureGallery() {
  return /* @__PURE__ */ React.createElement("div", { className: "gallery-wrap" }, /* @__PURE__ */ React.createElement("div", { className: "gallery-track" }, GALLERY_FEATURES.map((feat, i) => /* @__PURE__ */ React.createElement("div", { className: "gallery-card", key: i }, /* @__PURE__ */ React.createElement("div", { className: "gallery-phone-wrap" }, /* @__PURE__ */ React.createElement(PhoneFrame, null, /* @__PURE__ */ React.createElement("img", { className: "screen-photo", src: feat.img, alt: feat.eyebrow, loading: "lazy" }))), /* @__PURE__ */ React.createElement("div", { className: "gallery-meta" }, /* @__PURE__ */ React.createElement("div", { className: "gallery-eyebrow" }, feat.eyebrow), /* @__PURE__ */ React.createElement("h4", null, feat.title), /* @__PURE__ */ React.createElement("p", null, feat.desc))))));
}
window.PhoneFrame = PhoneFrame;
window.HeroPhone = HeroPhone;
window.Scrollytelling = Scrollytelling;
window.FeatureGallery = FeatureGallery;
