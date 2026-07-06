// iPhone frame + scrollytelling + galerie — vraies captures (thème laiton)

function PhoneFrame({ children }) {
  return (
    <div className="iphone">
      <div className="iphone-buttons-left"></div>
      <div className="iphone-volume2"></div>
      <div className="iphone-buttons-right"></div>
      <div className="iphone-screen">
        <div className="iphone-notch"></div>
        {children}
      </div>
    </div>
  );
}

function HeroPhone() {
  return (
    <PhoneFrame>
      <img className="screen-photo" src="assets/screens/month.png?v=7" alt="PulseCalendar — vue Mois en Liquid Glass" />
    </PhoneFrame>
  );
}

// === SCROLLYTELLING — 4 piliers 2.0 ===
const SCROLLY_STEPS = [
  {
    num: '01',
    eyebrow: 'Calendrier · iOS 26',
    title: 'Tous tes calendriers, repensés en Liquid Glass.',
    desc: 'Connecte iCloud, Google, Outlook, Exchange et CalDAV. PulseCalendar fusionne tout dans 6 vues fluides — Jour, 3 jours, Semaine, Mois, Année, Liste — habillées du nouveau design Liquid Glass d\'iOS 26.',
    bullets: [
      'Création en langage naturel (« déjeuner avec Marc demain 13h »)',
      'Détection auto des conflits',
      'Jours fériés + congés scolaires · 8 pays',
      'Ne déplace jamais tes matchs en direct ni ce que tu regardes à la télé',
    ],
    img: 'assets/screens/month.png?v=7',
  },
  {
    num: '02',
    eyebrow: 'Ask Pulse · 100 % sur ton iPhone',
    title: 'Parle à ton agenda. Il te répond.',
    desc: 'Pose une question à ton planning en langage naturel — « trouve-moi 2 h cette semaine », « quand suis-je libre avec Léa ? ». Tout est calculé sur ton iPhone, rien n\'est envoyé en ligne.',
    bullets: [
      'Questions en langage naturel',
      'Réponses instantanées, créneaux concrets',
      '100 % local, aucune donnée envoyée',
      'Nouveau dans la 2.0',
    ],
    img: 'assets/screens/askpulse.png?v=7',
  },
  {
    num: '03',
    eyebrow: 'Ton Rythme · Santé',
    title: 'Vois l\'intensité de tes journées.',
    desc: 'À partir de tes données Santé (HealthKit), Pulse met ton rythme en regard de ton agenda : journées intenses, variations d\'énergie, récupération. Une lecture, jamais un diagnostic.',
    bullets: [
      'Intensité de chaque journée',
      'Rythme mis en regard de l\'agenda',
      'Observationnel — jamais médical',
      'Données Santé, sur l\'appareil',
    ],
    img: 'assets/screens/rhythm.png?v=7',
  },
  {
    num: '04',
    eyebrow: 'Pulse Score',
    title: 'Un score quotidien qui te tire vers le haut.',
    desc: 'Au cœur de Pulse : un score quotidien pour battre la procrastination. Suivi des habitudes, défis hebdomadaires, streaks et 12 semaines d\'évolution. Day Battery sur l\'écran de verrouillage.',
    bullets: [
      'Détection auto des habitudes',
      'Défis hebdomadaires avec XP',
      'Streaks + 12 semaines d\'évolution',
      'Widget Day Battery sur lock screen',
    ],
    img: 'assets/screens/suivi.png?v=7',
  },
];

// === GALERIE — features secondaires (vraies captures laiton) ===
const GALLERY_FEATURES = [
  {
    eyebrow: 'Bridge Planner',
    title: 'Optimise tes congés.',
    desc: 'Repère les meilleurs ponts par pays et te dit combien poser : « 1 jour posé = 4 jours off ». Les vacances scolaires sont déjà chargées.',
    img: 'assets/screens/bridge.png?v=7',
  },
  {
    eyebrow: 'Pulse Brain · on-device',
    title: 'Optimise ta journée en 1 tap.',
    desc: 'Résout les conflits, équilibre focus et récup, détecte les jours surchargés. Briefing matinal personnalisé. 100 % local.',
    img: 'assets/screens/brain.png?v=7',
  },
  {
    eyebrow: 'Trajet auto',
    title: 'Calcule ton trajet.',
    desc: 'Voiture, transports, marche comparés. Notif « Pars maintenant » au bon moment, avec le trafic en temps réel.',
    img: 'assets/screens/trajet.png?v=7',
  },
  {
    eyebrow: 'Resto intégré',
    title: 'Réserve sans quitter l\'app.',
    desc: 'Recherche resto + appel direct en 1 tap depuis la fiche événement. L\'adresse alimente automatiquement le trajet.',
    img: 'assets/screens/resto.png?v=7',
  },
  {
    eyebrow: 'Doodle intégré',
    title: 'Trouve un créneau. À plusieurs.',
    desc: 'Appui long sur le « + » : sondage de dispos par lien. La confirmation crée l\'événement pour tout le monde.',
    img: 'assets/screens/doodle.png?v=7',
  },
  {
    eyebrow: 'Analyses',
    title: 'Comprends ton temps.',
    desc: 'Donut par catégorie, heatmap de ta semaine type, top des personnes. « Tes vendredis sont surchargés ».',
    img: 'assets/screens/analyse.png?v=7',
  },
  {
    eyebrow: 'Actions rapides',
    title: 'Ajoute, demande, planifie.',
    desc: 'Appui long sur le « + » : ajout express, Ask Pulse, Doodle, partage de dispos. Tout part du même bouton.',
    img: 'assets/screens/quickactions.png?v=7',
  },
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
    }, { threshold: [0.3, 0.5, 0.7], rootMargin: '-30% 0px -30% 0px' });
    stepRefs.current.forEach((el) => el && obs.observe(el));
    return () => obs.disconnect();
  }, []);

  return (
    <div className="scrolly-wrap">
      <div className="scrolly-grid">
        <div className="scrolly-text-col">
          {SCROLLY_STEPS.map((step, i) => (
            <div
              key={i}
              ref={(el) => stepRefs.current[i] = el}
              data-idx={i}
              className="scrolly-step"
              style={{ opacity: activeIdx === i ? 1 : 0.35, transition: 'opacity 0.6s' }}
            >
              <div className="step-num">{step.num} · {step.eyebrow}</div>
              <h3>{step.title}</h3>
              <p>{step.desc}</p>
              <ul>{step.bullets.map((b, j) => <li key={j}>{b}</li>)}</ul>
            </div>
          ))}
        </div>
        <div className="scrolly-phone-col">
          <div className="scrolly-phone-stage">
            <div style={{
              position: 'absolute', inset: '-15%',
              background: 'radial-gradient(50% 50% at 50% 50%, rgba(123,92,240,0.35), transparent 70%)',
              filter: 'blur(40px)', pointerEvents: 'none',
            }}/>
            <div style={{ position: 'relative', zIndex: 1 }}>
              <PhoneFrame>
                {SCROLLY_STEPS.map((step, i) => (
                  <div
                    key={i}
                    style={{
                      position: 'absolute', inset: 0,
                      opacity: i === activeIdx ? 1 : 0,
                      transition: 'opacity 0.5s ease',
                      pointerEvents: i === activeIdx ? 'auto' : 'none',
                    }}
                  >
                    <img className="screen-photo" src={step.img} alt={step.eyebrow} loading="lazy" />
                  </div>
                ))}
              </PhoneFrame>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function FeatureGallery() {
  return (
    <div className="gallery-wrap">
      <div className="gallery-track">
        {GALLERY_FEATURES.map((feat, i) => (
          <div className="gallery-card" key={i}>
            <div className="gallery-phone-wrap">
              <PhoneFrame>
                <img className="screen-photo" src={feat.img} alt={feat.eyebrow} loading="lazy" />
              </PhoneFrame>
            </div>
            <div className="gallery-meta">
              <div className="gallery-eyebrow">{feat.eyebrow}</div>
              <h4>{feat.title}</h4>
              <p>{feat.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

window.PhoneFrame = PhoneFrame;
window.HeroPhone = HeroPhone;
window.Scrollytelling = Scrollytelling;
window.FeatureGallery = FeatureGallery;
