// 5 different iPhone app screens for PulseCalendar

const CAT_COLORS = {
  Sport: '#22C55E',
  Travail: '#7B5CF0',
  Personnel: '#F5C518',
  Sant: '#E85D9F',
  Social: '#4DA8FF',
  Famille: '#ff8c66',
  Anniv: '#c4b3fb',
};

// === SCREEN 1: MOIS (calendar grid view) ===
function ScreenMois() {
  const days = [];
  // April 2026 — 1st = Wednesday (idx 2 if Sun=0). We'll start the grid from Sunday March 29.
  const startOffset = -2; // 30, 31 grayed
  for (let i = 0; i < 35; i++) {
    const d = i + 1 + startOffset; // -1=30, 0=31, 1..30=April
    days.push(d);
  }
  const dotColors = ['#22C55E', '#7B5CF0', '#F5C518', '#E85D9F', '#4DA8FF'];
  const dotsForDay = (d) => {
    if (d <= 0 || d > 30) return [];
    const seed = (d * 31) % 17;
    const count = (seed % 4) + 1;
    return Array.from({ length: count }, (_, i) => dotColors[(seed + i) % 5]);
  };

  return (
    <div className="screen-ui">
      <div className="ui-statusbar"><span>23:18</span><span>•••• 5G</span></div>
      <div className="ui-header">
        <span style={{ color: '#7B5CF0', fontSize: 11, fontWeight: 600 }}>Auj.</span>
        <span className="h-title">Avril <em>2026</em></span>
        <span className="h-aux">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
        </span>
      </div>
      <div className="ui-tabs">
        <span>Jour</span>
        <span>Sem.</span>
        <span className="active">Mois</span>
        <span>Liste</span>
      </div>
      {/* weekday header */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', padding: '4px 6px', fontSize: 9, color: '#7d7798', fontWeight: 600, letterSpacing: '0.05em' }}>
        {['L','M','M','J','V','S','D'].map((d,i) => <div key={i} style={{ textAlign: 'center' }}>{d}</div>)}
      </div>
      {/* calendar grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 2, padding: '0 6px', flexShrink: 0 }}>
        {days.map((d, i) => {
          const isOther = d <= 0 || d > 30;
          const realD = isOther ? (d <= 0 ? 30 + d : d - 30) : d;
          const isToday = d === 24;
          const dots = dotsForDay(d);
          return (
            <div key={i} style={{ aspectRatio: '0.9', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-start', paddingTop: 4, position: 'relative' }}>
              <div style={{
                width: 22, height: 22, borderRadius: '50%',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 11, fontWeight: 600,
                color: isToday ? 'white' : (isOther ? '#3d3858' : 'white'),
                background: isToday ? '#7B5CF0' : 'transparent',
                boxShadow: isToday ? '0 4px 12px rgba(123,92,240,0.5)' : 'none',
              }}>{realD}</div>
              <div style={{ display: 'flex', gap: 1.5, marginTop: 2, height: 4 }}>
                {dots.slice(0, 4).map((c, j) => <div key={j} style={{ width: 3, height: 3, borderRadius: '50%', background: c }}/>)}
              </div>
            </div>
          );
        })}
      </div>
      {/* event list under grid */}
      <div style={{ marginTop: 10, padding: '10px 12px', borderTop: '1px solid rgba(255,255,255,0.08)', flex: 1, overflow: 'hidden' }}>
        <div style={{ fontSize: 10, color: '#7d7798', marginBottom: 8, fontWeight: 500 }}>Vendredi 24 Avril 2026 · 12 événements</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          {[
            { time: 'Toute la journée', title: 'Jour férié', cat: '#ff8c66' },
            { time: '07:00 – 08:00', title: 'Séance muscu', sub: 'Salle Basic Fit', cat: '#22C55E' },
            { time: '08:15 – 08:25', title: 'Accompagner Léo à l\'école', cat: '#ff8c66' },
            { time: '09:00 – 14:00', title: 'Aide déménagement sœur', cat: '#E85D9F' },
          ].map((e, i) => (
            <div key={i} style={{ display: 'flex', gap: 8, alignItems: 'flex-start', paddingLeft: 8, borderLeft: `2px solid ${e.cat}` }}>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 11, fontWeight: 600, color: 'white', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{e.title}</div>
                <div style={{ fontSize: 9, color: '#7d7798' }}>{e.time}{e.sub ? ' · ' + e.sub : ''}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <ScreenTabBar active="agenda"/>
      <div className="ui-fab">+</div>
    </div>
  );
}

// === SCREEN 2: PRIORITÉS / FOCUS ===
function ScreenFocus() {
  return (
    <div className="screen-ui">
      <div className="ui-statusbar"><span>09:42</span><span>•••• 5G</span></div>
      <div style={{ padding: '8px 6px' }}>
        <div style={{ fontSize: 10, color: '#7d7798', letterSpacing: '0.1em', textTransform: 'uppercase' }}>Aujourd'hui · Vendredi 24 Avril</div>
        <div style={{ fontSize: 22, fontWeight: 800, marginTop: 6, letterSpacing: '-0.02em' }}>Tes 3 priorités</div>
      </div>
      <div style={{ padding: '8px 6px', display: 'flex', flexDirection: 'column', gap: 10 }}>
        {[
          { num: 1, title: 'Finir présentation client', sub: 'Reportée 3× — Eat the Frog', time: '90 min', frog: true, color: '#7B5CF0' },
          { num: 2, title: 'Course à pied 5km', sub: 'Avant 19h · Canal St-Martin', time: '45 min', color: '#22C55E' },
          { num: 3, title: 'Appel maman', sub: 'Pas fait hier', time: '15 min', color: '#E85D9F' },
        ].map(p => (
          <div key={p.num} style={{
            background: 'rgba(255,255,255,0.04)',
            border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: 14,
            padding: 12,
            display: 'flex', gap: 10, alignItems: 'flex-start',
            borderLeft: `3px solid ${p.color}`,
          }}>
            <div style={{
              width: 26, height: 26, borderRadius: '50%',
              background: 'rgba(123,92,240,0.18)',
              border: '1.5px solid rgba(123,92,240,0.5)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 11, fontWeight: 700, color: '#9d83f7',
              flexShrink: 0,
            }}>{p.num}</div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <div style={{ fontSize: 12, fontWeight: 600 }}>{p.title}</div>
                {p.frog && <span style={{ fontSize: 10 }}>🐸</span>}
              </div>
              <div style={{ fontSize: 10, color: '#7d7798', marginTop: 2 }}>{p.sub}</div>
              <div style={{ display: 'flex', gap: 6, marginTop: 8 }}>
                <button style={{ padding: '4px 10px', borderRadius: 8, background: 'rgba(123,92,240,0.2)', color: '#c4b3fb', fontSize: 9, fontWeight: 600 }}>▶ {p.time}</button>
                <button style={{ padding: '4px 10px', borderRadius: 8, background: 'rgba(255,255,255,0.06)', color: '#b9b4cf', fontSize: 9, fontWeight: 600 }}>Juste 5 min</button>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div style={{ margin: '14px 6px', padding: 12, background: 'linear-gradient(135deg, rgba(98,68,214,0.18), rgba(98,68,214,0.04))', borderRadius: 14, border: '1px solid rgba(98,68,214,0.3)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 10, color: '#9d83f7', fontWeight: 600 }}>
          <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#9d83f7' }}/> PULSE BRAIN · COACH LOCAL
        </div>
        <div style={{ fontSize: 11, marginTop: 6, lineHeight: 1.45 }}>Tu as 2h libres entre 14h-16h. <strong style={{ color: '#c4b3fb' }}>Bloque ta priorité #1 maintenant ?</strong></div>
        <button style={{ marginTop: 8, padding: '6px 12px', borderRadius: 10, background: 'linear-gradient(135deg, #6244D6, #7B5CF0)', color: 'white', fontSize: 10, fontWeight: 600 }}>Auto-bloquer</button>
      </div>
      <ScreenTabBar active="focus"/>
    </div>
  );
}

// === SCREEN 3: ANALYSE / INSIGHTS (donut + stats) ===
function ScreenAnalyse() {
  // Donut data
  const cats = [
    { name: 'Sport', value: 26, color: '#22C55E', hours: '17h55' },
    { name: 'Famille', value: 20, color: '#ff8c66', hours: '13h45' },
    { name: 'Travail', value: 19, color: '#7B5CF0', hours: '13h15' },
    { name: 'Personnel', value: 17, color: '#F5C518', hours: '11h30' },
    { name: 'Social', value: 12, color: '#4DA8FF', hours: '8h30' },
    { name: 'Santé', value: 6, color: '#E85D9F', hours: '4h15' },
  ];
  const total = cats.reduce((s, c) => s + c.value, 0);
  let cumulative = 0;
  const radius = 38, circ = 2 * Math.PI * radius;

  return (
    <div className="screen-ui">
      <div className="ui-statusbar"><span>12:45</span><span>•••• 5G</span></div>
      <div style={{ padding: '8px 6px' }}>
        <div style={{ fontSize: 9, color: '#7d7798', letterSpacing: '0.18em', fontFamily: 'Geist Mono, monospace' }}>HISTORIQUE · TENDANCES</div>
        <div className="ui-tabs">
          <span className="active">Cette sem.</span>
          <span>Tendances</span>
          <span>Conseils</span>
        </div>
      </div>
      <div style={{ padding: '6px 8px' }}>
        <div style={{ fontSize: 12, fontWeight: 600, marginBottom: 8 }}>Répartition du temps</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <svg width="110" height="110" viewBox="0 0 100 100" style={{ transform: 'rotate(-90deg)' }}>
            <circle cx="50" cy="50" r={radius} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="11"/>
            {cats.map((c, i) => {
              const dash = (c.value / total) * circ;
              const offset = -((cumulative / total) * circ);
              cumulative += c.value;
              return (
                <circle key={i} cx="50" cy="50" r={radius} fill="none"
                        stroke={c.color} strokeWidth="11"
                        strokeDasharray={`${dash} ${circ}`} strokeDashoffset={offset}
                        style={{ transition: 'stroke-dasharray 1s' }}/>
              );
            })}
            <text x="50" y="48" textAnchor="middle" transform="rotate(90 50 50)" fontSize="14" fontWeight="700" fill="white">68h</text>
            <text x="50" y="58" textAnchor="middle" transform="rotate(90 50 50)" fontSize="6" fill="#7d7798">cette sem.</text>
          </svg>
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 4 }}>
            {cats.slice(0, 5).map((c, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 9 }}>
                <span style={{ width: 7, height: 7, borderRadius: '50%', background: c.color }}/>
                <span style={{ flex: 1, color: '#b9b4cf' }}>{c.name}</span>
                <span style={{ color: '#7d7798', fontVariantNumeric: 'tabular-nums' }}>{c.hours}</span>
                <span style={{ color: 'white', fontWeight: 600, width: 26, textAlign: 'right', fontVariantNumeric: 'tabular-nums' }}>{c.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div style={{ padding: '6px 8px', marginTop: 10 }}>
        <div style={{ fontSize: 12, fontWeight: 600, marginBottom: 6 }}>Densité horaire</div>
        <div style={{ display: 'grid', gridTemplateColumns: 'auto repeat(7, 1fr)', gap: 2 }}>
          <div></div>
          {['L','M','M','J','V','S','D'].map((d, i) => <div key={i} style={{ fontSize: 8, textAlign: 'center', color: '#7d7798' }}>{d}</div>)}
          {['8h','12h','16h','20h'].map((h, r) => (
            <React.Fragment key={r}>
              <div style={{ fontSize: 7, color: '#7d7798', textAlign: 'right', paddingRight: 4 }}>{h}</div>
              {[0,1,2,3,4,5,6].map(c => {
                const intensity = (Math.sin(r * 1.3 + c * 0.7) + 1) / 2;
                return <div key={c} style={{
                  height: 14, borderRadius: 2,
                  background: `rgba(123,92,240,${0.1 + intensity * 0.8})`,
                }}/>;
              })}
            </React.Fragment>
          ))}
        </div>
      </div>
      <ScreenTabBar active="analyse"/>
    </div>
  );
}

// === SCREEN 4: PULSE BRAIN — OPTIMISATION INTELLIGENTE ===
function ScreenBrain() {
  return (
    <div className="screen-ui">
      <div className="ui-statusbar"><span>12:33</span><span>•••• 5G</span></div>
      <div style={{ padding: '8px 6px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ fontSize: 13, fontWeight: 700 }}>Optimiser ma journée</div>
        <div style={{ color: '#7B5CF0' }}>•••</div>
      </div>
      <div style={{ fontSize: 9, color: '#7d7798', padding: '0 6px 8px' }}>Samedi 25 Avril 2026</div>

      <div style={{ padding: '8px 6px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
          <div style={{ fontSize: 11, color: '#b9b4cf' }}>Prochain conflit détecté</div>
          <div style={{ fontSize: 11, color: '#F5C518', fontWeight: 600 }}>19:00</div>
        </div>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 12 }}>
          <div style={{ flex: 1, padding: 10, borderRadius: 12, background: 'rgba(34,197,94,0.12)', border: '1px solid rgba(34,197,94,0.3)' }}>
            <div style={{ fontSize: 11, fontWeight: 600 }}>Course à pied</div>
            <div style={{ fontSize: 9, color: '#22C55E', marginTop: 2 }}>● Sport</div>
          </div>
          <div style={{ fontSize: 12, color: '#7d7798', fontWeight: 700 }}>VS</div>
          <div style={{ flex: 1, padding: 10, borderRadius: 12, background: 'rgba(123,92,240,0.12)', border: '1px solid rgba(123,92,240,0.3)' }}>
            <div style={{ fontSize: 11, fontWeight: 600 }}>Réunion équipe</div>
            <div style={{ fontSize: 9, color: '#7B5CF0', marginTop: 2 }}>● Travail</div>
          </div>
        </div>
      </div>

      <div style={{ margin: '0 6px', padding: 12, background: 'linear-gradient(135deg, rgba(98,68,214,0.16), rgba(123,92,240,0.05))', borderRadius: 14, border: '1px solid rgba(98,68,214,0.3)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8 }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="#9d83f7"><path d="M12 1l3 6 7 1-5 5 1 7-6-3-6 3 1-7-5-5 7-1z"/></svg>
          <div style={{ fontSize: 10, fontWeight: 700, color: '#9d83f7' }}>Garde « Course à pied »</div>
        </div>
        <div style={{ fontSize: 10, color: '#b9b4cf', lineHeight: 1.5 }}>Plus critique sur la semaine sport (2/5). On déplace « Réunion équipe » (jeu. 19h00) à demain 10h00.</div>
        <div style={{ display: 'flex', gap: 6, marginTop: 10 }}>
          <span style={{ padding: '3px 8px', borderRadius: 6, background: 'rgba(232,93,159,0.18)', color: '#E85D9F', fontSize: 9, fontWeight: 600 }}>● Priorité élevée</span>
          <span style={{ padding: '3px 8px', borderRadius: 6, background: 'rgba(34,197,94,0.18)', color: '#22C55E', fontSize: 9, fontWeight: 600 }}>Recommandé à 88 %</span>
        </div>
      </div>

      <div style={{ margin: '12px 6px 0', padding: 10, borderRadius: 12, background: 'rgba(255,91,107,0.08)', border: '1px solid rgba(255,91,107,0.2)' }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: '#ff5b6b' }}>−1 conflit</div>
        <div style={{ fontSize: 9, color: '#b9b4cf', marginTop: 2 }}>Si tu annules, tu passes à 2/5 cette semaine.</div>
      </div>

      <button style={{ margin: '14px 6px 0', padding: 13, borderRadius: 14, background: 'linear-gradient(135deg, #6244D6, #7B5CF0)', color: 'white', fontWeight: 600, fontSize: 13, boxShadow: '0 8px 24px rgba(98,68,214,0.4)' }}>
        Appliquer ce changement
      </button>
      <div style={{ textAlign: 'center', marginTop: 8, fontSize: 10, color: '#7B5CF0', fontWeight: 600 }}>Voir d'autres options</div>
      <ScreenTabBar active="focus"/>
    </div>
  );
}

// === SCREEN 5: SCORE / DAY BATTERY ===
function ScreenScore() {
  // Animated ring at 58%
  const radius = 56, circ = 2 * Math.PI * radius;
  const score = 58;

  return (
    <div className="screen-ui">
      <div className="ui-statusbar"><span>21:30</span><span>•••• 5G</span></div>
      <div style={{ padding: '8px 6px' }}>
        <div style={{ fontSize: 9, color: '#7d7798', letterSpacing: '0.18em', fontFamily: 'Geist Mono, monospace' }}>AUJOURD'HUI · 24 AVR.</div>
        <div style={{ fontSize: 9, color: '#7d7798', textAlign: 'right' }}>60/103 respectés</div>
      </div>
      <div style={{ display: 'flex', justifyContent: 'center', marginTop: 6 }}>
        <svg width="180" height="180" viewBox="0 0 160 160" style={{ transform: 'rotate(-90deg)' }}>
          <defs>
            <linearGradient id="score-grad" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#9d83f7"/>
              <stop offset="100%" stopColor="#6244D6"/>
            </linearGradient>
          </defs>
          {/* category arcs */}
          {[
            { color: '#22C55E', start: 0, len: 80 },
            { color: '#7B5CF0', start: 80, len: 70 },
            { color: '#F5C518', start: 150, len: 50 },
            { color: '#E85D9F', start: 200, len: 40 },
            { color: '#4DA8FF', start: 240, len: 60 },
            { color: '#ff8c66', start: 300, len: 60 },
          ].map((seg, i) => {
            const dash = (seg.len / 360) * circ;
            const offset = -((seg.start / 360) * circ);
            return (
              <circle key={i} cx="80" cy="80" r={radius} fill="none" stroke={seg.color} strokeWidth="14"
                      strokeDasharray={`${dash - 2} ${circ}`} strokeDashoffset={offset} strokeLinecap="round"/>
            );
          })}
          <text x="80" y="76" textAnchor="middle" transform="rotate(90 80 80)" fontSize="32" fontWeight="800" fill="white">{score}%</text>
          <text x="80" y="92" textAnchor="middle" transform="rotate(90 80 80)" fontSize="8" letterSpacing="1.5" fill="#9d83f7" fontWeight="700">PULSE SCORE</text>
          <text x="80" y="106" textAnchor="middle" transform="rotate(90 80 80)" fontSize="7" fill="#22C55E">+ 3 %</text>
        </svg>
      </div>
      {/* legend */}
      <div style={{ padding: '12px 8px 8px', display: 'grid', gridTemplateColumns: '1fr 1fr', rowGap: 5, columnGap: 12 }}>
        {[
          { c: '#ff8c66', n: 'Personnel', v: '18/53' }, { c: '#7B5CF0', n: 'Travail', v: '22/46' },
          { c: '#22C55E', n: 'Sport', v: '8/16' }, { c: '#E85D9F', n: 'Facial', v: '6/14' },
          { c: '#F5C518', n: 'Famille', v: '5/13' }, { c: '#4DA8FF', n: 'F1', v: '0/14' },
        ].map((e, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 9 }}>
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: e.c }}/>
            <span style={{ flex: 1, color: '#b9b4cf' }}>{e.n}</span>
            <span style={{ color: 'white', fontVariantNumeric: 'tabular-nums', fontWeight: 600 }}>{e.v}</span>
          </div>
        ))}
      </div>
      {/* mini stat tiles */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 6, padding: '8px 6px' }}>
        {[
          { v: 53, n: 'Personnel', c: '#ff8c66' },
          { v: 46, n: 'Travail', c: '#7B5CF0' },
          { v: 40, n: 'Sport', c: '#22C55E' },
          { v: 28, n: 'Social', c: '#4DA8FF' },
        ].map((t, i) => (
          <div key={i} style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 10, padding: '8px 4px', textAlign: 'center' }}>
            <div style={{ width: 18, height: 18, borderRadius: '50%', background: `${t.c}33`, border: `1px solid ${t.c}80`, margin: '0 auto 4px' }}/>
            <div style={{ fontSize: 13, fontWeight: 800, color: 'white' }}>{t.v}</div>
            <div style={{ fontSize: 8, color: '#7d7798' }}>{t.n}</div>
          </div>
        ))}
      </div>
      <ScreenTabBar active="suivi"/>
    </div>
  );
}

// === Tabbar ===
function ScreenTabBar({ active }) {
  const tabs = [
    { id: 'agenda', name: 'Agenda', icon: <path d="M3 4h18v17H3z M3 9h18 M8 2v4 M16 2v4"/> },
    { id: 'suivi', name: 'Suivi', icon: <path d="M2 12h3l3-9 3 18 3-12 3 6h5"/> },
    { id: 'focus', name: 'Focus', icon: <><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="3"/></> },
    { id: 'analyse', name: 'Analyse', icon: <><line x1="6" y1="20" x2="6" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="18" y1="20" x2="18" y2="14"/></> },
    { id: 'profil', name: 'Profil', icon: <><circle cx="12" cy="8" r="4"/><path d="M4 21c0-4 4-7 8-7s8 3 8 7"/></> },
  ];
  return (
    <div className="ui-tabbar">
      {tabs.map(t => (
        <div key={t.id} className={`tab-item ${active === t.id ? 'active' : ''}`}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">{t.icon}</svg>
          <span>{t.name}</span>
        </div>
      ))}
    </div>
  );
}

// === SCREEN: BRIDGE PLANNER (vacances scolaires + ponts) ===
function ScreenBridge() {
  return (
    <div className="screen-ui">
      <div className="ui-statusbar"><span>09:14</span><span>•••• 5G</span></div>
      <div style={{ padding: '8px 6px' }}>
        <div style={{ fontSize: 9, color: '#7d7798', letterSpacing: '0.18em', fontFamily: 'Geist Mono, monospace' }}>BRIDGE PLANNER · 2026</div>
        <div style={{ fontSize: 19, fontWeight: 800, marginTop: 4, letterSpacing: '-0.02em' }}>Optimise tes congés</div>
        <div style={{ fontSize: 11, color: '#b9b4cf', marginTop: 4 }}>🇫🇷 France · Zone B · 18 jours restants</div>
      </div>
      <div style={{ padding: '6px 6px', display: 'flex', flexDirection: 'column', gap: 8 }}>
        {[
          { date: 'Jeu 14 mai', name: 'Ascension', pose: 1, gain: 4, roi: '×4', best: true, sub: 'Pose vendredi → 4 jours off' },
          { date: 'Lun 1 juin', name: 'Lundi de Pentecôte', pose: 0, gain: 3, roi: '×∞', sub: 'Week-end de 3 jours auto' },
          { date: 'Mar 14 juil', name: 'Fête nationale', pose: 1, gain: 4, roi: '×4', sub: 'Pose lundi → pont 4 jours' },
          { date: 'Sam 15 août', name: 'Assomption', pose: 0, gain: 0, roi: '—', skip: true, sub: 'Tombe un samedi · pas exploitable' },
        ].map((b, i) => (
          <div key={i} style={{
            padding: 10, borderRadius: 12,
            background: b.best ? 'linear-gradient(135deg, rgba(98,68,214,0.18), rgba(123,92,240,0.05))' : (b.skip ? 'rgba(255,255,255,0.02)' : 'rgba(255,255,255,0.04)'),
            border: b.best ? '1px solid rgba(98,68,214,0.45)' : '1px solid rgba(255,255,255,0.06)',
            opacity: b.skip ? 0.5 : 1,
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 9, color: b.best ? '#9d83f7' : '#7d7798', fontFamily: 'Geist Mono, monospace', letterSpacing: '0.05em' }}>{b.date}</div>
                <div style={{ fontSize: 12, fontWeight: 700, marginTop: 2 }}>{b.name}</div>
                <div style={{ fontSize: 10, color: '#b9b4cf', marginTop: 3 }}>{b.sub}</div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: 18, fontWeight: 800, color: b.best ? '#9d83f7' : (b.skip ? '#7d7798' : 'white'), letterSpacing: '-0.02em' }}>{b.roi}</div>
                {!b.skip && <div style={{ fontSize: 8, color: '#7d7798', marginTop: -2 }}>pose {b.pose}, off {b.gain}</div>}
              </div>
            </div>
            {b.best && (
              <button style={{ marginTop: 8, padding: '6px 10px', borderRadius: 8, background: 'linear-gradient(135deg, #6244D6, #7B5CF0)', color: 'white', fontSize: 10, fontWeight: 600, width: '100%' }}>Bloquer ce pont</button>
            )}
          </div>
        ))}
      </div>
      <div style={{ margin: '10px 6px 0', padding: 10, borderRadius: 12, background: 'rgba(34,197,94,0.08)', border: '1px solid rgba(34,197,94,0.25)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 10, color: '#22C55E', fontWeight: 700 }}>
          <span>🏖️</span> VACANCES SCOLAIRES (ZONE B)
        </div>
        <div style={{ fontSize: 10, color: '#b9b4cf', marginTop: 4, lineHeight: 1.45 }}>Été : <strong style={{ color: 'white' }}>5 juil → 31 août</strong>. Combine avec le 14 juillet → <strong style={{ color: '#22C55E' }}>9 sem. dispos</strong>.</div>
      </div>
      <ScreenTabBar active="agenda"/>
    </div>
  );
}

window.ScreenBridge = ScreenBridge;
window.ScreenMois = ScreenMois;
window.ScreenFocus = ScreenFocus;
window.ScreenAnalyse = ScreenAnalyse;
window.ScreenBrain = ScreenBrain;
window.ScreenScore = ScreenScore;
window.ScreenTabBar = ScreenTabBar;

// === SCREEN: TRAJET (calcul d'itinéraire automatique) ===
function ScreenTrajet() {
  return (
    <div className="screen-ui">
      <div className="ui-statusbar"><span>20:43</span><span style={{ display: 'flex', gap: 4, alignItems: 'center' }}><span style={{ color: '#4DA8FF' }}>📍</span> •••• 5G</span></div>
      <div style={{ padding: '10px 8px 4px' }}>
        <div style={{ fontSize: 18, fontWeight: 800, letterSpacing: '-0.02em' }}>École Pasteur</div>
        <div style={{ fontSize: 11, color: '#9d83f7', marginTop: 4, fontWeight: 600 }}>✦ Trajet voiture estimé : 14 min</div>
      </div>
      {/* Options trajet */}
      <div style={{ padding: '8px', display: 'flex', flexDirection: 'column', gap: 1, background: 'rgba(255,255,255,0.04)', borderRadius: 12, margin: 8 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 12px', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
          <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
            <span style={{ fontSize: 14 }}>🚗</span>
            <div>
              <div style={{ fontSize: 12, fontWeight: 700 }}>14 min</div>
              <div style={{ fontSize: 9, color: '#7d7798' }}>Trafic dense</div>
            </div>
          </div>
          <div style={{ fontSize: 9, color: '#22C55E', fontWeight: 700 }}>Meilleur choix</div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 12px', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
          <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
            <span style={{ fontSize: 14 }}>🚇</span>
            <div>
              <div style={{ fontSize: 12, fontWeight: 700 }}>28 min</div>
              <div style={{ fontSize: 9, color: '#7d7798' }}>Transports en commun</div>
            </div>
          </div>
          <div style={{ fontSize: 9, color: '#9d83f7' }}>Arr. ~21h20</div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 12px' }}>
          <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
            <span style={{ fontSize: 14 }}>⏰</span>
            <div>
              <div style={{ fontSize: 12, fontWeight: 700 }}>Départ conseillé : Maintenant</div>
              <div style={{ fontSize: 9, color: '#7d7798' }}>Pulse calcule l'heure d'arrivée</div>
            </div>
          </div>
          <div style={{ color: '#9d83f7' }}>›</div>
        </div>
      </div>
      {/* Bouton Partir */}
      <div style={{ padding: '4px 8px' }}>
        <button style={{
          width: '100%', padding: '14px 14px', borderRadius: 14,
          background: 'linear-gradient(135deg, #6244D6, #7B5CF0)',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10,
          boxShadow: '0 8px 24px rgba(98,68,214,0.4)',
        }}>
          <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
            <span style={{ fontSize: 16, color: 'white' }}>↗</span>
            <div style={{ textAlign: 'left' }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: 'white' }}>Partir maintenant</div>
              <div style={{ fontSize: 9, color: 'rgba(255,255,255,0.75)' }}>Itinéraire optimal</div>
            </div>
          </div>
          <div style={{ color: 'white' }}>›</div>
        </button>
      </div>
      {/* Section Voir le lieu */}
      <div style={{ padding: '12px 12px 4px', fontSize: 9, color: '#7d7798', letterSpacing: '0.18em', fontFamily: 'Geist Mono, monospace' }}>VOIR LE LIEU</div>
      <div style={{ padding: '0 8px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 12px', background: 'rgba(255,255,255,0.04)', borderRadius: 12 }}>
          <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
            <span style={{ fontSize: 14 }}>📍</span>
            <div>
              <div style={{ fontSize: 11, fontWeight: 700 }}>Voir le lieu</div>
              <div style={{ fontSize: 9, color: '#7d7798' }}>Ouvrir dans Apple Plans</div>
            </div>
          </div>
          <div style={{ color: '#7d7798' }}>›</div>
        </div>
      </div>
      {/* Section Se déplacer */}
      <div style={{ padding: '12px 12px 4px', fontSize: 9, color: '#7d7798', letterSpacing: '0.18em', fontFamily: 'Geist Mono, monospace' }}>SE DÉPLACER</div>
      <div style={{ padding: '0 8px', display: 'flex', flexDirection: 'column', gap: 1, background: 'rgba(255,255,255,0.04)', borderRadius: 12, margin: '0 8px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 12px', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
          <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
            <span style={{ fontSize: 14 }}>🚗</span>
            <div>
              <div style={{ fontSize: 11, fontWeight: 700 }}>Itinéraire optimal</div>
              <div style={{ fontSize: 9, color: '#7d7798' }}>Itinéraire optimal</div>
            </div>
          </div>
          <div style={{ padding: '3px 8px', borderRadius: 8, background: 'rgba(98,68,214,0.25)', fontSize: 9, color: '#9d83f7', fontWeight: 700 }}>Recommandé</div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 12px' }}>
          <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
            <span style={{ fontSize: 14 }}>🗺️</span>
            <div>
              <div style={{ fontSize: 11, fontWeight: 700 }}>Itinéraire en voiture</div>
              <div style={{ fontSize: 9, color: '#7d7798' }}>Navigation GPS Apple Plans</div>
            </div>
          </div>
          <div style={{ color: '#7d7798' }}>›</div>
        </div>
      </div>
      <ScreenTabBar active="agenda"/>
    </div>
  );
}

// === SCREEN: RESTO (réservation depuis l'app) ===
function ScreenResto() {
  return (
    <div className="screen-ui" style={{ position: 'relative' }}>
      <div className="ui-statusbar"><span>20:43</span><span>•••• 5G</span></div>
      {/* Header sheet style */}
      <div style={{ padding: '8px', textAlign: 'center', position: 'relative' }}>
        <div style={{ width: 30, height: 4, background: 'rgba(255,255,255,0.25)', borderRadius: 2, margin: '0 auto' }}/>
        <div style={{ marginTop: 12, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 4px' }}>
          <button style={{ width: 26, height: 26, borderRadius: 13, background: 'rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, color: 'white' }}>×</button>
          <div style={{ fontSize: 13, fontWeight: 700 }}>Restaurants</div>
          <div style={{ width: 26 }}/>
        </div>
      </div>
      {/* Hero icon */}
      <div style={{ padding: '16px 12px 8px' }}>
        <div style={{ fontSize: 26 }}>🍽️</div>
        <div style={{ fontSize: 19, fontWeight: 800, letterSpacing: '-0.02em', marginTop: 8 }}>Trouve un resto</div>
        <div style={{ fontSize: 10, color: '#b9b4cf', marginTop: 4 }}>Appelle le restaurant ou utilise le lieu dans l'événement.</div>
      </div>
      {/* Search */}
      <div style={{ padding: '8px 8px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 12px', background: 'rgba(255,255,255,0.06)', borderRadius: 11 }}>
          <span style={{ color: '#7d7798', fontSize: 12 }}>⌕</span>
          <span style={{ fontSize: 11, color: 'white', fontWeight: 500 }}>Le Bouillon Chartier</span>
        </div>
      </div>
      <div style={{ textAlign: 'center', fontSize: 9, color: '#7d7798', marginTop: 4 }}>1 restaurant trouvé</div>
      {/* Result card */}
      <div style={{ padding: '8px' }}>
        <div style={{ padding: '12px', background: 'rgba(255,255,255,0.04)', borderRadius: 14 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 13, fontWeight: 700 }}>Le Bouillon Chartier</div>
              <div style={{ fontSize: 9, color: '#7d7798', marginTop: 4 }}>7 Rue du Faubourg Montmartre, Paris</div>
            </div>
            <div style={{ color: '#7d7798' }}>›</div>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 14, paddingTop: 10, borderTop: '1px solid rgba(255,255,255,0.06)' }}>
            <button style={{ width: 30, height: 30, borderRadius: 15, background: 'rgba(34,197,94,0.18)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13 }}>
              <span style={{ color: '#22C55E' }}>📞</span>
            </button>
            <button style={{ padding: '6px 14px', borderRadius: 10, background: 'rgba(98,68,214,0.18)', fontSize: 10, color: '#9d83f7', fontWeight: 700 }}>Utiliser</button>
          </div>
        </div>
      </div>
      {/* Empty space then tabbar */}
      <div style={{ flex: 1 }}/>
      <ScreenTabBar active="agenda"/>
    </div>
  );
}

// === SCREEN: DOODLE (sondage de disponibilités) ===
function ScreenDoodle() {
  return (
    <div className="screen-ui" style={{ position: 'relative' }}>
      <div className="ui-statusbar"><span>20:42</span><span>•••• 5G</span></div>
      {/* Faded month grid as background */}
      <div style={{ padding: '8px 6px', opacity: 0.3, pointerEvents: 'none' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '4px 6px' }}>
          <div style={{ fontSize: 11, color: 'white' }}>Auj.</div>
          <div style={{ fontSize: 14, fontWeight: 700 }}>Avril <span style={{ color: '#ff5b6b' }}>2026</span></div>
          <div style={{ fontSize: 11, color: '#9d83f7' }}>⌕</div>
        </div>
        {/* Mini grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 2, padding: '6px 4px', fontSize: 9 }}>
          {['L','M','M','J','V','S','D'].map((d, i) => (
            <div key={i} style={{ textAlign: 'center', color: '#7d7798', fontSize: 8, padding: '2px' }}>{d}</div>
          ))}
          {Array.from({ length: 21 }).map((_, i) => (
            <div key={i} style={{ textAlign: 'center', color: '#b9b4cf', padding: '6px 0' }}>{i + 6}</div>
          ))}
        </div>
      </div>
      {/* Action sheet (the menu) */}
      <div style={{
        position: 'absolute',
        bottom: 70,
        left: '50%',
        transform: 'translateX(-50%)',
        background: 'rgba(40, 35, 60, 0.95)',
        backdropFilter: 'blur(20px)',
        borderRadius: 16,
        padding: 6,
        minWidth: 180,
        display: 'flex',
        flexDirection: 'column',
        gap: 1,
        border: '1px solid rgba(255,255,255,0.1)',
        boxShadow: '0 20px 50px rgba(0,0,0,0.5)',
        zIndex: 5,
      }}>
        <div style={{ padding: '12px 14px', textAlign: 'center', fontSize: 11, fontWeight: 600, color: 'white', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>Nouvel événement</div>
        <div style={{ padding: '12px 14px', textAlign: 'center', fontSize: 11, fontWeight: 700, color: '#9d83f7', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>Créer un sondage Doodle</div>
        <div style={{ padding: '12px 14px', textAlign: 'center', fontSize: 11, fontWeight: 700, color: '#9d83f7' }}>Partager mes disponibilités</div>
      </div>
      {/* FAB highlighted */}
      <div style={{
        position: 'absolute',
        bottom: 70,
        right: 14,
        width: 38, height: 38, borderRadius: 19,
        background: 'linear-gradient(135deg, #6244D6, #7B5CF0)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: 22, color: 'white', fontWeight: 300,
        boxShadow: '0 8px 24px rgba(98,68,214,0.5)',
        zIndex: 6,
      }}>+</div>
      <div style={{ flex: 1 }}/>
      <ScreenTabBar active="agenda"/>
    </div>
  );
}

window.ScreenTrajet = ScreenTrajet;
window.ScreenResto = ScreenResto;
window.ScreenDoodle = ScreenDoodle;
