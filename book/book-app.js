// Pulse Booking v2 : page publique de réservation (contrat de données du 25/11/2026).
//
// Trois parcours :
//   /book/?id=<shortId>[&slot=<slotId>][&lang=<code>]              réserver
//   /book/?action=cancel&id=<bookingId>&link=<shortId>&token=<t>    annuler
//   /book/?action=reschedule&id=<bookingId>&link=<shortId>&token=<t> changer de créneau
//
// Mode démo : ?demo=1 (combinable avec lang, autoConfirm, durations, action,
// accent, slot). Données fictives locales, AUCUN appel réseau (ni Firebase,
// ni reCAPTCHA, ni Cloud Functions), envoi simulé. Paramètres de test en plus :
// accent=RRGGBB|none, host=0 (sans nom d'hôte), question=0, phone=1, address=1, video=1, noslots=1,
// demoLoad=<code> (erreur au chargement), demoError=<code> (erreur à l'envoi),
// title=, hostName= (textes), ensure=AAAA-MM-JJTHH:MM (créneau garanti, pour les vidéos).
//
// Tout le texte visible vient de ./i18n/<langue>.js (34 langues). Les contenus
// saisis par l'hôte (titre, nom, lieu, question) sont insérés en textContent,
// jamais en HTML. videoURL et hostEmail ne sont JAMAIS affichés.

import EN from './i18n/en.js';

// ─── Constantes ──────────────────────────────────────────────────────────────
const LANGS = ['ar', 'ca', 'cs', 'da', 'de', 'el', 'en', 'es', 'fi', 'fr', 'he', 'hi', 'hr', 'hu', 'id', 'it',
  'ja', 'ko', 'ms', 'nb', 'nl', 'pl', 'pt-BR', 'pt-PT', 'ro', 'ru', 'sk', 'sv', 'th', 'tr', 'uk', 'vi',
  'zh-Hans', 'zh-Hant'];
const RTL_LANGS = new Set(['ar', 'he']);
const FUNCTIONS_BASE = 'https://europe-west1-pulsecalendar-9b47f.cloudfunctions.net';
const FIREBASE_SDK = 'https://www.gstatic.com/firebasejs/10.7.0/';
const APP_STORE_URL = 'https://apps.apple.com/app/id6764295184';
const SITE_URL = 'https://pulsecalendar.app/';
const CONTACT_EMAIL = 'Contact@PulseCalendar.app';
const DEMO_ID = 'demo1234';

// Firebase config, projet pulsecalendar-9b47f.
//
// Note pour reviewers/security scanners : la clé `apiKey` ci-dessous N'EST PAS un secret.
// Les Firebase Web API keys sont publiques par design, voir
// https://firebase.google.com/docs/projects/api-keys
// La sécurité repose sur :
//   1. Firestore Security Rules (firestore-config/firestore.rules)
//   2. App Check (reCAPTCHA v3 ci-dessous + Apple App Attest côté iOS)
//   3. HTTP Referrer restriction sur la clé (GCP Console)
const firebaseConfig = {
  apiKey: 'AIzaSyDstL7mT2FQZZZTKbu4hR4KV2cPu02Ta98',
  authDomain: 'pulsecalendar-9b47f.firebaseapp.com',
  projectId: 'pulsecalendar-9b47f',
  storageBucket: 'pulsecalendar-9b47f.firebasestorage.app',
  messagingSenderId: '529257635805',
  appId: '1:529257635805:web:d56a0fd1802e2b8e1b6034',
  measurementId: 'G-1E9ZNCZB5Z',
};
// reCAPTCHA v3 site key (créée sur www.google.com/recaptcha/admin)
const RECAPTCHA_SITE_KEY = '6LeL4OssAAAAAEPEoBCWvALa0Acy2U4hWE-nzvjv';

const P = new URL(location.href).searchParams;
const DEMO = /^(1|true|yes)$/i.test(P.get('demo') || '');
const ACTION = (P.get('action') || '').toLowerCase();
const GUEST_TZ = (() => {
  try { return Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC'; } catch { return 'UTC'; }
})();
const REDUCED_MOTION = !!(window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches);

// ─── Langue ──────────────────────────────────────────────────────────────────
// Règles du contrat : pt/pt-BR → pt-BR, autre pt-* → pt-PT ; zh-CN/SG/Hans → zh-Hans,
// zh-TW/HK/MO/Hant → zh-Hant ; no/nn/nb → nb ; sinon la langue principale ; inconnu → en.
function mapLang(tag) {
  if (!tag || typeof tag !== 'string') return null;
  const t = tag.trim().replace(/_/g, '-').toLowerCase();
  if (!/^[a-z]{2,3}(-[a-z0-9]{1,8})*$/.test(t)) return null;
  const [l, ...sub] = t.split('-');
  if (l === 'pt') return (sub.length === 0 || sub[0] === 'br') ? 'pt-BR' : 'pt-PT';
  if (l === 'zh') {
    if (sub.includes('hans')) return 'zh-Hans';
    if (sub.includes('hant') || sub.some((s) => s === 'tw' || s === 'hk' || s === 'mo')) return 'zh-Hant';
    return 'zh-Hans';
  }
  if (l === 'no' || l === 'nn' || l === 'nb') return 'nb';
  if (l === 'iw') return 'he';
  if (l === 'in') return 'id';
  return LANGS.includes(l) ? l : null;
}

function browserLangs() {
  const list = (navigator.languages && navigator.languages.length) ? navigator.languages : [navigator.language];
  return list.filter(Boolean);
}

const FORCED_TAG = P.get('lang');
const LANG = mapLang(FORCED_TAG) || browserLangs().map(mapLang).find(Boolean) || 'en';

function canonical(tag) {
  try { return Intl.getCanonicalLocales(tag)[0] || null; } catch { return null; }
}
// Locale utilisée par Intl : on garde la région du navigateur quand elle correspond
// à la langue choisie (en-GB → 24 h et lundi, fr-CA, es-MX…).
const LOC = (() => {
  if (FORCED_TAG && FORCED_TAG.includes('-') && mapLang(FORCED_TAG) === LANG) {
    const c = canonical(FORCED_TAG.replace(/_/g, '-'));
    if (c) return c;
  }
  for (const tag of browserLangs()) {
    if (mapLang(tag) === LANG) { const c = canonical(tag); if (c) return c; }
  }
  return LANG;
})();

let T = EN;
if (LANG !== 'en') {
  try {
    const mod = await import(`./i18n/${LANG}.js`);
    T = Object.assign({}, EN, mod.default);
  } catch (err) {
    console.warn('[Pulse Booking] traduction indisponible :', LANG, err);
  }
}

function t(key, vars) {
  let s = (T[key] ?? EN[key] ?? key);
  if (vars) s = s.replace(/\{(\w+)\}/g, (m, k) => (vars[k] != null && typeof vars[k] !== 'object') ? String(vars[k]) : m);
  return s;
}
// Variante qui accepte des nœuds DOM comme valeurs ({email} en gras, {app} en lien…).
function tn(key, vars = {}) {
  const parts = [];
  const re = /\{(\w+)\}/g;
  const s = T[key] ?? EN[key] ?? key;
  let last = 0; let m;
  while ((m = re.exec(s))) {
    if (m.index > last) parts.push(s.slice(last, m.index));
    const v = vars[m[1]];
    parts.push(v == null ? m[0] : (v instanceof Node ? v : String(v)));
    last = re.lastIndex;
  }
  if (last < s.length) parts.push(s.slice(last));
  return parts;
}

// ─── Dates et heures (Intl, langue choisie, fuseau de l'invité) ──────────────
// Calendrier : grégorien partout (la grille est grégorienne), sauf le calendrier
// bouddhique thaï qui ne change que l'année.
const CALENDAR = (() => {
  try {
    const c = new Intl.DateTimeFormat(LOC).resolvedOptions().calendar;
    return (c === 'gregory' || c === 'buddhist') ? null : 'gregory';
  } catch { return null; }
})();
function dtf(opts) {
  const o = Object.assign({}, opts);
  if (CALENDAR) o.calendar = CALENDAR;
  o.timeZone = GUEST_TZ;
  try { return new Intl.DateTimeFormat(LOC, o); } catch {
    delete o.timeZone;
    return new Intl.DateTimeFormat(LOC, o);
  }
}
const F = {
  time: dtf({ hour: 'numeric', minute: '2-digit' }),
  dayLong: dtf({ weekday: 'long', day: 'numeric', month: 'long' }),
  full: dtf({ weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }),
  month: dtf({ month: 'long', year: 'numeric' }),
  wdShort: dtf({ weekday: 'short' }),
  wdNarrow: dtf({ weekday: 'narrow' }),
};
const NUM = (() => { try { return new Intl.NumberFormat(LOC, { useGrouping: false }); } catch { return new Intl.NumberFormat(); } })();

function cap(s) {
  if (!s) return s;
  const first = Array.from(s)[0];
  return first.toLocaleUpperCase(LOC) + s.slice(first.length);
}
function timeRange(a, b) {
  try { if (typeof F.time.formatRange === 'function') return F.time.formatRange(a, b); } catch { /* repli */ }
  return `${F.time.format(a)} – ${F.time.format(b)}`;
}
function fmtDuration(min) {
  try {
    const unit = (u, v) => new Intl.NumberFormat(LOC, { style: 'unit', unit: u, unitDisplay: 'short' }).format(v);
    if (min < 60) return unit('minute', min);
    if (min % 60 === 0) return unit('hour', min / 60);
    if (typeof Intl.DurationFormat === 'function') {
      return new Intl.DurationFormat(LOC, { style: 'short' }).format({ hours: Math.floor(min / 60), minutes: min % 60 });
    }
    return unit('minute', min);
  } catch { return `${min} min`; }
}
// Premier jour de la semaine : 0 = dimanche … 6 = samedi.
const FIRST_DOW = (() => {
  try {
    const L = new Intl.Locale(LOC);
    const wi = (typeof L.getWeekInfo === 'function') ? L.getWeekInfo() : L.weekInfo;
    if (wi && wi.firstDay) return wi.firstDay % 7;
  } catch { /* repli */ }
  const parts = LOC.split('-');
  const region = parts.slice(1).find((p) => /^[A-Z]{2}$/.test(p) || /^\d{3}$/.test(p));
  const SUN = ['US', 'CA', 'MX', 'BR', 'JP', 'KR', 'TW', 'HK', 'MO', 'IL', 'IN', 'TH', 'ID', 'PH', 'SA', 'ZA', 'PE', 'CO', 'VE', 'AU', 'NZ'];
  const SAT = ['AE', 'BH', 'DZ', 'EG', 'IQ', 'JO', 'KW', 'LY', 'OM', 'QA', 'SD', 'SY', 'AF', 'IR'];
  if (region) {
    if (SAT.includes(region)) return 6;
    if (SUN.includes(region)) return 0;
    return 1;
  }
  if (LANG === 'ar') return 6;
  if (['en', 'he', 'ja', 'ko', 'hi', 'th', 'id', 'pt-BR', 'zh-Hant'].includes(LANG)) return 0;
  return 1;
})();
function tzLabel() {
  let name = '';
  for (const style of ['longGeneric', 'long']) {
    try {
      const p = new Intl.DateTimeFormat(LOC, { timeZone: GUEST_TZ, timeZoneName: style })
        .formatToParts(new Date()).find((x) => x.type === 'timeZoneName');
      if (p && p.value) { name = p.value; break; }
    } catch { /* style non pris en charge */ }
  }
  const city = GUEST_TZ.includes('/') ? GUEST_TZ.split('/').pop().replace(/_/g, ' ') : '';
  if (!name) return city || GUEST_TZ;
  if (!city || name.includes(city)) return name;
  return `${name} (${city})`;
}

const pad = (n) => String(n).padStart(2, '0');
// Clé de jour dans le fuseau de l'invité (= fuseau du navigateur), jamais en UTC.
const dayKey = (d) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
const keyDate = (k) => { const [y, m, d] = k.split('-').map(Number); return new Date(y, m - 1, d, 12); };
const monthOfKey = (k) => { const d = keyDate(k); return d.getFullYear() * 12 + d.getMonth(); };
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

// ─── DOM ─────────────────────────────────────────────────────────────────────
const $ = (id) => document.getElementById(id);
function h(tag, props, ...kids) {
  const el = document.createElement(tag);
  if (props) {
    for (const [k, v] of Object.entries(props)) {
      if (v == null || v === false) continue;
      if (k === 'class') el.className = v;
      else if (k.startsWith('on') && typeof v === 'function') el.addEventListener(k.slice(2), v);
      else el.setAttribute(k, v === true ? '' : v);
    }
  }
  for (const kid of kids.flat(Infinity)) {
    if (kid == null || kid === false) continue;
    el.append(kid instanceof Node ? kid : String(kid));
  }
  return el;
}
const ICONS = {
  clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3.2 2"/>',
  pin: '<path d="M12 21s-6.5-5.8-6.5-11a6.5 6.5 0 0 1 13 0c0 5.2-6.5 11-6.5 11z"/><circle cx="12" cy="10" r="2.4"/>',
  chevL: '<path d="M14.5 6l-6 6 6 6"/>',
  chevR: '<path d="M9.5 6l6 6-6 6"/>',
  check: '<path d="M5 12.5l4.5 4.5L19 7.5"/>',
  mail: '<rect x="3" y="5.5" width="18" height="13" rx="2.5"/><path d="M3.5 7.5l8.5 6 8.5-6"/>',
  alert: '<circle cx="12" cy="12" r="9"/><path d="M12 7.5v5.5"/><path d="M12 16.4v.1"/>',
  info: '<circle cx="12" cy="12" r="9"/><path d="M12 11v5.5"/><path d="M12 7.6v.1"/>',
  calPlus: '<rect x="3.5" y="5" width="17" height="15.5" rx="2.5"/><path d="M3.5 9.5h17M8 3v4M16 3v4M12 12.5v5M9.5 15h5"/>',
  cal: '<rect x="3.5" y="5" width="17" height="15.5" rx="2.5"/><path d="M3.5 9.5h17M8 3v4M16 3v4"/>',
  video: '<rect x="3" y="6.5" width="12.5" height="11" rx="2.5"/><path d="M15.5 10.5l5-3v9l-5-3"/>',
  globe: '<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c2.4 2.5 3.6 5.5 3.6 9s-1.2 6.5-3.6 9c-2.4-2.5-3.6-5.5-3.6-9S9.6 5.5 12 3z"/>',
  x: '<path d="M7 7l10 10M17 7L7 17"/>',
};
function icon(name, extra = '') {
  const s = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  s.setAttribute('viewBox', '0 0 24 24');
  s.setAttribute('aria-hidden', 'true');
  s.setAttribute('focusable', 'false');
  s.setAttribute('class', `ico ${extra}`.trim());
  s.innerHTML = ICONS[name] || '';
  return s;
}
// replaceChildren() écrirait « null » en texte : on filtre les nœuds absents.
function setMain(...kids) {
  $('main').replaceChildren(...kids.flat(Infinity).filter((k) => k != null && k !== false));
}
function scrollToEl(el, instant = false) {
  if (!el) return;
  el.scrollIntoView({ behavior: (instant || REDUCED_MOTION) ? 'auto' : 'smooth', block: 'start' });
}

// ─── Couleur d'accent de l'hôte ──────────────────────────────────────────────
function hexToRgb(hex) {
  const m = /^#?([0-9a-f]{6})$/i.exec(String(hex || '').trim());
  if (!m) return null;
  const n = parseInt(m[1], 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}
function luminance([r, g, b]) {
  const f = (c) => { c /= 255; return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4); };
  return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b);
}
function contrast(a, b) {
  const la = luminance(a); const lb = luminance(b);
  return (Math.max(la, lb) + 0.05) / (Math.min(la, lb) + 0.05);
}
const mix = (a, b, k) => a.map((v, i) => Math.round(v + (b[i] - v) * k));
const toHex = (rgb) => '#' + rgb.map((v) => v.toString(16).padStart(2, '0')).join('');
// Variante lisible comme texte/bordure sur le fond (≥ 4.5:1), en gardant la teinte.
function inkOn(rgb, bg, toward) {
  for (let k = 0; k <= 1.0001; k += 0.05) {
    const c = mix(rgb, toward, k);
    if (contrast(c, bg) >= 4.5) return c;
  }
  return toward;
}
function applyAccent(hex) {
  const rgb = hexToRgb(hex);
  if (!rgb) return; // repli : accent neutre défini dans le CSS
  const s = document.documentElement.style;
  const onAccent = contrast(rgb, [0, 0, 0]) >= contrast(rgb, [255, 255, 255]) ? '#000000' : '#FFFFFF';
  s.setProperty('--host-accent', toHex(rgb));
  s.setProperty('--host-on-accent', onAccent);
  s.setProperty('--host-ink-l', toHex(inkOn(rgb, [244, 244, 242], [0, 0, 0])));
  s.setProperty('--host-ink-d', toHex(inkOn(rgb, [35, 35, 39], [255, 255, 255])));
  s.setProperty('--host-soft-l', `rgba(${rgb.join(',')},0.12)`);
  s.setProperty('--host-soft-d', `rgba(${rgb.join(',')},0.24)`);
}

// ─── Erreurs ─────────────────────────────────────────────────────────────────
function codeErr(code) { const e = new Error(code); e.code = code; return e; }
const ERR_KEYS = {
  invalid_link: 'errLinkNotFound', link_not_found: 'errLinkNotFound', link_inactive: 'errLinkInactive',
  invalid_name: 'errName', invalid_email: 'errEmail', invalid_answer: 'errAnswer',
  invalid_address: 'errAddress', missing_address: 'errAddress',
  invalid_phone: 'errPhone', missing_phone: 'errPhone',
  invalid_time: 'errSlotInvalid', invalid_time_range: 'errSlotInvalid', duration_too_long: 'errSlotInvalid',
  invalid_slot: 'errSlotInvalid', invalid_duration: 'errSlotInvalid',
  time_in_past: 'errPast',
  slot_not_available: 'errSlotTaken', slot_already_booked: 'errSlotTaken', slot_not_found: 'errSlotTaken',
  slot_taken: 'errSlotTaken', slot_overlap: 'errSlotTaken', overlap: 'errSlotTaken', conflict: 'errSlotTaken',
  day_full: 'errDayFull',
  rate_limit_ip: 'errRateIp', rate_limit: 'errRateIp', rate_limit_email: 'errRateEmail',
  recaptcha_failed: 'errCaptcha',
  invalid_token: 'errToken', missing: 'errBadLink', not_found: 'errNotFound',
  too_many_reschedules: 'errTooManyMoves', not_reschedulable: 'errNotMovable',
  network: 'errNetwork', timeout: 'errNetwork',
  internal: 'errGeneric', method: 'errGeneric', unknown: 'errGeneric',
};
const FIELD_OF = {
  invalid_name: 'name', invalid_email: 'email', invalid_answer: 'answer',
  invalid_address: 'address', missing_address: 'address', invalid_phone: 'phone', missing_phone: 'phone',
};
const SLOT_CODES = new Set(['slot_not_available', 'slot_already_booked', 'slot_not_found', 'slot_taken',
  'slot_overlap', 'overlap', 'conflict', 'time_in_past', 'invalid_time', 'invalid_time_range', 'invalid_slot',
  'duration_too_long', 'invalid_duration', 'day_full']);
const errMsg = (code) => t(ERR_KEYS[code] || 'errGeneric');

// ─── Réseau (hors démo uniquement) ───────────────────────────────────────────
let fbPromise = null;
function firebase() {
  if (DEMO) return Promise.reject(codeErr('network'));
  if (!fbPromise) {
    fbPromise = (async () => {
      const [appMod, checkMod, fs] = await Promise.all([
        import(FIREBASE_SDK + 'firebase-app.js'),
        import(FIREBASE_SDK + 'firebase-app-check.js'),
        import(FIREBASE_SDK + 'firebase-firestore.js'),
      ]);
      const app = appMod.initializeApp(firebaseConfig);
      // App Check obligatoire : bloque les bots non attestés (reCAPTCHA v3).
      checkMod.initializeAppCheck(app, {
        provider: new checkMod.ReCaptchaV3Provider(RECAPTCHA_SITE_KEY),
        isTokenAutoRefreshEnabled: true,
      });
      return { db: fs.getFirestore(app), fs };
    })().catch((err) => { fbPromise = null; throw err; });
  }
  return fbPromise;
}

let rcPromise = null;
function loadRecaptcha() {
  if (DEMO) return Promise.reject(codeErr('recaptcha_failed'));
  if (!rcPromise) {
    rcPromise = new Promise((resolve, reject) => {
      if (!window.grecaptcha || !window.grecaptcha.execute) {
        const s = document.createElement('script');
        s.src = `https://www.google.com/recaptcha/api.js?render=${RECAPTCHA_SITE_KEY}`;
        s.async = true;
        s.onerror = () => reject(codeErr('network'));
        document.head.append(s);
      }
      const t0 = Date.now();
      (function wait() {
        if (window.grecaptcha && window.grecaptcha.ready) return window.grecaptcha.ready(() => resolve(window.grecaptcha));
        if (Date.now() - t0 > 15000) return reject(codeErr('recaptcha_failed'));
        setTimeout(wait, 100);
      })();
    }).catch((err) => { rcPromise = null; throw err; });
  }
  return rcPromise;
}
async function recaptchaToken(action) {
  const g = await loadRecaptcha();
  return g.execute(RECAPTCHA_SITE_KEY, { action });
}

function withTimeout(promise, ms) {
  return Promise.race([promise, sleep(ms).then(() => { throw codeErr('timeout'); })]);
}

async function postJSON(fn, body) {
  let resp;
  try {
    resp = await fetch(`${FUNCTIONS_BASE}/${fn}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
  } catch {
    throw codeErr('network');
  }
  const data = await resp.json().catch(() => ({}));
  if (!resp.ok || data.ok === false) {
    throw codeErr(typeof data.error === 'string' ? data.error : (resp.status === 429 ? 'rate_limit_ip' : 'unknown'));
  }
  return data;
}

const posInt = (v) => (Number.isInteger(v) && v > 0 && v <= 24 * 60) ? v : null;

async function loadLink(shortId, withSlots, { allowInactive = false } = {}) {
  if (DEMO) {
    await sleep(200);
    if (P.get('demoLoad')) throw codeErr(P.get('demoLoad'));
    return demoData(withSlots);
  }
  const { db, fs } = await firebase();
  const snap = await withTimeout(fs.getDoc(fs.doc(db, 'bookingLinks', shortId)), 20000);
  if (!snap.exists()) throw codeErr('link_not_found');
  const data = snap.data();
  let link;
  try { link = JSON.parse(data.json); } catch { throw codeErr('link_not_found'); }
  // `active` au niveau du document = source de vérité (pause depuis l'app).
  const active = (typeof data.active === 'boolean') ? data.active : link.active !== false;
  if (!active && !allowInactive) throw codeErr('link_inactive');
  link.shortId = shortId;
  link.hostAnonymousUid = data.hostAnonymousUid || link.hostAnonymousUid;
  if (!withSlots) return { link, slots: [] };
  return { link, slots: await fetchSlots(link) };
}

async function fetchSlots(link) {
  const { db, fs } = await firebase();
  const q = fs.query(
    fs.collection(db, 'publicAvailability', link.hostAnonymousUid, 'slots'),
    fs.where('linkShortId', '==', link.shortId),
    fs.where('bookable', '==', true),
    fs.orderBy('start'),
  );
  const snap = await withTimeout(fs.getDocs(q), 20000);
  const minStart = Date.now() + 60 * 1000;
  const base = posInt(link.durationMinutes) || 30;
  const offered = linkDurations(link);
  return snap.docs.map((d) => {
    const x = d.data();
    const start = x.start && x.start.toDate ? x.start.toDate() : null;
    const end = x.end && x.end.toDate ? x.end.toDate() : null;
    if (!start || !end || end <= start) return null;
    // Docs sans durationMinutes (anciens) = durée du lien.
    return { id: d.id, start, end, dur: posInt(x.durationMinutes) || base };
  }).filter((s) => s && s.start.getTime() > minStart && offered.includes(s.dur)).sort((a, b) => a.start - b.start);
}

// ─── Mode démo ───────────────────────────────────────────────────────────────
function demoDurations() {
  const raw = (P.get('durations') || '').split(/[,\s]+/).map((x) => parseInt(x, 10)).filter((n) => n >= 5 && n <= 240);
  const uniq = [...new Set(raw)];
  return uniq.length ? uniq : [30, 60];
}
function demoData(withSlots) {
  const durs = demoDurations();
  const accent = P.get('accent');
  const link = {
    shortId: DEMO_ID,
    hostAnonymousUid: 'demo-host',
    title: P.get('title') || t('demoTitle'),
    hostName: P.get('host') === '0' ? null : (P.get('hostName') || 'Camille Martin'),
    location: t('demoPlace'),
    durationMinutes: durs[0],
    durations: durs.length > 1 ? durs : undefined,
    autoConfirm: /^(1|true|yes)$/i.test(P.get('autoConfirm') || ''),
    question: P.get('question') === '0' ? null : t('demoQuestion'),
    requirePhone: P.get('phone') === '1',
    requireAddress: P.get('address') === '1',
    accentHex: accent === 'none' ? undefined : (hexToRgb(accent) ? '#' + accent.replace('#', '') : '#0F766E'),
    videoURL: P.get('video') === '1' ? 'https://example.invalid/visio' : undefined,
    active: true,
  };
  if (!withSlots || P.get('noslots') === '1') return { link, slots: [] };
  // Créneaux fictifs sur 3 semaines, en semaine, 9 h-12 h et 14 h-18 h (heure locale de l'invité),
  // avec des trous pseudo-aléatoires mais stables pour avoir l'air réel.
  const slots = [];
  const now = new Date();
  const base = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const rnd = (n) => { let x = (n ^ 0x5bd1e995) >>> 0; x ^= x << 13; x ^= x >>> 17; x ^= x << 5; return (x >>> 0) % 100; };
  for (let d = 0; d < 21; d++) {
    const day = new Date(base); day.setDate(base.getDate() + d);
    const dow = day.getDay();
    if (dow === 0 || dow === 6) continue;
    const seed = day.getFullYear() * 400 + day.getMonth() * 32 + day.getDate();
    if (rnd(seed) < 12) continue; // une journée complète de temps en temps
    for (const dur of durs) {
      const step = dur <= 30 ? 30 : 60;
      for (const [from, to] of [[9 * 60, 12 * 60], [14 * 60, 18 * 60]]) {
        for (let m = from; m + dur <= to; m += step) {
          const start = new Date(day); start.setHours(0, m, 0, 0);
          if (start.getTime() < now.getTime() + 2 * 3600 * 1000) continue;
          if (rnd(seed * 1440 + m + dur * 7) < 30) continue;
          const epoch = Math.floor(start.getTime() / 1000);
          slots.push({
            id: dur === durs[0] ? `${DEMO_ID}_${epoch}` : `${DEMO_ID}_${dur}_${epoch}`,
            start, end: new Date(start.getTime() + dur * 60000), dur,
          });
        }
      }
    }
  }
  // Démo pour vidéo : `ensure=AAAA-MM-JJTHH:MM` garantit ce créneau (heure locale, durée principale).
  const ensure = P.get('ensure');
  if (ensure && /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/.test(ensure)) {
    const [d, h] = ensure.split('T');
    const [y, mo, da] = d.split('-').map(Number);
    const [hh, mm] = h.split(':').map(Number);
    const start = new Date(y, mo - 1, da, hh, mm, 0, 0);
    const epoch = Math.floor(start.getTime() / 1000);
    if (!slots.some((x) => x.dur === durs[0] && x.start.getTime() === start.getTime())) {
      slots.push({ id: `${DEMO_ID}_${epoch}`, start, end: new Date(start.getTime() + durs[0] * 60000), dur: durs[0] });
    }
  }
  slots.sort((a, b) => a.start - b.start);
  return { link, slots };
}
async function demoSubmit(payload) {
  await sleep(REDUCED_MOTION ? 300 : 900);
  if (P.get('demoError')) throw codeErr(P.get('demoError'));
  return payload;
}

// ─── État ────────────────────────────────────────────────────────────────────
const S = {
  mode: 'book',     // 'book' | 'cancel' | 'reschedule'
  shortId: null,
  link: null,
  slots: [],        // { id, start, end, dur } triés par début
  durs: [],
  dur: null,
  day: null,        // 'AAAA-MM-JJ' dans le fuseau de l'invité
  month: null,      // année * 12 + mois affiché
  slot: null,
  bookingId: null,
  token: null,
  busy: false,
};
const R = {}; // références DOM du sélecteur

function linkDurations(link) {
  const base = posInt(link.durationMinutes) || 30;
  const list = Array.isArray(link.durations) ? [...new Set(link.durations.map(posInt).filter(Boolean))] : [];
  return list.length > 1 ? list : [base];
}
const slotsForDur = () => S.slots.filter((s) => s.dur === S.dur);
const daySlots = (k) => (k ? slotsForDur().filter((s) => dayKey(s.start) === k) : []);
function firstAvailDay() { const s = slotsForDur()[0]; return s ? dayKey(s.start) : null; }
function hostName() { return (S.link && typeof S.link.hostName === 'string' && S.link.hostName.trim()) || ''; }

function setLink(link) {
  S.link = link;
  applyAccent(link.accentHex);
  const host = hostName();
  if (link.title) document.title = host ? `${link.title} · ${host}` : link.title;
}

// ─── Mise en page générale ───────────────────────────────────────────────────
function initials(name) {
  return name.trim().split(/\s+/).filter(Boolean).slice(0, 2).map((p) => Array.from(p)[0]).join('').toLocaleUpperCase(LOC);
}
function metaItem(ic, text) {
  return h('span', { class: 'meta-item' }, icon(ic), h('span', null, text));
}
function renderHeader() {
  const head = $('head');
  const L = S.link;
  if (!L) { head.hidden = true; return; }
  const host = hostName();
  const kids = [];
  if (S.mode === 'reschedule') kids.push(h('p', { class: 'kicker' }, t('rescheduleTitle')));
  if (host) {
    kids.push(h('div', { class: 'host' },
      h('span', { class: 'avatar', 'aria-hidden': 'true' }, initials(host)),
      h('span', { class: 'host-name' }, host)));
  }
  kids.push(h('h1', { class: 'title' }, L.title || t('docTitle')));
  const meta = [];
  const durs = linkDurations(L);
  if (durs.length === 1) meta.push(metaItem('clock', fmtDuration(durs[0])));
  if (typeof L.location === 'string' && L.location.trim()) meta.push(metaItem('pin', L.location.trim()));
  if (meta.length) kids.push(h('div', { class: 'meta' }, meta));
  if (S.mode === 'reschedule') kids.push(h('p', { class: 'lead' }, t('rescheduleHint')));
  head.replaceChildren(...kids);
  head.hidden = false;
}

function endonym(code) {
  try {
    const name = new Intl.DisplayNames([code], { type: 'language' }).of(code);
    if (name && name !== code) return Array.from(name)[0].toLocaleUpperCase(code) + name.slice(Array.from(name)[0].length);
  } catch { /* repli */ }
  return code;
}
function renderFooter() {
  const appLink = h('a', { class: 'app', href: SITE_URL, target: '_blank', rel: 'noopener' }, 'Pulse Calendar');
  const sel = h('select', { id: 'langSelect', 'aria-label': t('language') },
    LANGS.map((c) => h('option', { value: c, selected: c === LANG, lang: c }, endonym(c))));
  sel.addEventListener('change', () => {
    const u = new URL(location.href);
    u.searchParams.set('lang', sel.value);
    location.assign(u.toString());
  });
  $('foot').replaceChildren(
    h('p', null, tn('madeWith', { app: appLink })),
    h('p', null, h('a', { href: APP_STORE_URL, target: '_blank', rel: 'noopener' }, t('createOwn'))),
    h('label', { class: 'lang' }, icon('globe'), h('span', { class: 'sr' }, t('language')), sel),
  );
}

function showLoading() {
  setMain(h('div', { class: 'loading', role: 'status', 'aria-live': 'polite' },
    h('span', { class: 'spinner', 'aria-hidden': 'true' }), h('span', null, t('loading'))));
}

function renderDone({ ic, bad = false, title, body = [], extra = [] }) {
  const heading = h('h2', { tabindex: '-1' }, title);
  setMain(h('section', { class: 'card done' },
    h('div', { class: bad ? 'badge bad' : 'badge' }, icon(ic)), heading, body, extra));
  window.scrollTo({ top: 0, behavior: REDUCED_MOTION ? 'auto' : 'smooth' });
  heading.focus({ preventScroll: true });
}

function showError(message, retry) {
  renderDone({
    ic: 'alert', bad: true, title: t('errTitle'),
    body: [h('p', null, message)],
    extra: retry ? [h('div', { class: 'stack' }, h('button', {
      type: 'button', class: 'btn btn-primary',
      onclick: () => { showLoading(); retry(); },
    }, t('retry')))] : [],
  });
}
function showLoadError(err, retry) {
  console.error('[Pulse Booking] chargement impossible :', err);
  const code = err && err.code;
  if (code === 'link_not_found' || code === 'invalid_link') return showError(t('errLinkNotFound'));
  if (code === 'link_inactive') return showError(t('errLinkInactive'));
  return showError(t('errLoad'), retry);
}

function noSlotsCard() {
  return h('section', { class: 'card done' },
    h('div', { class: 'badge' }, icon('cal')),
    h('h2', null, t('noSlotsTitle')),
    h('p', null, t('noSlotsBody')));
}
function showNoSlots() {
  setMain(noSlotsCard(), cancelInsteadLink());
}
function cancelInsteadLink() {
  if (S.mode !== 'reschedule') return null;
  return h('p', { class: 'center' },
    h('a', { class: 'btn btn-quiet', href: actionUrl('cancel', S.bookingId, S.token) }, t('cancelInstead')));
}

// Liens internes : on garde la langue forcée et les paramètres de démo.
function carry(u) {
  if (FORCED_TAG) u.searchParams.set('lang', FORCED_TAG);
  if (DEMO) {
    u.searchParams.set('demo', '1');
    for (const k of ['autoConfirm', 'durations', 'accent', 'host', 'video']) if (P.get(k)) u.searchParams.set(k, P.get(k));
  }
  return u.pathname + u.search;
}
function actionUrl(action, bookingId, token) {
  const u = new URL(location.pathname, location.origin);
  u.searchParams.set('action', action);
  u.searchParams.set('id', bookingId);
  if (S.shortId) u.searchParams.set('link', S.shortId);
  u.searchParams.set('token', token);
  return carry(u);
}
function bookUrl(shortId) {
  const u = new URL(location.pathname, location.origin);
  u.searchParams.set('id', shortId);
  return carry(u);
}

// ─── Sélecteur durée / jour / heure (réservation et déplacement) ────────────
function initPicker(preselectId) {
  S.durs = linkDurations(S.link);
  let pre = null;
  let notice = null;
  if (preselectId) {
    pre = S.slots.find((s) => s.id === preselectId) || null;
    if (!pre) notice = t('slotGone');
  }
  if (pre && !S.durs.includes(pre.dur)) S.durs.push(pre.dur);
  S.dur = pre ? pre.dur : (S.durs.find((d) => S.slots.some((s) => s.dur === d)) ?? S.durs[0]);
  let day = pre ? dayKey(pre.start) : null;
  if (!pre && preselectId) {
    // Créneau déjà pris : on ouvre quand même le bon jour s'il reste des horaires.
    const m = /_(\d{9,11})$/.exec(preselectId);
    if (m) { const k = dayKey(new Date(Number(m[1]) * 1000)); if (daySlots(k).length) day = k; }
  }
  S.day = day || firstAvailDay();
  S.slot = pre;
  S.month = S.day ? monthOfKey(S.day) : (new Date().getFullYear() * 12 + new Date().getMonth());
  buildPicker();
  if (notice) showTimesNotice(notice, 'info');
  // Au chargement, un défilement animé est interrompu par le navigateur : on saute directement.
  if (pre) setTimeout(() => revealDetails(true), 0);
  else if (notice) setTimeout(() => scrollToEl(R.timesCard, true), 0);
}

function buildPicker() {
  R.durs = h('div');
  R.calBody = h('div');
  R.calCard = h('section', { class: 'card', 'aria-labelledby': 'calTitle' },
    R.durs,
    h('h2', { id: 'calTitle' }, t('pickDay')),
    R.calBody,
    h('p', { class: 'tz' }, tn('tzNote', { tz: h('bdi', null, tzLabel()) })));
  R.timesTitle = h('h2', { id: 'timesTitle' }, t('pickTime'));
  R.timesSub = h('p', { class: 'sub' });
  R.timesNotice = h('div', { hidden: true });
  R.timesList = h('div');
  R.timesCard = h('section', { class: 'card', 'aria-labelledby': 'timesTitle' },
    R.timesTitle, R.timesSub, R.timesNotice, R.timesList);
  R.details = S.mode === 'reschedule' ? buildRescheduleCard() : buildBookForm();
  setMain(
    h('div', { class: 'picker' }, R.calCard, R.timesCard, R.details),
    cancelInsteadLink(),
  );
  renderDurations();
  renderCalendar();
  renderTimes();
}

function renderDurations() {
  if (S.durs.length < 2) { R.durs.replaceChildren(); return; }
  R.durs.replaceChildren(
    h('p', { class: 'durs-label', id: 'dursLabel' }, t('duration')),
    h('div', { class: 'durs', role: 'group', 'aria-labelledby': 'dursLabel' },
      S.durs.map((d) => h('button', {
        type: 'button', class: 'chip', 'aria-pressed': String(d === S.dur),
        onclick: () => selectDur(d),
      }, fmtDuration(d)))),
  );
}

function renderCalendar() {
  const avail = new Set(slotsForDur().map((s) => dayKey(s.start)));
  const list = slotsForDur();
  const nowM = new Date().getFullYear() * 12 + new Date().getMonth();
  const minM = list.length ? Math.min(nowM, monthOfKey(dayKey(list[0].start))) : nowM;
  const maxM = list.length ? monthOfKey(dayKey(list[list.length - 1].start)) : nowM;
  S.month = Math.max(minM, Math.min(maxM, S.month));
  const y = Math.floor(S.month / 12); const m = S.month % 12;
  const todayK = dayKey(new Date());

  const prev = h('button', {
    type: 'button', class: 'icon-btn', 'aria-label': t('prevMonth'), disabled: S.month <= minM,
    onclick: () => { S.month -= 1; renderCalendar(); },
  }, icon('chevL', 'flip'));
  const next = h('button', {
    type: 'button', class: 'icon-btn', 'aria-label': t('nextMonth'), disabled: S.month >= maxM,
    onclick: () => { S.month += 1; renderCalendar(); },
  }, icon('chevR', 'flip'));
  const monthLabel = h('div', { class: 'cal-month', 'aria-live': 'polite' }, cap(F.month.format(new Date(y, m, 15, 12))));

  // En-têtes des jours, dans l'ordre de la langue (lundi, dimanche ou samedi en premier).
  const ref = new Date(2023, 0, 1, 12); // un dimanche
  const names = [];
  for (let i = 0; i < 7; i++) {
    const d = new Date(ref); d.setDate(ref.getDate() + ((FIRST_DOW + i) % 7));
    names.push(d);
  }
  const shortNames = names.map((d) => F.wdShort.format(d));
  const useNarrow = shortNames.some((s) => Array.from(s).length > 5);
  const grid = h('div', { class: 'grid7' },
    names.map((d, i) => h('div', { class: 'wd', 'aria-hidden': 'true' }, useNarrow ? F.wdNarrow.format(d) : shortNames[i])));

  const offset = (new Date(y, m, 1).getDay() - FIRST_DOW + 7) % 7;
  for (let i = 0; i < offset; i++) grid.append(h('div', { 'aria-hidden': 'true' }));
  const daysInMonth = new Date(y, m + 1, 0).getDate();
  for (let d = 1; d <= daysInMonth; d++) {
    const date = new Date(y, m, d, 12);
    const k = dayKey(date);
    const ok = avail.has(k);
    const cls = ['day'];
    if (ok) cls.push('avail');
    if (k === todayK) cls.push('today');
    grid.append(h('button', {
      type: 'button',
      class: cls.join(' '),
      disabled: !ok,
      'aria-pressed': ok ? String(k === S.day) : null,
      'aria-current': k === todayK ? 'date' : null,
      'aria-label': cap(F.full.format(date)),
      onclick: ok ? () => selectDay(k) : null,
    }, NUM.format(d)));
  }
  R.calBody.replaceChildren(h('div', { class: 'cal-head' }, prev, monthLabel, next), grid);
}

function renderTimes() {
  const list = daySlots(S.day);
  if (!S.day || !list.length) {
    R.timesSub.textContent = '';
    R.timesList.replaceChildren(slotsForDur().length
      ? h('p', { class: 'empty' }, t('noSlotsDay'))
      : h('div', null, h('p', { class: 'empty' }, h('strong', null, t('noSlotsTitle'))), h('p', { class: 'empty' }, t('noSlotsBody'))));
    return;
  }
  R.timesSub.textContent = cap(F.dayLong.format(keyDate(S.day)));
  R.timesList.replaceChildren(h('div', { class: 'times' }, list.map((s) => h('button', {
    type: 'button', class: 'time', 'aria-pressed': String(!!S.slot && S.slot.id === s.id),
    onclick: () => selectSlot(s),
  }, F.time.format(s.start)))));
}

function showTimesNotice(message, kind) {
  R.timesNotice.replaceChildren(h('div', { class: kind === 'info' ? 'notice info' : 'notice', role: kind === 'info' ? 'status' : 'alert' },
    icon(kind === 'info' ? 'info' : 'alert'), h('span', null, message)));
  R.timesNotice.hidden = false;
}
function clearTimesNotice() { R.timesNotice.hidden = true; R.timesNotice.replaceChildren(); }

function isSingleColumn() { return !window.matchMedia || !matchMedia('(min-width: 900px)').matches; }

function selectDur(d) {
  if (d === S.dur || S.busy) return;
  S.dur = d;
  S.slot = null;
  if (!daySlots(S.day).length) S.day = firstAvailDay();
  if (S.day) S.month = monthOfKey(S.day);
  clearTimesNotice();
  renderDurations(); renderCalendar(); renderTimes(); hideDetails();
}
function selectDay(k) {
  if (S.busy) return;
  S.day = k;
  S.slot = null;
  clearTimesNotice();
  renderCalendar(); renderTimes(); hideDetails();
  // Sur téléphone, on amène les horaires à l'écran s'ils sont sous la ligne de flottaison.
  if (isSingleColumn() && R.timesCard.getBoundingClientRect().top > window.innerHeight * 0.55) scrollToEl(R.timesCard);
}
function selectSlot(s) {
  if (S.busy) return;
  S.slot = s;
  clearTimesNotice();
  renderTimes();
  revealDetails();
}

function whenBlock(slot) {
  return h('div', { class: 'when' }, icon('clock'),
    h('div', null, h('strong', null, cap(F.full.format(slot.start))), h('span', null, timeRange(slot.start, slot.end))));
}
function revealDetails(instant = false) {
  R.summary.replaceChildren(whenBlock(S.slot));
  clearDetailsError();
  R.details.hidden = false;
  scrollToEl(R.details, instant);
  R.detailsTitle.focus({ preventScroll: true });
}
function hideDetails() { R.details.hidden = true; }

function showDetailsError(code, message) {
  R.error.replaceChildren(h('div', { class: 'notice', role: 'alert' }, icon('alert'), h('span', null, message || errMsg(code))));
  R.error.hidden = false;
}
function clearDetailsError() {
  if (!R.error) return;
  R.error.hidden = true;
  R.error.replaceChildren();
  for (const el of R.details.querySelectorAll('[aria-invalid]')) el.removeAttribute('aria-invalid');
}
function setBusy(btn, busy, label) {
  S.busy = busy;
  btn.disabled = busy;
  btn.textContent = label;
  btn.setAttribute('aria-busy', String(busy));
}

// Créneau pris entre-temps : on le retire, on revient aux horaires, on recharge en tâche de fond.
function handleSlotConflict(code) {
  const slot = S.slot;
  if (slot) {
    const k = dayKey(slot.start);
    S.slots = code === 'day_full'
      ? S.slots.filter((s) => dayKey(s.start) !== k)
      : S.slots.filter((s) => s.id !== slot.id);
  }
  S.slot = null;
  if (!daySlots(S.day).length) S.day = firstAvailDay();
  if (S.day) S.month = monthOfKey(S.day);
  hideDetails();
  renderCalendar(); renderTimes();
  showTimesNotice(errMsg(code), 'error');
  scrollToEl(R.timesCard);
  if (!DEMO && S.link) {
    fetchSlots(S.link).then((fresh) => {
      if (S.slot || S.busy) return; // l'invité a déjà rechoisi
      S.slots = fresh;
      if (!daySlots(S.day).length) S.day = firstAvailDay();
      renderCalendar(); renderTimes();
    }).catch(() => { /* on garde la liste locale */ });
  }
}

// ─── Réservation ─────────────────────────────────────────────────────────────
function buildBookForm() {
  const L = S.link;
  const field = (input, label, optional) => h('div', { class: 'field' },
    h('label', { for: input.id }, label, optional ? h('span', { class: 'opt' }, ` (${t('optional')})`) : null),
    input);
  R.name = h('input', { id: 'f-name', name: 'guestName', type: 'text', autocomplete: 'name', maxlength: '100', required: true, enterkeyhint: 'next' });
  R.email = h('input', { id: 'f-email', name: 'guestEmail', type: 'email', autocomplete: 'email', inputmode: 'email', maxlength: '200', required: true, autocapitalize: 'off', spellcheck: 'false', dir: 'auto' });
  R.answer = h('textarea', { id: 'f-answer', name: 'guestAnswer', maxlength: '1000', rows: '3' });
  R.phone = h('input', { id: 'f-phone', name: 'guestPhone', type: 'tel', autocomplete: 'tel', maxlength: '30', dir: 'auto' });
  R.address = h('input', { id: 'f-address', name: 'guestAddress', type: 'text', autocomplete: 'street-address', maxlength: '500' });
  R.consent = h('input', { id: 'f-consent', type: 'checkbox', required: true });
  // Honeypot : invisible et hors tabulation ; s'il est rempli, le serveur simule un succès.
  R.honeypot = h('input', { type: 'text', name: 'website', class: 'honeypot', tabindex: '-1', autocomplete: 'off', 'aria-hidden': 'true' });
  const question = typeof L.question === 'string' && L.question.trim() ? L.question.trim() : null;
  R.detailsTitle = h('h2', { id: 'detailsTitle', tabindex: '-1' }, t('detailsTitle'));
  R.summary = h('div');
  R.error = h('div', { hidden: true });
  R.submit = h('button', { type: 'submit', class: 'btn btn-primary' }, L.autoConfirm === true ? t('submitConfirm') : t('submitRequest'));
  const form = h('form', { novalidate: true, 'aria-labelledby': 'detailsTitle' },
    R.detailsTitle,
    R.summary,
    h('div', { class: 'fields' },
      h('div', { class: 'pair' }, field(R.name, t('name')), field(R.email, t('email'))),
      L.requirePhone === true ? field(R.phone, t('phone')) : null,
      L.requireAddress === true ? field(R.address, t('address')) : null,
      question ? field(R.answer, question, true) : null),
    R.honeypot,
    h('label', { class: 'consent', for: 'f-consent' }, R.consent,
      h('span', null, tn('consent', { email: CONTACT_EMAIL }), ' ',
        h('a', { href: '/privacy/', target: '_blank', rel: 'noopener' }, t('privacy')))),
    R.error,
    R.submit,
    L.autoConfirm === true ? null : h('p', { class: 'hint' }, t('requestHint', { who: hostName() || t('someone') })),
  );
  form.addEventListener('submit', submitBooking);
  for (const el of [R.name, R.email, R.phone, R.address, R.answer, R.consent]) {
    el.addEventListener('input', () => el.removeAttribute('aria-invalid'));
  }
  return h('section', { class: 'card full', hidden: true }, form);
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

async function submitBooking(e) {
  e.preventDefault();
  if (S.busy || !S.slot) return;
  clearDetailsError();
  const L = S.link;
  const name = R.name.value.trim();
  const email = R.email.value.trim();
  const phone = R.phone.value.trim();
  const address = R.address.value.trim();
  const answer = R.answer.value.trim();
  const fail = (el, key) => { el.setAttribute('aria-invalid', 'true'); showDetailsError(null, t(key)); el.focus(); };
  if (!name) return fail(R.name, 'errName');
  if (!EMAIL_RE.test(email)) return fail(R.email, 'errEmail');
  if (L.requirePhone === true && phone.replace(/\D/g, '').length < 6) return fail(R.phone, 'errPhone');
  if (L.requireAddress === true && address.length < 3) return fail(R.address, 'errAddress');
  if (!R.consent.checked) return fail(R.consent, 'errConsent');

  const slot = S.slot;
  const label = R.submit.textContent;
  setBusy(R.submit, true, t('sending'));
  try {
    let res;
    if (DEMO) {
      res = await demoSubmit({ ok: true, bookingId: `demo-${Date.now().toString(36)}`, cancelToken: 'demo-token', status: L.autoConfirm === true ? 'confirmed' : 'pending' });
    } else {
      const token = await recaptchaToken('create_booking');
      res = await postJSON('createBooking', {
        linkShortId: S.shortId,
        guestName: name,
        guestEmail: email,
        guestAnswer: answer || null,
        // Champs conditionnels : envoyés seulement si l'hôte les demande ; le serveur revérifie.
        guestPhone: L.requirePhone === true ? (phone || null) : null,
        guestAddress: L.requireAddress === true ? (address || null) : null,
        guestTimezone: GUEST_TZ,
        // Code de langue de la page (un des 34 du contrat) : langue des e-mails.
        guestLocale: LANG,
        slotId: slot.id,
        durationMinutes: slot.dur,
        startTime: slot.start.toISOString(),
        endTime: slot.end.toISOString(),
        recaptchaToken: token,
        honeypot: R.honeypot.value,
      });
    }
    S.busy = false;
    showBooked(res, email, slot);
  } catch (err) {
    setBusy(R.submit, false, label);
    const code = (err && err.code) || 'unknown';
    console.warn('[Pulse Booking] réservation refusée :', code);
    if (SLOT_CODES.has(code)) return handleSlotConflict(code);
    if (code === 'link_inactive' || code === 'link_not_found' || code === 'invalid_link') return showError(errMsg(code));
    const field = FIELD_OF[code] && R[FIELD_OF[code]];
    if (field) field.setAttribute('aria-invalid', 'true');
    showDetailsError(code);
    if (field) field.focus();
  }
}

function showBooked(res, email, slot) {
  // Ancien serveur (pas de `status`) ou honeypot : demande en attente.
  const confirmed = res && res.status === 'confirmed';
  const who = hostName() || t('someone');
  const body = [
    whenBlock(slot),
    h('p', null, tn(confirmed ? 'confirmedBody' : 'pendingBody', { email: h('bdi', { class: 'em' }, email), who })),
  ];
  // On signale seulement qu'une visio existe ; le lien n'est jamais affiché sur la page.
  if (S.link.videoURL) body.push(h('p', { class: 'note' }, icon('video'), h('span', null, t(confirmed ? 'videoConfirmed' : 'videoPending'))));
  const extra = [];
  if (confirmed) extra.push(calendarButtons(res.bookingId, slot));
  if (res && res.bookingId && res.cancelToken) extra.push(manageBlock(res.bookingId, res.cancelToken));
  renderDone({ ic: confirmed ? 'check' : 'mail', title: t(confirmed ? 'confirmedTitle' : 'pendingTitle'), body, extra });
}

function manageBlock(bookingId, token) {
  return h('div', { class: 'group manage' },
    h('p', { class: 'small' }, t('manageHint')),
    h('div', { class: 'stack' },
      h('a', { class: 'btn', href: actionUrl('reschedule', bookingId, token) }, t('changeTime')),
      h('a', { class: 'btn', href: actionUrl('cancel', bookingId, token) }, t('cancelAppt'))));
}

// ─── Ajout au calendrier (Google, Outlook, .ics) ─────────────────────────────
const icsDate = (d) => d.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '');
const icsEscape = (s) => String(s).replace(/\\/g, '\\\\').replace(/\r?\n/g, '\\n').replace(/([,;])/g, '\\$1');
function foldLine(line) {
  const enc = new TextEncoder();
  if (enc.encode(line).length <= 75) return line;
  let out = ''; let cur = ''; let bytes = 0; let limit = 75;
  for (const ch of line) {
    const b = enc.encode(ch).length;
    if (bytes + b > limit) { out += cur + '\r\n '; cur = ''; bytes = 0; limit = 74; }
    cur += ch; bytes += b;
  }
  return out + cur;
}
function buildICS({ uid, start, end, title, location, description }) {
  const lines = ['BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//Pulse Calendar//Pulse Booking//EN', 'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH', 'BEGIN:VEVENT', `UID:${uid}`, `DTSTAMP:${icsDate(new Date())}`, `DTSTART:${icsDate(start)}`,
    `DTEND:${icsDate(end)}`, `SUMMARY:${icsEscape(title)}`];
  if (location) lines.push(`LOCATION:${icsEscape(location)}`);
  if (description) lines.push(`DESCRIPTION:${icsEscape(description)}`);
  lines.push('SEQUENCE:0', 'STATUS:CONFIRMED', 'TRANSP:OPAQUE', 'END:VEVENT', 'END:VCALENDAR');
  return lines.map(foldLine).join('\r\n') + '\r\n';
}
function calendarButtons(bookingId, slot) {
  const L = S.link;
  const host = hostName();
  const title = host ? t('eventWith', { title: L.title, host }) : L.title;
  const note = t('eventNote');
  const where = (typeof L.location === 'string' && L.location.trim()) || '';

  const g = new URL('https://calendar.google.com/calendar/render');
  g.searchParams.set('action', 'TEMPLATE');
  g.searchParams.set('text', title);
  g.searchParams.set('dates', `${icsDate(slot.start)}/${icsDate(slot.end)}`);
  g.searchParams.set('details', note);
  if (where) g.searchParams.set('location', where);

  const o = new URL('https://outlook.live.com/calendar/0/deeplink/compose');
  o.searchParams.set('path', '/calendar/action/compose');
  o.searchParams.set('rru', 'addevent');
  o.searchParams.set('subject', title);
  o.searchParams.set('startdt', slot.start.toISOString());
  o.searchParams.set('enddt', slot.end.toISOString());
  o.searchParams.set('body', note);
  if (where) o.searchParams.set('location', where);

  // Même UID que l'invitation envoyée par le serveur : pas de doublon dans Calendrier.
  const ics = buildICS({ uid: `${bookingId || 'booking-' + Date.now()}@pulsecalendar.app`, start: slot.start, end: slot.end, title, location: where, description: note });
  const href = URL.createObjectURL(new Blob([ics], { type: 'text/calendar;charset=utf-8' }));
  const fileName = `${(L.title || 'event').replace(/[\\/:*?"<>|\u0000-\u001f]+/g, ' ').trim().slice(0, 60) || 'event'}.ics`;

  return h('div', { class: 'group' },
    h('p', { class: 'group-label' }, t('addToCal')),
    h('div', { class: 'stack' },
      h('a', { class: 'btn', href: g.toString(), target: '_blank', rel: 'noopener' }, icon('calPlus'), t('gcal')),
      h('a', { class: 'btn', href: o.toString(), target: '_blank', rel: 'noopener' }, icon('calPlus'), t('outlook')),
      h('a', { class: 'btn', href, download: fileName }, icon('calPlus'), t('ics'))));
}

async function startBooking() {
  S.mode = 'book';
  S.shortId = DEMO ? DEMO_ID : (P.get('id') || location.pathname.split('/').filter(Boolean).pop());
  if (!S.shortId || S.shortId === 'book' || S.shortId === 'index.html' || !/^[A-Za-z0-9_-]{6,32}$/.test(S.shortId)) {
    return showError(t('errLinkNotFound'));
  }
  let data;
  try { data = await loadLink(S.shortId, true); } catch (err) { return showLoadError(err, startBooking); }
  setLink(data.link);
  S.slots = data.slots;
  renderHeader();
  if (!S.slots.length) return showNoSlots();
  initPicker(P.get('slot'));
}

// ─── Annulation ──────────────────────────────────────────────────────────────
function readActionParams() {
  const ok = (v, re) => (typeof v === 'string' && re.test(v) ? v : null);
  return {
    bookingId: ok(P.get('id') || (DEMO ? 'demo-booking' : null), /^[A-Za-z0-9_-]{6,64}$/),
    token: ok(P.get('token') || (DEMO ? 'demo-token' : null), /^[A-Za-z0-9_.~=+/-]{6,512}$/),
    linkId: ok(DEMO ? DEMO_ID : P.get('link'), /^[A-Za-z0-9_-]{6,32}$/),
  };
}

async function startCancel() {
  S.mode = 'cancel';
  const { bookingId, token, linkId } = readActionParams();
  if (!bookingId || !token) return showError(t('errBadLink'));
  S.bookingId = bookingId; S.token = token; S.shortId = linkId;
  if (linkId) {
    // Le lien sert seulement à afficher le titre et l'hôte ; l'annulation marche sans.
    try { const { link } = await loadLink(linkId, false, { allowInactive: true }); setLink(link); } catch (err) {
      console.warn('[Pulse Booking] lien non chargé pour l’annulation :', err && err.code);
    }
  }
  renderHeader();
  renderCancelAsk();
}

function renderCancelAsk() {
  const heading = h('h2', { tabindex: '-1' }, t('cancelTitle'));
  const error = h('div', { hidden: true });
  const yes = h('button', { type: 'button', class: 'btn btn-danger' }, t('cancelYes'));
  const no = h('button', { type: 'button', class: 'btn' }, t('cancelNo'));
  yes.addEventListener('click', async () => {
    if (S.busy) return;
    error.hidden = true;
    setBusy(yes, true, t('cancelling'));
    no.disabled = true;
    try {
      const res = DEMO
        ? await demoSubmit({ ok: true })
        : await postJSON('cancelBooking', { bookingId: S.bookingId, cancelToken: S.token });
      S.busy = false;
      renderCancelled(!!res.alreadyCancelled);
    } catch (err) {
      setBusy(yes, false, t('cancelYes'));
      no.disabled = false;
      error.replaceChildren(h('div', { class: 'notice', role: 'alert' }, icon('alert'), h('span', null, errMsg(err && err.code))));
      error.hidden = false;
    }
  });
  no.addEventListener('click', () => { if (!S.busy) renderKept(); });
  setMain(h('section', { class: 'card done' },
    h('div', { class: 'badge bad' }, icon('x')),
    heading,
    h('p', null, t('cancelBody')),
    error,
    h('div', { class: 'stack' }, yes, no)));
  heading.focus({ preventScroll: true });
}

function renderCancelled(already) {
  renderDone({
    ic: 'check',
    title: t('cancelledTitle'),
    body: [h('p', null, already ? t('alreadyCancelled') : t('cancelledBody'))],
    extra: S.shortId ? [h('div', { class: 'stack' }, h('a', { class: 'btn btn-primary', href: bookUrl(S.shortId) }, t('bookAgain')))] : [],
  });
}
function renderKept() {
  renderDone({
    ic: 'check',
    title: t('keptTitle'),
    body: [h('p', null, t('keptBody'))],
    extra: S.shortId ? [h('div', { class: 'stack' }, h('a', { class: 'btn', href: actionUrl('reschedule', S.bookingId, S.token) }, t('changeTime')))] : [],
  });
}

// ─── Changement de créneau ───────────────────────────────────────────────────
function buildRescheduleCard() {
  R.detailsTitle = h('h2', { id: 'detailsTitle', tabindex: '-1' }, t('newSlot'));
  R.summary = h('div');
  R.error = h('div', { hidden: true });
  R.submit = h('button', { type: 'button', class: 'btn btn-primary' }, t('confirmNewSlot'));
  R.submit.addEventListener('click', submitReschedule);
  return h('section', { class: 'card full', hidden: true, 'aria-labelledby': 'detailsTitle' },
    R.detailsTitle, R.summary, R.error, h('div', { class: 'stack' }, R.submit));
}

async function startReschedule() {
  S.mode = 'reschedule';
  const { bookingId, token, linkId } = readActionParams();
  if (!bookingId || !token || !linkId) return showError(t('errBadLink'));
  S.bookingId = bookingId; S.token = token; S.shortId = linkId;
  let data;
  try { data = await loadLink(linkId, true); } catch (err) { return showLoadError(err, startReschedule); }
  setLink(data.link);
  S.slots = data.slots;
  renderHeader();
  if (!S.slots.length) return showNoSlots();
  initPicker(null);
}

async function submitReschedule() {
  if (S.busy || !S.slot) return;
  clearDetailsError();
  const slot = S.slot;
  setBusy(R.submit, true, t('sending'));
  try {
    let res;
    if (DEMO) {
      res = await demoSubmit({ ok: true, status: S.link.autoConfirm === true ? 'confirmed' : 'pending' });
    } else {
      const token = await recaptchaToken('reschedule_booking');
      res = await postJSON('rescheduleBooking', {
        bookingId: S.bookingId, token: S.token, newSlotId: slot.id, recaptchaToken: token,
      });
    }
    S.busy = false;
    const confirmed = res && res.status === 'confirmed';
    renderDone({
      ic: confirmed ? 'check' : 'mail',
      title: t(confirmed ? 'movedTitle' : 'movePendingTitle'),
      body: [whenBlock(slot), h('p', null, confirmed ? t('movedBody') : t('movePendingBody', { who: hostName() || t('someone') }))],
    });
  } catch (err) {
    setBusy(R.submit, false, t('confirmNewSlot'));
    const code = (err && err.code) || 'unknown';
    console.warn('[Pulse Booking] changement refusé :', code);
    if (SLOT_CODES.has(code)) return handleSlotConflict(code);
    showDetailsError(code);
  }
}

// ─── Démarrage ───────────────────────────────────────────────────────────────
document.documentElement.lang = LANG;
document.documentElement.dir = RTL_LANGS.has(LANG) ? 'rtl' : 'ltr';
document.title = t('docTitle');
renderFooter();
showLoading();
if (DEMO) {
  console.info('[Pulse Booking] mode démo : données fictives, aucun appel réseau.');
} else {
  // Comme l'ancien <script> statique : reCAPTCHA chargé tôt pour App Check et l'envoi.
  loadRecaptcha().catch(() => { /* réessayé à l'envoi */ });
}
if (ACTION === 'cancel') startCancel();
else if (ACTION === 'reschedule') startReschedule();
else startBooking();
