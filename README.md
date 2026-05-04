# Pulse Calendar — Legal Pages

3 pages HTML à héberger sur GitHub Pages (ou n'importe quel hébergement statique) avant la soumission App Store :

- `index.html` — landing page de l'app (utilisable comme « Marketing URL » dans App Store Connect)
- `privacy.html` — Politique de confidentialité bilingue FR/EN (« Privacy Policy URL » obligatoire)
- `terms.html` — Conditions d'utilisation bilingues FR/EN (« Terms of Use URL » requise pour les abonnements)

---

## Hébergement en 5 minutes (GitHub Pages gratuit)

1. **Crée un repo public** sur GitHub, nommé par exemple `pulsecalendar-landing`
2. `git clone` le repo en local
3. Copie les 3 fichiers `.html` à la racine
4. Push :
   ```bash
   git add .
   git commit -m "Initial legal pages"
   git push
   ```
5. Sur GitHub → **Settings → Pages** → Source = `main` branch → Save
6. En 1-2 minutes, tes pages sont live à :
   - `https://TON_USERNAME.github.io/pulsecalendar-landing/`
   - `https://TON_USERNAME.github.io/pulsecalendar-landing/privacy.html`
   - `https://TON_USERNAME.github.io/pulsecalendar-landing/terms.html`

## Domaine custom (optionnel, ~12€/an)

Si tu veux `pulsecalendar.app` :

1. Achète le domaine (Gandi, OVH, Namecheap…)
2. Dans GitHub repo → Settings → Pages → Custom domain → entre `pulsecalendar.app`
3. Ajoute un fichier `CNAME` à la racine du repo contenant `pulsecalendar.app`
4. Chez ton registrar DNS, ajoute un `CNAME` pointant vers `TON_USERNAME.github.io`
5. Attends la propagation (~10 min à 2h)

---

## ⚠️ À mettre à jour avant le push

Dans les 3 fichiers HTML, les **emails** et **domaine** sont hardcodés :

- `privacy@pulsecalendar.app`
- `info@Pulsecalendar.fr`

Remplace par tes vraies adresses. Crée les aliases chez ton registrar mail si besoin (Gandi offre 2 alias gratuits avec chaque domaine).

Dans `legal/terms.html` section 5.2, le prix **39,99 €/an** est mentionné — garde-le cohérent avec ton prix App Store Connect.

---

## Mettre à jour les URLs dans l'app

Le paywall (`PaywallViewController.swift` lignes `openTerms` / `openPrivacy`) pointe aujourd'hui vers :

```swift
"https://pulsecalendar.app/terms"
"https://pulsecalendar.app/privacy"
```

**Si tu utilises GitHub Pages sans domaine custom**, remplace par :

```swift
"https://TON_USERNAME.github.io/pulsecalendar-landing/terms.html"
"https://TON_USERNAME.github.io/pulsecalendar-landing/privacy.html"
```

**Si tu achètes `pulsecalendar.app`**, garde les URLs telles quelles.

---

## Apple App Store Connect — URLs à renseigner

Dans App Store Connect → App Information :

| Champ | Valeur à mettre |
|---|---|
| **Privacy Policy URL** | `https://…/privacy.html` |
| **Terms of Use URL** (si abonnement IAP) | `https://…/terms.html` |
| **Marketing URL** | `https://…/index.html` ou `/` |
| **Support URL** | `mailto:info@Pulsecalendar.fr` ou `https://…/index.html#contact` |
