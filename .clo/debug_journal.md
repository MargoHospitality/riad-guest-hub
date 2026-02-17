# riad-guest-hub — Debug Journal

## Focus actuel
Aucun incident bloquant.
PostHog intégré (commit `aa7074c`) — en attente de `VITE_POSTHOG_KEY` pour activation.
Focus suivant : déploiement contenu réel Massiba + Sierra, puis E2E Sierra complet.

---

## Zones fragiles connues

### 1. Persistance du token (localStorage)
Si le guest vide son localStorage entre deux étapes, le token est perdu → écran vide.
Pas d'UI de récupération. Mitigation : token toujours dans les liens via `withToken()`.

### 2. Convention ID dans `useCheckinConfig`
Utilise `cloudbeds_property_id` (pas `property_id`). Si ce champ est absent dans la réponse
`validate-token`, le fetch config échoue silencieusement et toutes les étapes sont affichées.

### 3. Sélection explicite des colonnes côté GEA
`usePages` dépend du champ `external_url` retourné par GEA. A cassé une fois quand la
colonne a été ajoutée sans mettre à jour le `.select()` Drizzle. Règle : toujours des
colonnes explicites dans les requêtes GEA.

---

## Résolus

### [2026-02-17] days_before_checkin super property ajoutée
- Calculée depuis `check_in_date` (retourné par `validate-token`)
- Enregistrée via `posthog.register()` → présente sur tous les events automatiquement
- Valeurs : positif = avant check-in, 0 = jour J, négatif = pendant/après séjour
- Commit : `a2bfa8f`

### [2026-02-17] PostHog analytics intégré
- `src/lib/analytics.ts` créé — wrapper complet, mode cookieless, EU region
- Events couverts : session, check-in funnel (5 steps), Margo Flow round-trip, review (4 events)
- Commit : `aa7074c`
- Activation : `VITE_POSTHOG_KEY` dans Vercel env vars

### [2026-02-16] Suppression des IDs property codés en dur
Tous les composants utilisent désormais `validation.reservation.property_id` depuis le contexte.
Commits : `54a6341`, `bbb8e6e`, `ca22388`.

### [2026-02-16] Calcul total adultes multi-chambres
`validate-token` somme les adultes sur toutes les chambres (pas uniquement `assigned[0]`).
Protégé par test dans GEA : `server/__tests__/publicApi.test.ts`.
