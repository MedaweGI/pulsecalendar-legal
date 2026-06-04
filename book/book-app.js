import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.0/firebase-app.js";
import { initializeAppCheck, ReCaptchaV3Provider } from "https://www.gstatic.com/firebasejs/10.7.0/firebase-app-check.js";
import { getFirestore, doc, getDoc, collection, query, where, getDocs, orderBy } from "https://www.gstatic.com/firebasejs/10.7.0/firebase-firestore.js";

// Firebase config — projet pulsecalendar-9b47f
//
// ⚠️ Note pour reviewers/security scanners : la clé `apiKey` ci-dessous N'EST PAS un secret.
// Les Firebase Web API keys sont publiques par design — voir :
//   https://firebase.google.com/docs/projects/api-keys
//   « Firebase API keys are different from typical API keys... they are not
//     used for authentication, but only to identify your Firebase project. »
// La sécurité repose sur :
//   1. Firestore Security Rules (firestore-config/firestore.rules)
//   2. App Check (reCAPTCHA v3 ci-dessous + Apple App Attest côté iOS)
//   3. HTTP Referrer restriction sur la clé (GCP Console)
//
const firebaseConfig = {
  apiKey: "AIzaSyDstL7mT2FQZZZTKbu4hR4KV2cPu02Ta98",
  authDomain: "pulsecalendar-9b47f.firebaseapp.com",
  projectId: "pulsecalendar-9b47f",
  storageBucket: "pulsecalendar-9b47f.firebasestorage.app",
  messagingSenderId: "529257635805",
  appId: "1:529257635805:web:d56a0fd1802e2b8e1b6034",
  measurementId: "G-1E9ZNCZB5Z"
};

// reCAPTCHA v3 site key (créée sur www.google.com/recaptcha/admin)
const RECAPTCHA_SITE_KEY = "6LeL4OssAAAAAEPEoBCWvALa0Acy2U4hWE-nzvjv";
const CLOUD_FUNCTION_URL = "https://europe-west1-pulsecalendar-9b47f.cloudfunctions.net/createBooking";

const app = initializeApp(firebaseConfig);

// App Check obligatoire — bloque les bots non-attested (reCAPTCHA v3)
initializeAppCheck(app, {
  provider: new ReCaptchaV3Provider(RECAPTCHA_SITE_KEY),
  isTokenAutoRefreshEnabled: true,
});

const db = getFirestore(app);

// ─── State ───────────────────────────────────────────────
// shortId is read from `?id=...` (preferred — works directly with GitHub
// Pages) or from the last path segment for backward compat (`/book/abc`).
const __url = new URL(location.href);
const shortId = __url.searchParams.get('id')
              || __url.pathname.split('/').filter(Boolean).pop();
let link = null;
let slots = [];
let selectedDate = null;
let selectedSlot = null;
const guestTz = Intl.DateTimeFormat().resolvedOptions().timeZone;

const $ = (id) => document.getElementById(id);

document.getElementById('tzLabel').textContent = guestTz;

// ─── Load booking link + slots ───────────────────────────
async function load() {
  console.log('[Pulse Booking] Loading link, shortId =', shortId);
  try {
    if (!shortId || shortId === 'book' || shortId.length < 6) {
      throw new Error('Invalid booking link');
    }

    const linkSnap = await getDoc(doc(db, 'bookingLinks', shortId));
    console.log('[Pulse Booking] linkSnap.exists() =', linkSnap.exists());
    if (!linkSnap.exists()) throw new Error('Booking link not found');

    const linkData = linkSnap.data();
    if (!linkData.active) throw new Error('This booking link is no longer active');

    link = JSON.parse(linkData.json);
    document.title = `${link.title} · Pulse Booking`;
    $('hostName').textContent = link.title;
    $('durationLabel').textContent = `${link.durationMinutes} minutes`;
    $('summaryWhat').textContent = link.title;
    $('summaryDuration').textContent = `${link.durationMinutes} min`;

    if (link.question) {
      $('answerLabel').textContent = link.question;
      $('answerField').classList.remove('hidden');
    }

    // Champs optionnels demandés par le host (v1.4.0+) :
    // requirePhone / requireAddress sont des bool dans le BookingLink JSON.
    // On utilise === true pour éviter qu'une valeur "truthy" inattendue
    // (string, nombre) active les champs sans intention explicite.
    if (link.requirePhone === true) {
      $('phoneField').classList.remove('hidden');
      $('phone').setAttribute('required', '');
    }
    if (link.requireAddress === true) {
      $('addressField').classList.remove('hidden');
      $('address').setAttribute('required', '');
    }

    // Load slots
    const slotsQ = query(
      collection(db, 'publicAvailability', link.hostAnonymousUid, 'slots'),
      where('linkShortId', '==', shortId),
      where('bookable', '==', true),
      orderBy('start')
    );
    const slotsSnap = await getDocs(slotsQ);
    slots = slotsSnap.docs.map(d => ({
      id: d.id,
      start: d.data().start.toDate(),
      end: d.data().end.toDate(),
    }));
    console.log('[Pulse Booking] slots loaded :', slots.length);

    if (slots.length === 0) {
      // Message explicite : la cause la plus probable est que l'host n'a
      // pas encore publié de disponibilités (besoin d'ouvrir l'app iOS
      // au moins une fois après création du lien). On informe le guest
      // plutôt que de laisser un message générique.
      throw new Error('No available slots yet — the host has not published availability. Please ask them to open their Pulse Calendar app once.');
    }

    $('stateLoading').classList.add('hidden');
    $('step1').classList.remove('hidden');
    renderCalendar();
  } catch (err) {
    console.error('[Pulse Booking] load() failed :', err);
    $('stateLoading').classList.add('hidden');
    $('stateError').classList.remove('hidden');
    $('errorMsg').textContent = err.message;
  }
}

// ─── Calendar render ─────────────────────────────────────
let calMonth = new Date();
calMonth.setDate(1);

function renderCalendar() {
  const month = calMonth.getMonth();
  const year = calMonth.getFullYear();
  const monthName = calMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  $('calMonth').textContent = monthName;

  const grid = $('calGrid');
  grid.innerHTML = '';

  // Day headers
  ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].forEach(d => {
    const h = document.createElement('div');
    h.className = 'cal-day-header';
    h.textContent = d;
    grid.appendChild(h);
  });

  // First day offset (mon=0 ... sun=6)
  const firstDay = new Date(year, month, 1).getDay();
  const offset = (firstDay + 6) % 7;
  for (let i = 0; i < offset; i++) {
    const e = document.createElement('div');
    e.className = 'cal-day empty';
    grid.appendChild(e);
  }

  const daysInMonth = new Date(year, month + 1, 0).getDate();
  for (let d = 1; d <= daysInMonth; d++) {
    const date = new Date(year, month, d);
    const dateKey = date.toISOString().slice(0, 10);
    const hasSlots = slots.some(s => s.start.toISOString().slice(0, 10) === dateKey);
    const isPast = date < new Date(new Date().setHours(0,0,0,0));

    const cell = document.createElement('div');
    cell.className = 'cal-day';
    cell.textContent = d;
    if (isPast || !hasSlots) {
      cell.classList.add('full');
    } else {
      cell.classList.add('has-slots');
      const dot = document.createElement('div');
      dot.className = 'dot';
      cell.appendChild(dot);
      cell.onclick = () => selectDate(date);
    }
    if (selectedDate && selectedDate.toDateString() === date.toDateString()) {
      cell.classList.add('selected');
    }
    grid.appendChild(cell);
  }
}

$('calPrev').onclick = () => {
  calMonth.setMonth(calMonth.getMonth() - 1);
  renderCalendar();
};
$('calNext').onclick = () => {
  calMonth.setMonth(calMonth.getMonth() + 1);
  renderCalendar();
};

function selectDate(date) {
  selectedDate = date;
  selectedSlot = null;
  renderCalendar();
  renderSlots();
  $('step2').classList.remove('hidden');
  $('step3').classList.add('hidden');
}

function renderSlots() {
  const dayKey = selectedDate.toISOString().slice(0, 10);
  const daySlots = slots.filter(s => s.start.toISOString().slice(0, 10) === dayKey);
  const friendly = selectedDate.toLocaleDateString('en-US', {
    weekday: 'short', month: 'short', day: 'numeric',
  });
  $('step2Title').textContent = `${friendly} — pick a time`;

  const grid = $('slotsGrid');
  grid.innerHTML = '';
  daySlots.forEach(slot => {
    const btn = document.createElement('div');
    btn.className = 'slot';
    btn.textContent = slot.start.toLocaleTimeString('en-US', {
      hour: '2-digit', minute: '2-digit', hour12: false,
    });
    btn.onclick = () => selectSlot(slot, btn);
    grid.appendChild(btn);
  });
}

function selectSlot(slot, btn) {
  selectedSlot = slot;
  document.querySelectorAll('.slot').forEach(el => el.classList.remove('selected'));
  btn.classList.add('selected');

  $('summaryWhen').textContent = slot.start.toLocaleString('en-US', {
    weekday: 'short', month: 'short', day: 'numeric',
    hour: '2-digit', minute: '2-digit',
  });
  $('summaryTZ').textContent = guestTz;

  $('step3').classList.remove('hidden');
  $('step3').scrollIntoView({ behavior: 'smooth' });
}

// ─── Submit booking ──────────────────────────────────────
$('bookingForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  if (!selectedSlot) return;

  const btn = $('submitBtn');
  btn.disabled = true;
  btn.textContent = 'Submitting…';

  try {
    // 1. Get reCAPTCHA v3 token
    const token = await grecaptcha.execute(RECAPTCHA_SITE_KEY, {
      action: 'create_booking',
    });

    // 2. POST to Cloud Function (which does server-side validation + rate limit)
    const response = await fetch(CLOUD_FUNCTION_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        linkShortId: shortId,
        guestName: $('name').value.trim(),
        guestEmail: $('email').value.trim(),
        guestAnswer: $('answer').value.trim() || null,
        // Champs conditionnels (v1.4.0+) : seulement envoyés si le host
        // les a demandés (i.e. le champ est visible). La Cloud Function
        // re-vérifie côté serveur — un guest curieux qui force ces champs
        // sans que le link les demande verra ses valeurs ignorées (anti-
        // injection + data minimization RGPD).
        guestPhone: $('phone').value.trim() || null,
        guestAddress: $('address').value.trim() || null,
        guestTimezone: guestTz,
        // Locale du navigateur (ex: "fr-FR", "en-US") — sert à envoyer les
        // emails de confirmation/decline dans la bonne langue.
        guestLocale: (navigator.languages && navigator.languages[0])
                     || navigator.language || 'en',
        startTime: selectedSlot.start.toISOString(),
        endTime: selectedSlot.end.toISOString(),
        recaptchaToken: token,
        honeypot: e.target.elements.website.value,
      }),
    });

    if (!response.ok) {
      const errData = await response.json().catch(() => ({}));
      throw new Error(humanError(errData.error || 'unknown'));
    }

    // 3. Success
    document.querySelectorAll('.card').forEach(c => c.classList.add('hidden'));
    $('stateSuccess').classList.remove('hidden');
    $('successDetails').textContent =
      `Confirmation sent to ${$('email').value}. The host will validate shortly.`;

  } catch (err) {
    alert(err.message);
    btn.disabled = false;
    btn.textContent = 'Confirm booking';
  }
});

function humanError(code) {
  const msgs = {
    invalid_link: 'This booking link is invalid.',
    invalid_name: 'Please enter a valid name.',
    invalid_email: 'Please enter a valid email.',
    invalid_time: 'Invalid time slot.',
    slot_not_available: 'This slot is no longer available. Please pick another.',
    slot_already_booked: 'This slot was just booked by someone else. Please pick another.',
    rate_limit_ip: 'Too many requests from your network. Try again in 15 minutes.',
    rate_limit_email: 'You\'ve booked too many slots today. Try again tomorrow.',
    recaptcha_failed: 'Security check failed. Please refresh and try again.',
    link_inactive: 'This booking link is no longer active.',
    link_not_found: 'Booking link not found.',
    time_in_past: 'Cannot book a time in the past.',
    duration_too_long: 'Duration too long.',
    missing_address: 'The host requires an address. Please fill in the address field.',
    missing_phone: 'The host requires a phone number. Please fill in the phone field.',
    invalid_address: 'Please enter a valid address.',
    invalid_phone: 'Please enter a valid phone number.',
  };
  return msgs[code] || 'Something went wrong. Please try again.';
}

// Init
load();
