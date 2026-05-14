# PulseCalendar — Site web

Smart Calendar & Anti-Procrastination Coach pour iPhone.

## Structure

```
PulseCalendar.html         ← Home page (point d'entrée principal)
privacy.html               ← Politique de confidentialité

features/                  ← 6 pages SEO ciblées
  smart-calendar.html
  ai-calendar.html         (Coach intelligent — slug gardé pour SEO)
  anti-procrastination.html
  focus-planner.html
  adhd-calendar.html
  schedule-optimizer.html

vs/
  apple-calendar.html      ← Page comparative

audiences/
  students.html
  adhd.html

calendars/                 ← Hub ICS (gros levier SEO)
  index.html
  world-cup-2026.html
  f1-2026.html
  school-holidays-france.html

shared/
  effects.css              ← Effets pro (aurora, grain, glass, etc.)
  effects.js               ← Spotlight curseur, scroll progress, magnetic CTA, counters
  seo-page.css             ← Design system des sous-pages
  nav-footer.js            ← Injecteur nav + footer commun

src/                       ← Composants React (mockup iPhone)
  PulseLogo.jsx
  PhoneFrame.jsx
  Screens.jsx
  Themes.jsx
  Mount.jsx

favicon.svg
apple-touch-icon.svg
og-cover.svg
robots.txt
sitemap.xml
```

## Stack

- HTML statique (pas de build step)
- React + Babel CDN pour les mockups iPhone interactifs
- Geist Sans + Geist Mono (Google Fonts)
- Tout-en-un dans `PulseCalendar.html` + 4 fichiers JSX

## SEO

- 8 langues hreflang (fr, en, en-us, en-gb, en-ca, en-au, es, de, ja)
- 8 pays cibles : FR, CA, US, GB, AU, ES, JP, DE
- Schema.org : MobileApplication, FAQPage, Organization, WebSite, Article
- Sitemap.xml avec hreflang sur la home
- robots.txt avec sitemap reference

## Avant prod

1. Convertir `og-cover.svg` → `og-cover.jpg` 1200×630
2. Générer `favicon.ico` à partir de `favicon.svg`
3. Générer `apple-touch-icon.png` 180×180 à partir de `apple-touch-icon.svg`
4. Brancher le formulaire newsletter (#cta form) à un backend (Brevo, ConvertKit…)
5. Remplacer `https://pulsecalendar.app/` par le vrai domaine dans tous les `<link rel="canonical">` et `<meta property="og:*">`
6. Setup Google Search Console + Bing Webmaster Tools
7. Soumettre `sitemap.xml`

## Couleurs

- Violet signature : `#6244D6` (--violet-500)
- Orange cosmique : `#ff8a3d` (utilisé sur « Commence à avancer »)
- Background : `#07050f` avec aurora blobs animés

## Plateformes

- **iPhone** : disponible au lancement (iOS 17+)
- **iPad** : bientôt
- **Mac** : bientôt
