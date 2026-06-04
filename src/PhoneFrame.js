// iPhone frame + scrollytelling component

function PhoneFrame({
  children
}) {
  return /*#__PURE__*/React.createElement("div", {
    className: "iphone"
  }, /*#__PURE__*/React.createElement("div", {
    className: "iphone-buttons-left"
  }), /*#__PURE__*/React.createElement("div", {
    className: "iphone-volume2"
  }), /*#__PURE__*/React.createElement("div", {
    className: "iphone-buttons-right"
  }), /*#__PURE__*/React.createElement("div", {
    className: "iphone-screen"
  }, /*#__PURE__*/React.createElement("div", {
    className: "iphone-notch"
  }), children));
}
function HeroPhone() {
  return /*#__PURE__*/React.createElement(PhoneFrame, null, /*#__PURE__*/React.createElement(ScreenMois, null));
}

// === SCROLLYTELLING — 4 piliers héros ===
const SCROLLY_STEPS = [{
  num: '01',
  eyebrow: 'Calendrier intelligent',
  title: 'Tous tes calendriers. Une seule app.',
  desc: 'Connecte iCloud, Google, Outlook, Exchange et CalDAV. PulseCalendar fusionne tout dans 6 vues fluides : Jour, 3 jours, Semaine, Mois, Année, Liste.',
  bullets: ['Création en langage naturel (« déjeuner avec Marc demain 13h »)', 'Détection auto des conflits', 'Jours fériés + congés scolaires · 8 pays (FR avec zones A/B/C, UK, US, ES, JP, DE, CA, AU)', 'Multi-pays : combine les fériés (ex. franco-allemand)'],
  Screen: 'mois'
}, {
  num: '02',
  eyebrow: 'Bridge Planner',
  title: 'Optimise tes congés. Maximise tes ponts.',
  desc: 'PulseCalendar repère les meilleurs ponts de l\'année par pays et te dit combien de jours poser pour transformer 1 férié en 4 jours off. Les vacances scolaires sont déjà chargées — combine-les avec les ponts familiaux en 1 tap.',
  bullets: ['Suggère les meilleurs ponts par pays', 'Calcul ROI : « pose 1 jour, gagne 4 jours off »', 'Vacances scolaires FR (zones A/B/C) + 7 pays auto', 'Multi-pays pour les familles franco-internationales'],
  Screen: 'bridge'
}, {
  num: '03',
  eyebrow: 'Pulse Brain · 100 % on-device',
  title: 'Un coach intelligent qui optimise ta journée. En local.',
  desc: 'En 1 tap, Pulse Brain résout les conflits, équilibre focus et récup, détecte les jours surchargés. Tout tourne sur ton iPhone, rien n\'est envoyé en ligne.',
  bullets: ['Optimisation 1 tap (focus + récup + transitions)', 'Briefing matinal personnalisé', 'Anticipation hebdomadaire', '100 % local, aucune donnée envoyée'],
  Screen: 'brain'
}, {
  num: '04',
  eyebrow: 'Pulse Score',
  title: 'Un score quotidien qui te tire vers le haut.',
  desc: 'Suivi des habitudes récurrentes, défis hebdomadaires, streaks et 12 semaines d\'évolution. Day Battery sur l\'écran de verrouillage : ton Pulse Score live en jauge.',
  bullets: ['Détection auto des habitudes (médecin, sport…)', 'Défis hebdomadaires avec XP', 'Streaks + 12 semaines d\'évolution', 'Widget Day Battery sur lock screen'],
  Screen: 'score'
}];

// === GALERIE App Store — 5 features secondaires ===
const GALLERY_FEATURES = [{
  eyebrow: 'Trajet auto',
  title: 'Calcule ton trajet.',
  desc: 'Voiture, transports, marche comparés. Notif « Pars maintenant » au bon moment. Trafic Sytadin / Bison Futé temps réel.',
  Screen: 'trajet'
}, {
  eyebrow: 'Resto intégré',
  title: 'Réserve sans quitter l\'app.',
  desc: 'Recherche resto, appel direct en 1 tap depuis la fiche événement. L\'adresse alimente automatiquement le trajet.',
  Screen: 'resto'
}, {
  eyebrow: 'Doodle intégré',
  title: 'Trouve un créneau. À plusieurs.',
  desc: 'Long-press sur le « + » : sondage Doodle ou partage de dispos par lien. Confirmation auto crée l\'événement à tous.',
  Screen: 'doodle'
}, {
  eyebrow: 'Priorités du jour',
  title: '3 priorités. Zéro procrastination.',
  desc: 'Eat the Frog, Mode « Juste 5 minutes », auto time-blocking. Friction Mode + Recovery Mode pour les jours difficiles.',
  Screen: 'focus'
}, {
  eyebrow: 'Analyses',
  title: 'Comprends ton temps.',
  desc: 'Donut par catégorie, heatmap semaine type, top des personnes. Behavior insights : « tes vendredis sont surchargés ».',
  Screen: 'analyse'
}];
function Scrollytelling() {
  const [activeIdx, setActiveIdx] = React.useState(0);
  const stepRefs = React.useRef([]);
  React.useEffect(() => {
    const obs = new IntersectionObserver(entries => {
      // pick the entry with highest intersectionRatio that is intersecting
      let best = null;
      entries.forEach(e => {
        if (e.isIntersecting && (!best || e.intersectionRatio > best.intersectionRatio)) {
          best = e;
        }
      });
      if (best) {
        const idx = parseInt(best.target.dataset.idx, 10);
        setActiveIdx(idx);
      }
    }, {
      threshold: [0.3, 0.5, 0.7],
      rootMargin: '-30% 0px -30% 0px'
    });
    stepRefs.current.forEach(el => el && obs.observe(el));
    return () => obs.disconnect();
  }, []);
  const ScreenComp = {
    mois: ScreenMois,
    focus: ScreenFocus,
    brain: ScreenBrain,
    analyse: ScreenAnalyse,
    score: ScreenScore,
    bridge: ScreenBridge,
    trajet: ScreenTrajet,
    resto: ScreenResto,
    doodle: ScreenDoodle
  }[SCROLLY_STEPS[activeIdx].Screen];
  return /*#__PURE__*/React.createElement("div", {
    className: "scrolly-wrap"
  }, /*#__PURE__*/React.createElement("div", {
    className: "scrolly-grid"
  }, /*#__PURE__*/React.createElement("div", {
    className: "scrolly-text-col"
  }, SCROLLY_STEPS.map((step, i) => /*#__PURE__*/React.createElement("div", {
    key: i,
    ref: el => stepRefs.current[i] = el,
    "data-idx": i,
    className: "scrolly-step",
    style: {
      opacity: activeIdx === i ? 1 : 0.35,
      transition: 'opacity 0.6s'
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "step-num"
  }, step.num, " \xB7 ", step.eyebrow), /*#__PURE__*/React.createElement("h3", null, step.title), /*#__PURE__*/React.createElement("p", null, step.desc), /*#__PURE__*/React.createElement("ul", null, step.bullets.map((b, j) => /*#__PURE__*/React.createElement("li", {
    key: j
  }, b)))))), /*#__PURE__*/React.createElement("div", {
    className: "scrolly-phone-col"
  }, /*#__PURE__*/React.createElement("div", {
    className: "scrolly-phone-stage"
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      inset: '-15%',
      background: 'radial-gradient(50% 50% at 50% 50%, rgba(123,92,240,0.35), transparent 70%)',
      filter: 'blur(40px)',
      pointerEvents: 'none'
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'relative',
      zIndex: 1
    }
  }, /*#__PURE__*/React.createElement(PhoneFrame, null, SCROLLY_STEPS.map((step, i) => {
    const Comp = {
      mois: ScreenMois,
      focus: ScreenFocus,
      brain: ScreenBrain,
      analyse: ScreenAnalyse,
      score: ScreenScore,
      bridge: ScreenBridge,
      trajet: ScreenTrajet,
      resto: ScreenResto,
      doodle: ScreenDoodle
    }[step.Screen];
    const isActive = i === activeIdx;
    return /*#__PURE__*/React.createElement("div", {
      key: i,
      style: {
        position: 'absolute',
        inset: 0,
        opacity: isActive ? 1 : 0,
        transition: 'opacity 0.5s ease',
        pointerEvents: isActive ? 'auto' : 'none'
      }
    }, /*#__PURE__*/React.createElement(Comp, null));
  })))))));
}

// === GALERIE App Store Style ===
function FeatureGallery() {
  const ScreenMap = {
    trajet: ScreenTrajet,
    resto: ScreenResto,
    doodle: ScreenDoodle,
    focus: ScreenFocus,
    analyse: ScreenAnalyse
  };
  return /*#__PURE__*/React.createElement("div", {
    className: "gallery-wrap"
  }, /*#__PURE__*/React.createElement("div", {
    className: "gallery-track"
  }, GALLERY_FEATURES.map((feat, i) => {
    const ScreenComp = ScreenMap[feat.Screen];
    return /*#__PURE__*/React.createElement("div", {
      className: "gallery-card",
      key: i
    }, /*#__PURE__*/React.createElement("div", {
      className: "gallery-phone-wrap"
    }, /*#__PURE__*/React.createElement(PhoneFrame, null, /*#__PURE__*/React.createElement(ScreenComp, null))), /*#__PURE__*/React.createElement("div", {
      className: "gallery-meta"
    }, /*#__PURE__*/React.createElement("div", {
      className: "gallery-eyebrow"
    }, feat.eyebrow), /*#__PURE__*/React.createElement("h4", null, feat.title), /*#__PURE__*/React.createElement("p", null, feat.desc)));
  })));
}
window.PhoneFrame = PhoneFrame;
window.HeroPhone = HeroPhone;
window.Scrollytelling = Scrollytelling;
window.FeatureGallery = FeatureGallery;