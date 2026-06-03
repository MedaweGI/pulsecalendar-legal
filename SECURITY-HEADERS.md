# Sécurité HTTP — pulsecalendar.app

État et feuille de route des en-têtes de sécurité. Mis à jour le 2026-06-03.

## ✅ Déjà en place

| Élément | État | Détail |
|---|---|---|
| **TLS** | ✅ Fort | TLS 1.2 + 1.3 uniquement (1.0/1.1 refusés), via Fastly/GitHub |
| **Certificat** | ✅ | Let's Encrypt, **RSA 2048-bit**, SHA-256 |
| **HSTS** | ✅ Préchargé | Le TLD **`.app` est HSTS-preload** au niveau registre Google → HTTPS forcé partout, navigateur n'autorise jamais le HTTP |
| **Cookies** | ✅ Aucun | Pas de tracking ; Plausible est cookieless |
| **SRI** | ✅ Libs figées | `integrity` + `crossorigin` sur React / ReactDOM / Babel (unpkg, versions épinglées) |
| **CSP** | ✅ via `<meta>` | Injectée dans les 13 pages — verrouille les origines (script/style/img/font/connect/frame) |
| **Referrer-Policy** | ✅ via `<meta>` | `strict-origin-when-cross-origin` |

### CSP appliquée (méta)
```
default-src 'self'; base-uri 'self'; object-src 'none'; upgrade-insecure-requests;
script-src 'self' 'unsafe-inline' 'unsafe-eval' https://plausible.io https://unpkg.com https://www.google.com https://www.gstatic.com;
style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;
img-src 'self' data: https:;
font-src 'self' data: https://fonts.gstatic.com;
connect-src 'self' https://plausible.io https://*.googleapis.com https://www.google.com https://www.gstatic.com https://europe-west1-pulsecalendar-9b47f.cloudfunctions.net;
frame-src https://www.google.com; form-action 'self'; manifest-src 'self'
```
> `'unsafe-eval'` est **requis** : la page d'accueil compile React/JSX dans le navigateur (`@babel/standalone`).
> `'unsafe-inline'` est requis : scripts inline (index/support/book) + styles inline.
> Pour s'en débarrasser → pré-compiler le JSX de la home en build (suppression de Babel-standalone) et externaliser les scripts inline.

## ⚠️ Impossible sur GitHub Pages (en-têtes HTTP custom interdits)

GitHub Pages sert des fichiers statiques avec des en-têtes figés. Ces 2 en-têtes **exigent un vrai serveur/proxy** (ignorés en `<meta>`) :

- `X-Content-Type-Options: nosniff`  (−5 à l'audit)
- `X-Frame-Options: DENY` / CSP `frame-ancestors 'none'`  (−20 à l'audit)

### ➡️ Solution recommandée : Cloudflare (gratuit) devant GitHub Pages
1. Ajouter `pulsecalendar.app` à un compte Cloudflare (plan Free).
2. Pointer les nameservers du domaine vers Cloudflare (chez le registrar).
3. DNS : `CNAME pulsecalendar.app → medawegi.github.io` (proxied 🟧).
4. **Rules → Transform Rules → Modify Response Header → Set static** :

```
X-Content-Type-Options: nosniff
X-Frame-Options: DENY
Referrer-Policy: strict-origin-when-cross-origin
Permissions-Policy: geolocation=(), microphone=(), camera=(), payment=()
Cross-Origin-Opener-Policy: same-origin
Content-Security-Policy: default-src 'self'; base-uri 'self'; object-src 'none'; frame-ancestors 'none'; upgrade-insecure-requests; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://plausible.io https://unpkg.com https://www.google.com https://www.gstatic.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; img-src 'self' data: https:; font-src 'self' data: https://fonts.gstatic.com; connect-src 'self' https://plausible.io https://*.googleapis.com https://www.google.com https://www.gstatic.com https://europe-west1-pulsecalendar-9b47f.cloudfunctions.net; frame-src https://www.google.com; form-action 'self'; manifest-src 'self'
```
Une fois la CSP servie en **vrai en-tête**, `frame-ancestors 'none'` devient actif → on pourra retirer les `<meta>` CSP des pages.

### Alternative : héberger sur Cloudflare Pages ou Netlify
Déposer ce fichier `_headers` à la racine (ces hébergeurs le respectent, GitHub Pages non) :
```
/*
  X-Content-Type-Options: nosniff
  X-Frame-Options: DENY
  Referrer-Policy: strict-origin-when-cross-origin
  Permissions-Policy: geolocation=(), microphone=(), camera=(), payment=()
  Cross-Origin-Opener-Policy: same-origin
  Content-Security-Policy: default-src 'self'; base-uri 'self'; object-src 'none'; frame-ancestors 'none'; upgrade-insecure-requests; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://plausible.io https://unpkg.com https://www.google.com https://www.gstatic.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; img-src 'self' data: https:; font-src 'self' data: https://fonts.gstatic.com; connect-src 'self' https://plausible.io https://*.googleapis.com https://www.google.com https://www.gstatic.com https://europe-west1-pulsecalendar-9b47f.cloudfunctions.net; frame-src https://www.google.com; form-action 'self'; manifest-src 'self'
```

## Ressources externes (toutes HTTPS, sources de confiance)
- `unpkg.com` — React/ReactDOM/Babel (épinglés + SRI)
- `plausible.io` — analytics cookieless
- `fonts.googleapis.com` / `fonts.gstatic.com` — Google Fonts (Geist)
- `www.google.com` / `www.gstatic.com` — reCAPTCHA v3 + Firebase SDK (page book)
- `*.googleapis.com` — Firestore + App Check (page book)
- `europe-west1-pulsecalendar-9b47f.cloudfunctions.net` — Cloud Function booking
